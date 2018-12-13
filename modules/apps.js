const targz=require('targz'),
    crypto=require('crypto'),
    fs = require('fs-extra'),
    utils=require("./utils");
yaml = require('js-yaml');

const root=process.cwd(),
    upload=root+'/tmp/uploads/',
    tmp=root+'/tmp/tmp/',
    compose=root+'/compose/';

function flat(path){
    loop:
    for(;;){
	var no=0;
	var files=fs.readdirSync(path,{withFileTypes : true})
	for(x in files){
	    no++;
	    if(no==2){
		break loop;
	    }
	}
	if(files[0].isDirectory()){
	    path+='/'+files[0].name;
	}
	else{
	    break loop;
	}
    }
    return path+'/';
}

function clean(id){
    return new Promise((resolve,reject) => {
	fs.remove(tmp+id);
	fs.remove(upload+id);
    });
}
function mv(callback,path,id){
    var saveid;
    do{
	saveid=crypto.randomBytes(16).toString('hex');
    }while(fs.existsSync(compose+saveid))
    fs.move(path, compose+saveid, err => {
	clean(id).then(callback(err,saveid));
    })
}
function yamlparse(doc,path){
    if(doc.version != 3){
	throw(`File version must be '3' check docker-compose documentation, your version is ${doc.version}`);
    }else if(doc.services === undefined){
	throw("\"services\" key must be defined, you aren't really using a v3 yml right ? go read the doc");
    }
    function ports(obj){
	for(y in obj.ports){
	    let obje=obj.ports[y];
	    let index=obje.lastIndexOf(":")+1;
	    if(index > -1 ){
		obj.ports[y]=obje.substring(index);
	    }
	}
    }
    function volumes(obj){
	for(y in obj.volumes){
	    let obje=obj.volumes[y];
	    if(typeof obje === 'object' && obje !== null){
		obje.source=utils.sanitizepath(obje.source,path);
	    }
	    else if(obje !== null){
		let split=obje.split(':');
		if(split.length > 1){
		    split[0]=utils.sanitizepath(split[0],path);
		    obj.volumes[y]=split.join(":");
		}
	    }
	}
    }
    for(x in doc.services){
	delete doc.services[x]["container_name"];
	// dynamic ports
	ports(doc.services[x])
	// fix volumes vuln
	volumes(doc.services[x])
    }
    ports(doc);
    volumes(doc);
}
function parse(path){
    var filename='docker-compose.yml'
    return new Promise((resolve,reject) => {
	fs.exists(path+filename, (exist) => {
	    if(exist){
		try {
		    var doc = yaml.safeLoad(fs.readFileSync(path+filename, 'utf8'));
		    yamlparse(doc,path);
		    // console.log(yaml.safeDump(doc))
		    fs.writeFile(path+filename,yaml.safeDump(doc),err => {
			if(err) throw(err);
			resolve(exist);
		    });
		} catch (e) {
		    reject(e.toString());
		}
	    }
	    else{
		reject("No docker-compose.yml found");
	    }
	});
    });
}

module.exports = {
    import: function(callback,id){
	targz.decompress({
	    src: upload+id,
	    dest: tmp+id
	}, function(err){
	    if(err) {
		clean(id);
		callback(err);
	    } else {
		var path = flat(tmp+id);
		parse(path).then(() => {
		    mv(callback,path,id);
		}).catch(reason => {
		    clean(id);
		    callback(false,false,reason);
		});
	    }
	});
    },
}

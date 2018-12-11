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
	if (err) return console.error(err);
	clean(id).then(callback(saveid));
    })
}
function sanitizepath(bind,path){
    bind=utils.delStr(bind,'..');   // ..
    bind=utils.delStr(bind,'\\\/'); // \/
    bind=utils.delStr(bind,'\\\\'); // \\
    bind=utils.delStr(bind,'\/\/'); // //
    bind=utils.delStr(bind,'.\/');  // ./

    if(bind.startsWith("/")){
	bind=bind.substring(1);
    }
    // console.log(path+bind)
    if(fs.existsSync(path+bind)){
	if(fs.lstatSync(path+bind).isSymbolicLink()) throw ("Oh no you aren't (binding a volume to a symlink is forbidden since i don't trust you)");
    }
    bind='./'+bind
    return bind
}
function yamlparse(doc,path){
    if(doc.version != 3){
	throw(`File version must be '3' check docker-compose documentation, your version is ${doc.version}`);
    }
    for(x in doc.services){
	delete doc.services[x]["container_name"];
	// dynamic ports, STILL need to fix the V3 port object
	for(y in doc.services[x].ports){
	    let obj=doc.services[x].ports[y];
	    let index=obj.lastIndexOf(":")+1;
	    if(index > -1 ){
		doc.services[x].ports[y]=obj.substring(index);
	    }
	}
	//fix volumes ../, / and \/still need to fix the new V3 volume object
	for(y in doc.services[x].volumes){
	    let obj=doc.services[x].volumes[y];
	    if(typeof obj === 'object' && obj !== null){
		obj.source=sanitizepath(obj.source,path);
	    }
	    else if(obj !== null){
		let split=obj.split(':');
		if(split.length > 1){
		    split[0]=sanitizepath(split[0],path);
		    doc.services[x].volumes[y]=split.join(":");
		}
	    }
	}
    }
}
function parse(path){
    var filename='docker-compose.yml'
    return new Promise((resolve,reject) => {
	fs.exists(path+filename, (exist) => {
	    if(exist){
		try {
		    var doc = yaml.safeLoad(fs.readFileSync(path+filename, 'utf8'));
		    yamlparse(doc,path);
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
		parse(path).then((resolve) => {
		    mv(callback,path,id);
		}).catch(reason => {
		    clean(id);
		    callback(reason);
		});
	    }
	});
    },
}

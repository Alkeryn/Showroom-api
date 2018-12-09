const targz=require('targz'),
    crypto=require('crypto'),
    fs = require('fs-extra');

const root=process.cwd(),
    upload=root+'/tmp/uploads/',
    tmp=root+'/tmp/tmp/',
    compose=root+'/compose/';

function flat(path){
    loop:
    do{
	var dir=[];
	var no=0;
	var files=fs.readdirSync(path,{withFileTypes : true})
	for(x in files){
	    if(files[x].isDirectory()){
		dir.push(files[x].name)
	    }
	    no++;
	    if(no==2){
		break loop;
	    }
	}
	if(dir.length == 1 && no == 1){
	    path+='/'+dir[0];
	}
    }
    while(dir.length == 1 && no == 1);
    // console.log(path);
    return path;
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

function parse(path){
    return new Promise((resolve,reject) => {
	fs.exists(path+'/docker-compose.yml', (exist) => {
	    resolve(exist);
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
		parse(path).then(resolve => {
		    if(resolve){
			mv(callback,path,id);
		    }
		    else{
			clean(id);
			callback("No docker-compose.yml found")
		    }
		});
	    }
	});
    },
}

const root=process.cwd()

const compose=root+'/compose/';
const child=require("child_process"), //No API nor socket, gonna have to use bash scripts for this one
    fs=require("fs"),
    utils=require("./utils");

const Docker = require("dockerode");
const docker = new Docker({socketPath: '/var/run/docker.sock'});

function spawn(callback,command,args,path){
    if(path === undefined){
	path = '';
    }
    return child.spawn(command,{cwd : compose + path},args);
}

function exec(callback,command,path){
    if(path === undefined){
	path = '';
    }
    child.exec(command,{shell : "/bin/bash",cwd : compose+path},(err,stdout,stderr) => {
	callback(stdout,stderr,err);
    });
}
function execFile(callback,path){
    if(path === undefined){
	path = '';
    }
    child.execFile(root+path,{cwd : compose},(err,stdout,stderr) => {
	callback(stdout,stderr,err);
    });
}
// exec((stdout,stderr) => {console.log(stdout,stderr)},"ls /{tmp,tmpa}")
// exec((stdout,stderr) => {console.log(stdout,stderr)},"ls .")

module.exports = {
    down: function(callback,path){
	exec((stdout,stderr,err) => {callback(stdout,stderr,err)},"docker-compose down &",path)
    },
    _up: function(callback,path){
	exec((stdout,stderr,err) => {callback(stdout,stderr,err)},"docker-compose up &",path) //might make it a spawn or fork
    },
    create: function(callback,path){
	exec((stdout,stderr,err) => {callback(stdout,stderr,err)},"docker-compose up --no-start &",path) // docker-compose start is deprecated
    },
    rm: function(callback,path){
	exec((stdout,stderr,err) => {callback(stdout,stderr,err)},"docker-compose rm &",path)
    },
    start: function(callback,path){
	exec((stdout,stderr,err) => {callback(stdout,stderr,err)},"docker-compose start &",path)
    },
    stop: function(callback,path){
	exec((stdout,stderr,err) => {callback(stdout,stderr,err)},"docker-compose stop &",path)
    },
    kill: function(callback,path){
    },
    ps: function(callback,path){
    },
    logs: function(callback,path){
    },
    list: function(callback){ //callback tous les {nom,id,etc..} de tout les docker-compose, peut prendre tous les arguments callback doit être le premier argument
	let what=arguments
	delete what[0]
	docker.listContainers({all: true}, function(err, containers) {
	    var tmp;
	    var all = [];
	    var dir = [];
	    var list = {};
	    for(x in containers){
		tmp = containers[x].Labels["com.docker.compose.project"]
		if(typeof tmp !== "undefined"){
		    if(typeof list[tmp] === "undefined"){
			list[tmp] = {}
			all.push(tmp);
		    }
		    for(a in what){
			switch(what[a]){
			    case "id":
				if(typeof list[tmp].id === "undefined"){
				    list[tmp].id = [];
				}
				list[tmp].id.push(containers[x].Id);
				break;
			    case "names":
				if(typeof list[tmp].names === "undefined"){
				    list[tmp].names = [];
				}
				list[tmp].names.push(containers[x].Names[0]);
				break;
			    case "image":
				if(typeof list[tmp].image === "undefined"){
				    list[tmp].image = [];
				}
				list[tmp].image.push(containers[x].Image);
				break;
			    case "imageid":
				if(typeof list[tmp].imageid === "undefined"){
				    list[tmp].imageid = [];
				}
				list[tmp].imageid.push(containers[x].ImageID);
				break; //verified to there
			    case "command":
				if(typeof list[tmp].command === "undefined"){
				    list[tmp].command = [];
				}
				list[tmp].command.push(containers[x].Command);
				break;
			    case "created":
				if(typeof list[tmp].created === "undefined"){
				    list[tmp].created = [];
				}
				list[tmp].created.push(containers[x].Created);
				break;
			    case "ports":
				if(typeof list[tmp].ports === "undefined"){
				    list[tmp].ports = [];
				}
				list[tmp].ports.push(containers[x].Ports[0]);
				break;
			    case "labels":
				if(typeof list[tmp].labels === "undefined"){
				    list[tmp].labels = [];
				}
				list[tmp].labels.push(containers[x].Labels);
				break;
			    case "state":
				if(typeof list[tmp].state === "undefined"){
				    list[tmp].state = [];
				}
				list[tmp].state.push(containers[x].State);
				break;
			    case "status":
				if(typeof list[tmp].status === "undefined"){
				    list[tmp].status = [];
				}
				list[tmp].status.push(containers[x].Status);
				break;
			    case "hostconfig":
				if(typeof list[tmp].hostconfig === "undefined"){
				    list[tmp].hostconfig = [];
				}
				list[tmp].hostconfig.push(containers[x].HostConfig);
				break;
			    case "networksettings":
				if(typeof list[tmp].networksettings === "undefined"){
				    list[tmp].networksettings = [];
				}
				list[tmp].networksettings.push(containers[x].NetworkSettings);
				break;
			    case "mounts":
				if(typeof list[tmp].mounts === "undefined"){
				    list[tmp].mounts = [];
				}
				list[tmp].mounts.push(containers[x].Mounts);
				break;
			    case "*":
				if(typeof list[tmp].id === "undefined"){
				    list[tmp] = {
					"id":[],
					"names":[],
					"image":[],
					"imageid":[],
					"command":[],
					"created":[],
					"ports":[],
					"labels":[],
					"state":[],
					"status":[],
					"hostconfig":[],
					"networksettings":[],
					"mounts":[],
				    }
				}
				list[tmp].id.push(containers[x].Id);
				list[tmp].names.push(containers[x].Names[0]);
				list[tmp].image.push(containers[x].Image);
				list[tmp].imageid.push(containers[x].ImageID);
				list[tmp].command.push(containers[x].Command);
				list[tmp].created.push(containers[x].Created);
				list[tmp].ports.push(containers[x].Ports[0]);
				list[tmp].labels.push(containers[x].Labels);
				list[tmp].state.push(containers[x].State);
				list[tmp].status.push(containers[x].Status);
				list[tmp].hostconfig.push(containers[x].HostConfig);
				list[tmp].networksettings.push(containers[x].NetworkSettings);
				list[tmp].mounts.push(containers[x].Mounts);
			}
		    }
		}
	    }
	    fs.readdir(compose,{withFileTypes : true}, (err, files) => {
		if(err) return console.error(err);
		for(x in files){
		    if(files[x].isDirectory()){
			dir.push(files[x].name)
		    }
		}
		let diff=utils.xorAr(all,dir);
		for(x in diff){
		    list[diff[x]] = "down";
		}
		callback(list);
	    });
	});
    },
}

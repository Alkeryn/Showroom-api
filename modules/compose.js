const root=process.cwd()
const compose=root+'/compose/';
const child=require("child_process"); //No API nor socket, gonna have to use bash scripts for this one

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
    list: function(callback){ //callback tous les {nom,id,etc..} de tout les docker, peut prendre tous les arguments callback doit être le premier argument
        what=arguments
        delete what[0]
        docker.listContainers({all: true}, function(err, containers) {
            var tmp;
            var compose = {};
            for(x in containers){
                tmp = containers[x].Labels["com.docker.compose.project"]
                if(typeof tmp !== "undefined"){
                    if(typeof compose[tmp] === "undefined"){
                        compose[tmp] = {}
                    }
                    for(a in what){
                        switch(what[a]){
                            case "id":
                                if(typeof compose[tmp].id === "undefined"){
                                    compose[tmp].id = [];
                                }
                                compose[tmp].id.push(containers[x].Id);
                                break;
                            case "names":
                                if(typeof compose[tmp].names === "undefined"){
                                    compose[tmp].names = [];
                                }
                                compose[tmp].names.push(containers[x].Names[0]);
                                break;
                            case "image":
                                if(typeof compose[tmp].image === "undefined"){
                                    compose[tmp].image = [];
                                }
                                compose[tmp].image.push(containers[x].Image);
                                break;
                            case "imageid":
                                if(typeof compose[tmp].imageid === "undefined"){
                                    compose[tmp].imageid = [];
                                }
                                compose[tmp].imageid.push(containers[x].ImageID);
                                break; //verified to there
                            case "command":
                                if(typeof compose[tmp].command === "undefined"){
                                    compose[tmp].command = [];
                                }
                                compose[tmp].command.push(containers[x].Command);
                                break;
                            case "created":
                                if(typeof compose[tmp].created === "undefined"){
                                    compose[tmp].created = [];
                                }
                                compose[tmp].created.push(containers[x].Created);
                                break;
                            case "ports":
                                if(typeof compose[tmp].ports === "undefined"){
                                    compose[tmp].ports = [];
                                }
                                compose[tmp].ports.push(containers[x].Ports[0]);
                                break;
                            case "labels":
                                if(typeof compose[tmp].labels === "undefined"){
                                    compose[tmp].labels = [];
                                }
                                compose[tmp].labels.push(containers[x].Labels);
                                break;
                            case "state":
                                if(typeof compose[tmp].state === "undefined"){
                                    compose[tmp].state = [];
                                }
                                compose[tmp].state.push(containers[x].State);
                                break;
                            case "status":
                                if(typeof compose[tmp].status === "undefined"){
                                    compose[tmp].status = [];
                                }
                                compose[tmp].status.push(containers[x].Status);
                                break;
                            case "hostconfig":
                                if(typeof compose[tmp].hostconfig === "undefined"){
                                    compose[tmp].hostconfig = [];
                                }
                                compose[tmp].hostconfig.push(containers[x].HostConfig);
                                break;
                            case "networksettings":
                                if(typeof compose[tmp].networksettings === "undefined"){
                                    compose[tmp].networksettings = [];
                                }
                                compose[tmp].networksettings.push(containers[x].NetworkSettings);
                                break;
                            case "mounts":
                                if(typeof compose[tmp].mounts === "undefined"){
                                    compose[tmp].mounts = [];
                                }
                                compose[tmp].mounts.push(containers[x].Mounts);
                                break;
                            case "*":
                                if(typeof compose[tmp].id === "undefined"){
                                    compose[tmp] = {
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
                                compose[tmp].id.push(containers[x].Id);
                                compose[tmp].names.push(containers[x].Names[0]);
                                compose[tmp].image.push(containers[x].Image);
                                compose[tmp].imageid.push(containers[x].ImageID);
                                compose[tmp].command.push(containers[x].Command);
                                compose[tmp].created.push(containers[x].Created);
                                compose[tmp].ports.push(containers[x].Ports[0]);
                                compose[tmp].labels.push(containers[x].Labels);
                                compose[tmp].state.push(containers[x].State);
                                compose[tmp].status.push(containers[x].Status);
                                compose[tmp].hostconfig.push(containers[x].HostConfig);
                                compose[tmp].networksettings.push(containers[x].NetworkSettings);
                                compose[tmp].mounts.push(containers[x].Mounts);
                        }
                    }
                }
            }
            callback(compose);
        });
    },
}

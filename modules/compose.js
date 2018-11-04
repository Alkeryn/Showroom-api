const compose=process.cwd()+'/compose/';
const child=require("child_process"); //No API nor socket, gonna have to use bash scripts for this one

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
    list: function(callback){
    },
}

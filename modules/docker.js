const Docker = require("dockerode");
const docker = new Docker({socketPath: '/var/run/docker.sock'});
module.exports = {
    pull: function(callback,image){
        docker.pull(image, function (err, stream) {
            callback(err,stream);
        });
    },
    create: function(callback,image,name){
        docker.createContainer({Image: image, Cmd: ['/bin/bash'], name: name}, function (err, container) {
            // container.start(function (err, data) {
            // });
            callback(err,container);
        });
    },
    run: function(callback,image){
        docker.run(image, ['bash', '-c', 'ls -al /'], process.stdout, function (err, data, container) {
            callback(data.StatusCode);
        });

    },
    remove: function(callback,containerid){
        var container = docker.getContainer(containerid);
        container.remove(function (err, data) {
            callback(data);
        });

    },
    stop: function(callback,containerid){
        var container = docker.getContainer(containerid);
        container.stop(function (err, data) {
            callback(data);
        });

    },
    start: function(callback,containerid){
        var container = docker.getContainer(containerid);
        container.start(function (err, data) {
            callback(data);
        });
    },
    inspect: function(callback,containerid){
        var container = docker.getContainer(containerid);
        container.inspect( function(err,data) {
            callback(data)
        });
    },
    list: function(callback){ //callback tous les {nom,id,etc..} de tout les docker, peut prendre tous les arguments callback doit être le premier argument
        let what=arguments
        delete what[0]
        docker.listContainers({all: true}, function(err, containers) {
            var list = {};
            for(a in what){
                switch(what[a]){
                    case "id":
                        list.id = [];
                        for(x in containers) {
                            list.id.push(containers[x].Id);
                        }
                        break;
                    case "names":
                        list.names = [];
                        for(x in containers) {
                            list.names.push(containers[x].Names[0]);
                        }
                        break;
                    case "image":
                        list.image = [];
                        for(x in containers) {
                            list.image.push(containers[x].Image);
                        }
                        break;
                    case "imageid":
                        list.imageid = [];
                        for(x in containers) {
                            list.imageid.push(containers[x].ImageID);
                        }
                        break; //verified to there
                    case "command":
                        list.command = [];
                        for(x in containers) {
                            list.command.push(containers[x].Command);
                        }
                        break;
                    case "created":
                        list.created = [];
                        for(x in containers) {
                            list.created.push(containers[x].Created);
                        }
                        break;
                    case "ports":
                        list.ports = [];
                        for(x in containers) {
                            list.ports.push(containers[x].Ports[0]);
                        }
                        break;
                    case "labels":
                        list.labels = [];
                        for(x in containers) {
                            list.labels.push(containers[x].Labels);
                        }
                        break;
                    case "state":
                        list.state = [];
                        for(x in containers) {
                            list.state.push(containers[x].State);
                        }
                        break;
                    case "status":
                        list.status = [];
                        for(x in containers) {
                            list.status.push(containers[x].Status);
                        }
                        break;
                    case "hostconfig":
                        list.hostconfig = [];
                        for(x in containers) {
                            list.hostconfig.push(containers[x].HostConfig);
                        }
                        break;
                    case "networksettings":
                        list.networksettings = [];
                        for(x in containers) {
                            list.networksettings.push(containers[x].NetworkSettings);
                        }
                        break;
                    case "mounts":
                        list.mounts = [];
                        for(x in containers) {
                            list.mounts.push(containers[x].Mounts);
                        }
                        break;
                    case "*":
                        list = {
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
                        for(x in containers) {
                            list.id.push(containers[x].Id);
                            list.names.push(containers[x].Names[0]);
                            list.image.push(containers[x].Image);
                            list.imageid.push(containers[x].ImageID);
                            list.command.push(containers[x].Command);
                            list.created.push(containers[x].Created);
                            list.ports.push(containers[x].Ports[0]);
                            list.labels.push(containers[x].Labels);
                            list.state.push(containers[x].State);
                            list.status.push(containers[x].Status);
                            list.hostconfig.push(containers[x].HostConfig);
                            list.networksettings.push(containers[x].NetworkSettings);
                            list.mounts.push(containers[x].Mounts);
                        }
                        break;
                }
            }
            callback(list);
        });
    },
}

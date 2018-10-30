var Docker = require("dockerode");
var docker = new Docker({socketPath: '/var/run/docker.sock'});
module.exports = {
    pull: function(callback,name){
	docker.pull(name, function (err, stream) {
	});
    },
    run: function(callback,name){
	docker.run(name, ['bash', '-c', 'ls -al /'], process.stdout, function (err, data, container) {
	    callback(data.StatusCode);
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
	what=arguments
	delete what[0]
	docker.listContainers({all: true}, function(err, containers) {
	var retour = {};
	    for(a in what){
		switch(what[a]){
		    case "id":
		        retour.id = [];
			for(x in containers) {
			    retour.id.push(containers[x].Id);
			}
			break;
		    case "names":
		        retour.names = [];
			for(x in containers) {
			    retour.names.push(containers[x].Names[0]);
			}
			break
		    case "image":
                        retour.image = [];
			for(x in containers) {
			    retour.image.push(containers[x].Image);
			}
			break
		    case "imageid":
                        retour.imageid = [];
			for(x in containers) {
			    retour.imageid.push(containers[x].ImageID);
			}
			break //verified to there
		    case "command":
                        retour.command = [];
			for(x in containers) {
			    retour.command.push(containers[x].Command);
			}
			break
		    case "created":
                        retour.created = [];
			for(x in containers) {
			    retour.created.push(containers[x].Created);
			}
			break
		    case "ports":
                        retour.ports = [];
			for(x in containers) {
			    retour.ports.push(containers[x].Ports[0]);
			}
			break
		    case "labels":
                        retour.labels = [];
			for(x in containers) {
			    retour.labels.push(containers[x].Labels);
			}
			break
		    case "state":
                        retour.state = [];
			for(x in containers) {
			    retour.state.push(containers[x].State);
			}
			break
		    case "status":
                        retour.status = [];
			for(x in containers) {
			    retour.status.push(containers[x].Status);
			}
			break
		    case "hostconfig":
                        retour.hostconfig = [];
			for(x in containers) {
			    retour.hostconfig.push(containers[x].HostConfig);
			}
			break
		    case "networksettings":
                        retour.networksettings = [];
			for(x in containers) {
			    retour.networksettings.push(containers[x].NetworkSettings);
			}
			break
		    case "mounts":
                        retour.mounts = [];
			for(x in containers) {
			    retour.mounts.push(containers[x].Mounts);
			}
			break
		    case "*":
			retour = {
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
			    retour.id.push(containers[x].Id);
			    retour.names.push(containers[x].Names[0]);
			    retour.image.push(containers[x].Image);
			    retour.imageid.push(containers[x].ImageID);
			    retour.command.push(containers[x].Command);
			    retour.created.push(containers[x].Created);
			    retour.ports.push(containers[x].Ports[0]);
			    retour.labels.push(containers[x].Labels);
			    retour.state.push(containers[x].State);
			    retour.status.push(containers[x].Status);
			    retour.hostconfig.push(containers[x].HostConfig);
			    retour.networksettings.push(containers[x].NetworkSettings);
			    retour.mounts.push(containers[x].Mounts);
			}
			break
		}
	    }
	    callback(retour);
	});
    },
}

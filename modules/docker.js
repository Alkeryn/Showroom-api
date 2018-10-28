var Docker = require("dockerode");
var docker = new Docker({socketPath: '/var/run/docker.sock'});
module.exports = {
    pull: function(name){
	docker.pull(name, function (err, stream) {
	    // streaming output from pull...
	});
    },
    run: function(name){
	docker.run(name, ['bash', '-c', 'ls -al /'], process.stdout, function (err, data, container) {
	    console.log(data.StatusCode);
	});

    },
    stop: function(containerid){
	var container = docker.getContainer(containerid);
	container.stop(function (err, data) {
	    console.log(data);
	});

    },
    start: function(containerid){
	var container = docker.getContainer(containerid);
	container.start(function (err, data) {
	    console.log(data);
	});
    },
    listlog: function(){ //liste tous les {nom,id,etc..} de tout les docker, peut prendre tous les arguments
	what=arguments
	var retour = {
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
	    "mounts":[]
	}
	docker.listContainers({all: true}, function(err, containers) {
	    for(a in what){
		switch(what[a]){
		    case "id":
			for(x in containers) {
			    retour.id.push(containers[x].Id);
			}
			break;
		    case "names":
			for(x in containers) {
			    retour.names.push(containers[x].Names[0]);
			}
			break
		    case "image":
			for(x in containers) {
			    retour.image.push(containers[x].Image);
			}
			break
		    case "imageid":
			for(x in containers) {
			    retour.imageid.push(containers[x].ImageId);
			}
			break //verified to there
		    case "command":
			for(x in containers) {
			    retour.command.push(containers[x].Command);
			}
			break
		    case "created":
			for(x in containers) {
			    retour.created.push(containers[x].Created);
			}
			break
		    case "ports":
			for(x in containers) {
			    retour.ports.push(containers[x].Ports);
			}
			break
		    case "labels":
			for(x in containers) {
			    retour.labels.push(containers[x].Lables);
			}
			break
		    case "state":
			for(x in containers) {
			    retour.state.push(containers[x].State);
			}
			break
		    case "status":
			for(x in containers) {
			    retour.status.push(containers[x].Status);
			}
			break
		    case "hostconfig":
			for(x in containers) {
			    retour.hostconfig.push(containers[x].Hostconfig);
			}
			break
		    case "networksettings":
			for(x in containers) {
			    retour.networksettings.push(containers[x].NetworkSettings);
			}
			break
		    case "mounts":
			for(x in containers) {
			    retour.mounts.push(containers[x].Mounts);
			}
			break
		}
	    }
	    console.log(retour);
	});
    },
}

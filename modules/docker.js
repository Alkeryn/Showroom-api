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

    }

}

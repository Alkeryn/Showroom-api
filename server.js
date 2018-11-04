noop = function(){};

const sql = require("./modules/postgres.js"),
    docker = require("./modules/docker.js");
    compose = require("./modules/compose.js");

const express = require('express'),
    app = express(),
    fs = require('fs'),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'),
    session = require('cookie-session'),
    bodyParser = require('body-parser');


// docker.list(console.log,'id','names','ports','state');
// docker.list(console.log,'*');
// compose.up(console.log,"medialog");

io.sockets.on('connection', function (socket) {
        socket.emit('message', 'Sucessfully connected');
        });

app.set('views', __dirname+'/html/');
app.use(express.static(__dirname+'/public/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret: 'Scrt'}))

        .get('/:input', function(req, res, next) {
            if(fs.existsSync(__dirname+'/html/'+req.params.input+'.ejs')){
                res.render(req.params.input+'.ejs');
            }
            else{
                next();
            }
        })
// Containers API
        .get('/api/containers', function(req, res) {

		docker.list(function(data){
			res.send(data)},'names','id','image','ports','command','state');
        })
        .post('/api/containers/start', function(req, res) {
	        docker.start(function (data){
	        res.send('started');
	        },req.body.id)
        })
        .post('/api/containers/stop', function(req, res) {
	        docker.stop(function (data){
	        res.send('stoped');
	        },req.body.id)
        })
        .post('/api/containers/state', function(req, res) {
	        docker.inspect(function (data){
	        res.send(data.State.Status)
	        },req.body.id)
        })
        .post('/api/containers/remove', function(req, res) {
	        docker.remove(function (data){
	        res.send('done');
	        },req.body.id)
        })
        .post('/api/containers/create', function(req, res) {
	        docker.create(function (err,container){
	            if(err){
                        res.send(err.message);
                    }
                    else{
                        res.send(container.id);
                    }
	        },req.body.image,req.body.name)
        })
        .post('/api/containers/pull', function(req, res) {
	        docker.pull(function (err,stream){
	            if(err){
                        res.send(err.message);
                    }
                    else{
                        res.send("done");
                    }
	        },req.body.image)
        })
// COMPOSE
        .post('/api/compose/up', function(req, res) {
            compose.create((stdout,stderr,err) => {
                compose.start((stdout,stderr,err) => {
                    res.send("started")
                },req.body.name);
            },req.body.name);

        })
        .post('/api/compose/down', function(req, res) {
            compose.down(function(stdout,stderr,err){
                    res.send("done");
            },req.body.name)
        })
        .post('/api/compose/start', function(req, res) {
            compose.start(function(stdout,stderr,err){
                    res.send("started");
            },req.body.name)
        })
        .post('/api/compose/stop', function(req, res) {
            compose.stop(function(stdout,stderr,err){
                    res.send("stoped");
            },req.body.name)
        })
        .post('/api/compose/create', function(req, res) {
            compose.create(function(stdout,stderr,err){
                    res.send("done");
            },req.body.name)
        })
        .post('/api/compose/rm', function(req, res) {
            compose.rm(function(stdout,stderr,err){
                    res.send("done");
            },req.body.name)
        })
//Default
        .use(function(req, res, next){
                res.redirect('/main');
        })

server.listen(8080);
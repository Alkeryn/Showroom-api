var noop = function(){};
var sql = require("./modules/postgres.js");
var docker = require("./modules/docker.js");
var express = require('express');
var app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });


docker.list(console.log,'id','names','ports','state');
// docker.list(console.log,'*');

io.sockets.on('connection', function (socket) {
        socket.emit('message', 'Sucessfully connected');
        });
app.set('views', __dirname+'/html/');
app.use(express.static(__dirname+'/public/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret: 'Scrt'}))

        .use(function(req, res, next){
                next();
        })

        .get('/main', function(req, res) {
                res.render('main.ejs');
        })
        .get('/main/containers', function(req, res) {

		docker.list(function(call){
			res.send(call)},'*');
        })
        .post('/main/start', function(req, res) {
	        docker.start(function (call){
	        res.send('container started'+call)
	        },req.body.id)
        })
        .post('/main/stop', function(req, res) {
	        docker.stop(function (call){
	        res.send('container stoped')
	        },req.body.id)
        })

        .use(function(req, res, next){
                res.redirect('/main');
        })

server.listen(8080);
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
compose.list(console.log,'names','id');
// compose.up(console.log,"medialog");

io.sockets.on('connection', function (socket) {
        socket.emit('message', 'Sucessfully connected');
        });

app.set('views', __dirname+'/html/');
app.use(express.static(__dirname+'/public/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret: 'Scrt'}))

// WEBUI
        .get('/:input', function(req, res, next) {
            if(fs.existsSync(__dirname+'/html/'+req.params.input+'.ejs')){
                res.render(req.params.input+'.ejs');
            }
            else{
                next();
            }
        })
// GET API
        .get('/api/:type', function(req, res) {
            switch (req.params.type) {
                case 'containers':
                    docker.list(function(data){
                        res.send(data)},'names','id','image','ports','command','state','labels');
                    break;
                case 'compose':
                    compose.list(function(data){
                        res.send(data)},'names','id','image','ports','command','state');
                    break;
                case 'apps':
                    break;
                default:

            }

        })
// POST API
        .post('/api/:type/:action', function(req, res) {
            switch (req.params.type) {
                case 'containers':
                    switch (req.paramas.action) {
                        case 'start':
                            docker.start(function (data){
                                res.send('started');
                            },req.body.id)
                            break;
                        case 'stop':
                            docker.stop(function (data){
                                res.send('stoped');
                            },req.body.id)
                            break;
                        case 'state':
                            docker.inspect(function (data){
                                res.send(data.State.Status)
                            },req.body.id)
                            break;
                        case 'remove':
                            docker.remove(function (data){
                                res.send('done');
                            },req.body.id)
                            break;
                        case 'create':
                            docker.create(function (err,container){
                                if(err){
                                    res.send(err.message);
                                }
                                else{
                                    res.send(container.id);
                                }
                            },req.body.image,req.body.name)
                            break;
                        case 'pull':
                            docker.pull(function (err,stream){
                                if(err){
                                    res.send(err.message);
                                }
                                else{
                                    res.send("done");
                                }
                            },req.body.image)
                            break;
                        default:
                    }
                    break;
                case 'compose':
                    switch (req.params.action) {
                        case 'up':
                            compose.create((stdout,stderr,err) => {
                                compose.start((stdout,stderr,err) => {
                                    if(err){
                                        res.send("Error")
                                    }
                                    else{
                                        res.send("started")
                                    }
                                },req.body.name);
                            },req.body.name);

                            break;
                        case 'down':
                            compose.down(function(stdout,stderr,err){
                                if(err){
                                    res.send("Error")
                                }
                                else{
                                    res.send("done");
                                }
                            },req.body.name)
                            break;
                        case 'start':
                            compose.start(function(stdout,stderr,err){
                                if(err){
                                    res.send("Error")
                                }
                                else{
                                    res.send("started");
                                }
                            },req.body.name)
                            break;
                        case 'stop':
                            compose.stop(function(stdout,stderr,err){
                                if(err){
                                    res.send("Error")
                                }
                                else{
                                    res.send("stoped");
                                }
                            },req.body.name)
                            break;
                        case 'create':
                            compose.create(function(stdout,stderr,err){
                                if(err){
                                    res.send("Error")
                                }
                                else{
                                    res.send("done");
                                }
                            },req.body.name)
                            break;
                        case 'rm':
                            compose.rm(function(stdout,stderr,err){
                                if(err){
                                    res.send("Error")
                                }
                                else{
                                    res.send("done");
                                }
                            },req.body.name)
                            break;
                        default:
                    }
                    break;
                case 'apps':
                    switch (req.paramas.action) {
                        case 'import':
                            break;
                        default:
                    }
                    break;
                default:
            }
        })
//Default
        .use(function(req, res, next){
                res.redirect('/main');
        })

server.listen(8080);
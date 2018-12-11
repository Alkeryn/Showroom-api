noop = function(){};

const   apps = require("./modules/apps.js"),
    compose = require("./modules/compose.js"),
    docker = require("./modules/docker.js");
// sql = require("./modules/data.js");

const express = require('express'),
    app = express(),
    fs = require('fs'),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'),
    session = require('cookie-session'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    upload = multer({dest: 'tmp/uploads/'});


// docker.list(console.log,'id','names','ports','state');
// docker.list(console.log,'*');
// compose.list(console.log,'names','id');
// compose.up(console.log,"medialog");

// apps.import(console.log,"haha");

io.sockets.on('connection', function (socket) {
    socket.emit('message', 'Sucessfully connected');
});

app.set('views', __dirname+'/html/');
app.use(express.static(__dirname+'/public/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret: 'Scrt'}))

// WEBUI
    .use(function(req, res, next) {
	if(fs.existsSync(__dirname+'/html'+req.originalUrl+'.ejs')){
	    res.render(req.originalUrl.substring(1)+'.ejs');
	}
	else{
	    next();
	}
    })
// GET API
    .get('/api/:type', function(req, res, next) {
	switch (req.params.type) {
	    case 'containers':
		docker.list(function(data){
		    res.send(data)},'names','id','image','ports','command','state','compose');
		break;
	    case 'compose':
		compose.list(function(data){
		    res.send(data)},'names','id','image','ports','command','state');
		break;
	    case 'apps':
		break;
	    default:
		next();

	}

    })
// POST API
    .post('/api/:type/:action', function(req, res, next) {
	switch (req.params.type) {
	    case 'containers':
		switch (req.params.action) {
		    case 'start':
			docker.start(function (data){
			    res.send('done');
			},req.body.id)
			break;
		    case 'stop':
			docker.stop(function (data){
			    res.send('done');
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
			next();
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
				    res.send("done")
				}
			    },req.body.id);
			},req.body.id);

			break;
		    case 'down':
			compose.down(function(stdout,stderr,err){
			    if(err){
				res.send("Error")
			    }
			    else{
				res.send("done");
			    }
			},req.body.id)
			break;
		    case 'start':
			compose.start(function(stdout,stderr,err){
			    if(err){
				res.send("Error")
			    }
			    else{
				res.send("done");
			    }
			},req.body.id)
			break;
		    case 'stop':
			compose.stop(function(stdout,stderr,err){
			    if(err){
				res.send("Error")
			    }
			    else{
				res.send("done");
			    }
			},req.body.id)
			break;
		    case 'create':
			compose.create(function(stdout,stderr,err){
			    if(err){
				res.send("Error")
			    }
			    else{
				res.send("done");
			    }
			},req.body.id)
			break;
		    case 'rm':
			compose.rm(function(stdout,stderr,err){
			    if(err){
				res.send("Error")
			    }
			    else{
				res.send("done");
			    }
			},req.body.id)
			break;
		    default:
			next();
		}
		break;
	    case 'apps':
		switch (req.params.action) {
		    case 'import':
			upload.single('tar')(req,res, (err) => {
			    apps.import((id) => {
				res.send(id);
			    },req.file.filename);
			});
			break;
		    default:
			next();
		}
		break;
	    default:
		next();
	}
    })
//Default
    .use(function(req, res, next){
	res.redirect('/main');
    })

server.listen(8080);
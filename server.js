noop = function(){}; //does nothing

const   apps = require("./modules/apps.js"),
    compose = require("./modules/compose.js"),
    docker = require("./modules/docker.js"),
    utils = require("./modules/utils.js");

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


function treat(res,err,data,stderr){
    if(stderr){
	res.status(500).send(stderr);
    }
    else if(err){
	res.status(500).send(err.message);
    }
    else if(data){
	res.send(data);
    }
    else{
	res.send("done");
    }
}
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
		docker.list(function(err,data){
		    res.send(data)},'names','id','image','ports','command','state','compose'); //crash if empty, to fix, can't reproduce issue
		break;
	    case 'compose':
		compose.list(function(err,data){
		    res.send(data)},'names','id','image','ports','command','state');
		break;
	    default:
		next();

	}

    })
// POST API
    .post('/api/:type/:action', (req,res,next) => {
	let args=utils.objtoArr(req.body);
	if(/containers|compose|apps/.test(req.params.type) && !/_up|list|import/.test(req.params.action)){
	    let obj = req.params.type == "containers" ? docker : req.params.type == "compose" ? compose : apps;
	    if(typeof obj[req.params.action] === 'function'){
		args.unshift((err,data,stderr) => {
		    treat(res,err,data,stderr)
		});
		obj[req.params.action].apply(this,args)
	    }
	    else{
		next();
	    }
	}
	else{
	    next();
	}
    })
    .post('/api/apps/:action',(req,res,next) => {
	switch (req.params.action) {
	    case 'import':
		upload.single('tar')(req,res, (err) => {
		    if(req.file != undefined){
			apps.import((err,data,stderr) => {
			    treat(res,err,data,stderr);
			},req.file.filename);
		    }
		    else{
			res.status(500).send("Wrong request, use tar=");
		    };
		});
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
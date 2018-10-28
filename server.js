const { Client } = require('pg')
const client = new Client()
var test = async function(){
    const res = await client.query('SELECT $1::text as message', ['Hello world!'])
    console.log(res.rows[0].message) // Hello world!
    await client.end()
}
test()

var docker = require("./modules/docker.js")
var express = require('express');
var app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
docker.list(console.log,'names','id','image');


io.sockets.on('connection', function (socket) {
        socket.emit('message', 'Sucessfully connected');
        });
app.set('views', __dirname+'/html/');
app.use(express.static(__dirname+'/public/'));
app.use(session({secret: 'Scrt'}))

        .use(function(req, res, next){
                next();
        })

        .get('/main', function(req, res) {
                res.render('main.ejs');
        })

        .use(function(req, res, next){
                res.redirect('/main');
        })

server.listen(8080);
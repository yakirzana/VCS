var path = require("path");
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bl = require('./bl');
var Log = require('./logs/log');
var log = new Log("Error.txt");

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../Client/views'));
app.use(express.static(path.join(__dirname, '../Client/public')));

start();

function run() {
    require('./routes')(app, bl);
    require('./sockets')(io, bl);

    http.listen(80, function() {
        console.log('listening on port 80');
    });
}

function start() {
    try {
        run();
    } catch (err) {
        log.error(err);
        console.log("Error: " + err + " Restarting...");
        run();
    }
}







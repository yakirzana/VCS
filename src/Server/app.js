var path = require("path");
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bl = require('./bl');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../Client/views'));
app.use(express.static(path.join(__dirname, '../Client/public')));

require('./routes')(app, bl);
require('./sockets')(io, bl);

http.listen(80, function() {
    console.log('listening on port 80');
});


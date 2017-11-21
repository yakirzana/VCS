const path = require("path");
const express = require('express');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var strings = require('./Lang/heb.json');
var Room = require('./classes/Room.js');

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../Client/views'));
app.use(express.static(path.join(__dirname, '../Client/public')));

var rooms = [];

function getRoomById(roomId) {
    var room = rooms.find (o => o.id === roomId);
    return room;
}

app.get('/room/:roomId*', function(req, res) {
    var roomId = req.params.roomId;
    var room = getRoomById(roomId);
    if (room === undefined) {
        room = new Room(roomId, true, "name", "desc", false, true);
        rooms.push(room);
    }

    res.render('pages/room', {page: "room" , strings: strings, room});
});

app.get('/', function(req, res) {
    res.render('pages/home', {page:"home", strings: strings});
});


io.on('connection', function(socket) {
    var roomId = socket.handshake.headers.referer.split("/").pop();
    var room = getRoomById(roomId);
    socket.join(roomId);

    socket.on('init', function () {
        socket.emit('init', room.userInControl);
    });

    socket.on('disconnect', function () {
        if (socket.user == undefined) return;
        releaseControl(socket.user);
    });

    socket.on('update', function (data) {
        socket.broadcast.to(roomId).emit('update', data);
    });

    socket.on('lockFromClient', function (user) {
        if (user == "")
            user = "לא ידוע";
        socket.user = user;
        //TODO: need to move to on connection when we have user before asses
        room.isLocked = true;
        room.userInControl = user;
        socket.broadcast.to(roomId).emit('lockFromServer', user);
    });

    socket.on('releaseFromClient', function (user) {
        releaseControl(user);
    });

    function releaseControl(user) {
        if(room == undefined || user != room.userInControl) return;
        room.isLocked = false;
        room.userInControl = undefined;
        socket.broadcast.to(roomId).emit('releaseFromServer', user);
    }
});

http.listen(80, function() {
    console.log('listening on localhost:80');
});


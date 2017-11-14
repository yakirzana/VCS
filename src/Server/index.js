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

   socket.on('ready', function(data) {
        //updateCurrentRoomState(socket, roomId);
   });

   socket.on('update', function(data) {
       //getRoomById(roomId).base64 = data;
       socket.broadcast.to(roomId).emit('update', data);
   });

    socket.on('lockFromClient', function(user) {
        if(user == "")
            user = "לא ידוע";
        room.isLocked = true;
        room.userInControl = user;
        socket.broadcast.to(roomId).emit('lockFromServer', user);
    });

    socket.on('releaseFromClient', function(user) {
        if(user == "")
            user = "לא ידוע";
        room.isLocked = false;
        room.userInControl = undefined;
        socket.broadcast.to(roomId).emit('releaseFromServer', user);
    });
})

http.listen(80, function() {
   console.log('listening on localhost:80');
});
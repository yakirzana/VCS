const path = require("path");
const express = require('express');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, '../Client/public')));

app.get('/room/:roomId*', function(req, res) {
    res.sendFile('index.html', { root: path.join(__dirname, '../Client') });
});

var rooms = [];

function getRoomById(roomId) {
    var room = rooms.find(o => o.id === roomId);
    if(room === undefined){
        room = {
            id : roomId,
            base64 : null
        };
        rooms.push(room);
    }
    return room;
}

function updateCurrentRoomState(socket, roomId) {
    var room = getRoomById(roomId);
    if(room.base64 != null)
        socket.emit('update', room.base64);
}

io.on('connection', function(socket) {
   var roomId = socket.handshake.headers.referer.split("/").pop();
   socket.join(roomId);

   socket.on('ready', function(data) {
        //updateCurrentRoomState(socket, roomId);
   });

   socket.on('update', function(data) {
       getRoomById(roomId).base64 = data;
       socket.broadcast.to(roomId).emit('update', data);
   });

    socket.on('lockFromClient', function(user) {
        if(user == "")
            user = "לא ידוע";
        socket.broadcast.to(roomId).emit('lockFromServer', user);
    });

    socket.on('releaseFromClient', function(user) {
        if(user == "")
            user = "לא ידוע";
        socket.broadcast.to(roomId).emit('releaseFromServer', user);
    });
})

http.listen(80, function() {
   console.log('listening on localhost:80');
});
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/room/:roomId*', function(req, res) {
	//res.send(req.params.roomId);
	res.sendFile('index.html' , { root : __dirname});
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
        updateCurrentRoomState(socket, roomId);
    });
   socket.on('update', function(data) {
       getRoomById(roomId).base64 = data;
       socket.broadcast.to(roomId).emit('update', data);
   });
})

http.listen(80, function() {
   console.log('listening on localhost:80');
});
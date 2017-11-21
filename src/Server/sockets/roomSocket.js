module.exports = function(io, data) {
    var io = io.of('/rooms');
    io.on('connection', function(socket) {
        var roomId = socket.handshake.headers.referer.split("/").pop();
        var room = data.rooms.getRoomById(roomId);
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
}



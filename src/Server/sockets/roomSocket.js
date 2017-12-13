module.exports = function(io, bl) {
    var io = io.of('/rooms');
    io.on('connection', async function(socket) {
        var roomId = socket.handshake.headers.referer.split("/").pop();
        var room = await bl.rooms.getRoomById(roomId);
        if(room == undefined)
            socket.disconnect();
        socket.join(roomId);

        socket.on('init', function () {
            socket.emit('init', room.userInControl);
        });

        socket.on('disconnect', function () {
            if (socket.user == undefined) return;
            releaseControl(socket.user);
        });

        socket.on('update', function (update) {
            socket.broadcast.to(roomId).emit('update', update);
            room.base64 = update;
            bl.rooms.saveRoom(room);
        });

        socket.on('lockFromClient', function (user) {
            socket.user = user;
            room.isLocked = true;
            room.userInControl = user;
            bl.rooms.saveRoom(room);
            socket.broadcast.to(roomId).emit('lockFromServer', user);
        });

        socket.on('releaseFromClient', function (user) {
            releaseControl(user);
        });

        function releaseControl(user) {
            if(room == undefined || user != room.userInControl) return;
            room.isLocked = false;
            room.userInControl = undefined;
            bl.rooms.saveRoom(room);
            socket.broadcast.to(roomId).emit('releaseFromServer', user);
        }
    });
}



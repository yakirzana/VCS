var usersInRooms = [];

module.exports = function (io, sl) {
    io = io.of('/rooms');
    io.on('connection', async function(socket) {
        var roomId = socket.handshake.headers.referer.split("/").pop();
        var room = await sl.rooms.getRoomById(roomId);
        if(room == undefined)
            socket.disconnect();
        socket.join(roomId);

        socket.on('init', function (username) {
            socket.emit('init', room.userInControl);
            socket.user = username;

            addUser(socket, roomId);
        });

        socket.on('disconnect', function () {
            if (socket.user == undefined) return;
            releaseControl(socket.user);

            removeUser(socket, roomId);
        });

        socket.on('update', function (update) {
            socket.broadcast.to(roomId).emit('update', update);
            room.base64 = update;
            sl.rooms.saveRoom(room);
        });

        socket.on('lockFromClient', function (user) {
            socket.user = user;
            room.isLocked = true;
            room.userInControl = user;
            sl.rooms.saveRoom(room);
            socket.broadcast.to(roomId).emit('lockFromServer', user);
        });

        socket.on('releaseFromClient', function (user) {
            releaseControl(user);
        });

        function releaseControl(user) {
            if(room == undefined || user != room.userInControl) return;
            room.isLocked = false;
            room.userInControl = undefined;
            sl.rooms.saveRoom(room);
            socket.broadcast.to(roomId).emit('releaseFromServer', user);
        }
    });
};


function addUser(socket, roomId) {
    console.log(socket.user + " is connect to room " + roomId);
    if (usersInRooms[roomId] == undefined)
        usersInRooms[roomId] = [];
    usersInRooms[roomId].push(socket.user);
    socket.emit('listOfUsers', usersInRooms[roomId]);
    socket.broadcast.to(roomId).emit('listOfUsers', usersInRooms[roomId]);
}

function removeUser(socket, roomId) {
    console.log(socket.user + " is disconnect from room " + roomId);
    if (usersInRooms[roomId] == undefined) return;
    usersInRooms[roomId] = usersInRooms[roomId].filter(e => e !== socket.user);
    socket.emit('listOfUsers', usersInRooms[roomId]);
    socket.broadcast.to(roomId).emit('listOfUsers', usersInRooms[roomId]);
}

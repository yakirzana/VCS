var config = require('../config');
var usersInRooms = [];
var userCount = [];

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
            sendPost(config.urlRestDrag, roomId, socket.user);
        });

        socket.on('ans', function () {
            sendPost(config.urlRestDSxc, roomId, socket.user);
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
    if (usersInRooms[roomId] == undefined)
        usersInRooms[roomId] = [];
    if (userCount[roomId] == undefined)
        userCount[roomId] = new Map();
    if (!userCount[roomId].has(socket.user))
        userCount[roomId].set(socket.user, 0);
    if (userCount[roomId].get(socket.user) == 0)
        usersInRooms[roomId].push(socket.user);
    userCount[roomId].set(socket.user, userCount[roomId].get(socket.user) + 1);
    socket.emit('listOfUsers', usersInRooms[roomId]);
    socket.broadcast.to(roomId).emit('listOfUsers', usersInRooms[roomId]);
    sendPost(config.urlRestConnect, roomId, socket.user);
}

function removeUser(socket, roomId) {
    if (usersInRooms[roomId] == undefined) return;
    if (userCount[roomId].has(socket.user) && userCount[roomId].get(socket.user) == 1) {
        usersInRooms[roomId] = usersInRooms[roomId].filter(e => e !== socket.user);
    }
    userCount[roomId].set(socket.user, userCount[roomId].get(socket.user) - 1);
    socket.emit('listOfUsers', usersInRooms[roomId]);
    socket.broadcast.to(roomId).emit('listOfUsers', usersInRooms[roomId]);
    sendPost(config.urlRestDisconnect, roomId, socket.user);
}

function sendPost(url, roomID, username) {
    var request = require('request');
    var moment = require('moment');
    var date = moment().format('DD/MM/YYYY H:mm:ss');
    var options = {
        uri: url,
        method: 'POST',
        json: {
            "room_id": roomID,
            "user_id": username,
            "timestamp": date
        }
    };
    console.log("send post to " + url + " with param: " + roomID + " " + username + " " + date);

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
        if (error)
            console.log("error on roomSocket " + error);
    });

}

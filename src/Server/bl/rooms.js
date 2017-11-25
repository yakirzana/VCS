var Room = require('../classes/Room.js');

var rooms = [];

module.exports.getRoomById = function(roomId) {
    var room = rooms.find (o => o.id === roomId);
    return room;
};

module.exports.addRoom = function (id, isLocked, name, desc, isTimeLimit, timeLimit) {
    room = new Room(id, isLocked, name, desc, isTimeLimit, timeLimit);
    rooms.push(room);
    return room;
};
var Room = require('../classes/Room.js');

module.exports = function (dl) {
    this.getRoomById = async function (id) {
        var room = await dl.rooms.getRoomById(id);
        if(room == null)
            throw new Error("cannot find room");
        return room;
    };

    this.addRoom = function (id, isLocked, name, desc, isTimeLimit, timeLimit) {
        room = new Room(id, isLocked, name, desc, isTimeLimit, timeLimit);
        dl.rooms.addRoom(room);
        return room;
    };

    this.deleteRoom = async function (id) {
        dl.rooms.deleteRoom(id);
    };

    this.saveRoom = function(room) {
        dl.rooms.saveRoom(room);
    }
}
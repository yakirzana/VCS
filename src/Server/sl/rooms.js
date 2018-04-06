var Room = require('../classes/Room.js');

module.exports = function (bl) {
    this.getRoomById = async function (id) {
        var room = await bl.rooms.getRoomById(id);
        return room;
    };

    this.getRoomsOfUser = async function (username) {
        var roomsIDs = await bl.rooms.getRoomsOfUser(username);
        var rooms = [];
        for (var i = 0; i < roomsIDs.length; i++) {
            var room = await bl.rooms.getRoomById(roomsIDs[i] + "");
            rooms.push(room.toJson());
        }
        return rooms;
    };

    this.saveRoom = function (room) {
        bl.rooms.saveRoom(room);
        return true;
    };

    this.addRoom = async function (name, descriptions, teacherUserName, timeLimit, classID) {
        var isTimeLimit = timeLimit != 0;
        var id = await  bl.rooms.addRoom(false, name, descriptions, isTimeLimit, timeLimit, null, []);
        await bl.classes.addRoomToClass(id, classID);
        return id;
    }
};
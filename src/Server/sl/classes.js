var Class = require('../classes/Class.js');

module.exports = function (bl) {
    this.getRoomsInClass = async function (classID) {
        classID = parseInt(classID);
        var rooms = await bl.classes.getRoomsInClass(classID);
        var roomsObj = [];
        for (var i = 0; i < rooms.length; i++) {
            var room = await bl.rooms.getRoomById(rooms[i] + "");
            roomsObj.push(await room.toJson());
        }
        return roomsObj;
    };

    this.getClassByRoomID = async function (roomID) {
        var classes = await bl.classes.getClassByRoomID(roomID);
        return classes;
    };

    this.getClassByID = async function (classID) {
        var clss = await bl.classes.getClassByID(classID);
        return clss;
    };
};
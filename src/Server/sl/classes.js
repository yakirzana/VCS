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
        var classID = parseInt(classID);
        return await bl.classes.getClassByID(classID);
    };

    this.getRoomsAccesible = async function (classID, username) {
        var res = [];
        var classList = await bl.classes.getClassByUser(username);
        if (classID in classList) {
            var roomList = await bl.classes.getRoomsInClass(classID);
            for (var room of roomList) {
                var userList = await bl.rooms.getUsersInRoomById(room);
                if (username in userList) {
                    res.push(room);
                }
            }
        }
        else {
            throw new Error("cannot find classID");
        }

        return res;
    };
};
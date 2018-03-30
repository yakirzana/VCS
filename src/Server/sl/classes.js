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
        classList = classList.filter(function (item, pos) {
            return classList.indexOf(item) == pos;
        })
        if (classID in classList) {
            var roomList = await bl.classes.getRoomsInClass(classID);
            for (var room of roomList) {
                var userList = await bl.rooms.getUsersInRoomById(room + "");
                for (var i = 0; i < userList.length; ++i) {
                    if (userList[i] == username) {
                        res.push(room);
                    }
                }
            }
        }
        else {
            return res;
        }

        res = res.filter(function (item, pos) {
            return res.indexOf(item) == pos;
        })

        return res;
    };
};
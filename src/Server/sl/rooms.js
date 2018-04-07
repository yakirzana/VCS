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

    this.deleteRoom = async function (id) {
        classList = [];
        var classes = await bl.classes.getClassByRoomID(id);
        for (clss of classes) {
            classList.push(await bl.classes.getClassByID(clss));
        }
        for (cls of classList) {
            await bl.classes.deleteRoomFromClass(id, cls.classID);
        }
        try {
            await bl.rooms.getRoomById(id);
        }
        catch (err) {
            throw new Error("Error in delete room, invalid roomID");
        }
        await bl.rooms.deleteRoom(id);
        return true;
    };

    this.saveRoom = function (room) {
        bl.rooms.saveRoom(room);
        return true;
    };

    this.addRoom = async function (name, descriptions, teacherUserName, timeLimit, classID) {
        if (name == "" || descriptions == "" || teacherUserName == "")
            throw new Error("Error in add room, invalid parameters");
        if (name.indexOf('\n') > -1 || name.indexOf('\t') > -1 || name.indexOf('@') > -1)
            throw new Error("Error in add room,invalid characters, please try again");
        var found = false;
        var allClasses = await bl.classes.getAllClasses();
        for (clss of allClasses) {
            if (clss.classID == classID && teacherUserName == clss.teacherUserName)
                found = true;
        }
        if (found) {
            var isTimeLimit = timeLimit != 0;
            var id = await  bl.rooms.addRoom(false, name, descriptions, isTimeLimit, timeLimit, null, []);
            await bl.classes.addRoomToClass(id, classID);
            return id;
        }
        throw new Error("Error in add room, invalid class ID or teachername");
    }
};
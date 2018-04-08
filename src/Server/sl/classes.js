var Class = require('../classes/Class.js');

module.exports = function (bl) {
    async function getRoomsByID(rooms) {
        var roomsObj = [];
        for (var i = 0; i < rooms.length; i++) {
            var room = await bl.rooms.getRoomById(rooms[i] + "");
            roomsObj.push(await room.toJson());
        }
        return roomsObj;
    }

    async function getClassesByID(classes) {
        var classesObj = [];
        for (var i = 0; i < classes.length; i++) {
            var cls = await bl.classes.getClassByID(classes[i]);
            classesObj.push(await cls);
        }
        return classesObj;
    }

    this.addNewClass = async function (name, descriptions, teacherUserName) {
        return await bl.classes.addNewClass(name, descriptions, teacherUserName, [])
    };

    this.removeClass = async function (classID) {
        classID = parseInt(classID);
        await bl.classes.removeClass(classID);
    };

    this.getRoomsInClass = async function (classID) {
        classID = parseInt(classID);
        var rooms = await bl.classes.getRoomsInClass(classID);
        return await getRoomsByID(rooms);
    };

    this.getClassByRoomID = async function (roomID) {
        var classes = await bl.classes.getClassByRoomID(roomID);
        return classes;
    };

    this.getClassByID = async function (classID) {
        var classID = parseInt(classID);
        return await bl.classes.getClassByID(classID);
    };

    this.getRoomsAccessible = async function (classID, username) {
        var res = [];
        var classList = await bl.classes.getClassByUser(username);
        if (classID in classList) {
            var roomList = await bl.classes.getRoomsInClass(classID);
            for (var room of roomList) {
                var userList = await bl.rooms.getUsersInRoomById(room + "");
                for (var i = 0; i < userList.length; ++i) {
                    if (userList[i] == username && res.indexOf(room) <= -1) {
                        res.push(room);
                    }
                }
            }
        }
        return await getRoomsByID(res);
    };

    this.getClassesOfUser = async function (username) {
        var classes = await bl.classes.getClassByUser(username);
        return await getClassesByID(classes);
    };

    this.getClassesOfTeach = async function (username) {
        return await bl.classes.getAllClassesOfTeach(username);
    };

    this.editClass = async function (classID, name, desc) {
        await bl.classes.editClass(classID, name, desc);
    }

};
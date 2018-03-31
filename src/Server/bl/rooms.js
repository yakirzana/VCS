var Room = require('../classes/Room.js');

module.exports = function (dl) {
    this.getRoomById = async function (id) {
        var room = await dl.rooms.getRoomById(id);
        if(room == null)
            throw new Error("cannot find room");
        return room;
    };

    this.getUsersInRoomById = async function (id) {
        var room = await dl.rooms.getRoomById(id);
        if (room == null)
            throw new Error("cannot find room");
        return room.listUsers;
    };

    this.addUserToRoom = async function (id, username) {
        await dl.rooms.addUserToRoom(id, username);
    };

    this.deleteUserFromRoom = async function (id, username) {
        await dl.rooms.deleteUserFromRoom(id, username);
    };

    this.addRoom = function (id, isLocked, name, desc, isTimeLimit, timeLimit, base64, listUser) {
        room = new Room(id, isLocked, name, desc, isTimeLimit, timeLimit, base64, listUser);
        dl.rooms.addRoom(room);
        return room;
    };

    this.deleteRoom = async function (id) {
        dl.rooms.deleteRoom(id);
    };

    this.getRoomsOfUser = async function (username) {
        var res = [];
        var user = await dl.users.getUserByUserName(username);
        if (user.isTeacher) {
            var allClasses = await dl.classes.getAllClasses();
            for (var clss of allClasses) {
                if (clss.teacherUserName == username) {
                    for (var room of clss.roomList) {
                        if (res.indexOf(room) <= -1)
                            res.push(room);
                    }
                }
            }
        }
        else {
            return await dl.rooms.getRoomsOfUser(username);
        }
        return res;
    };

    this.saveRoom = function(room) {
        dl.rooms.saveRoom(room);
    };

};
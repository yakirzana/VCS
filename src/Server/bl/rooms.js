var Room = require('../classes/Room.js');

module.exports = function (dl) {
    this.getRoomById = async function (id) {
        id = parseInt(id);
        var room = await dl.rooms.getRoomById(id);
        if(room == null)
            throw new Error("cannot find room in bl.getRoomById");
        return room;
    };

    this.getUsersInRoomById = async function (id) {
        var room = await dl.rooms.getRoomById(id);
        if (room == null)
            throw new Error("cannot find room in bl.getUsersInRoomById");
        return room.listUsers;
    };

    this.addUserToRoom = async function (id, username) {
        await dl.rooms.addUserToRoom(id, username);
    };

    this.deleteUserFromRoom = async function (id, username) {
        await dl.rooms.deleteUserFromRoom(id, username);
    };

    this.addRoom = async function (isLocked, name, desc, isTimeLimit, timeLimit, base64, listUser) {
        var roomID = await this.getNextID();
        var room = new Room(roomID, isLocked, name, desc, isTimeLimit, timeLimit, base64, listUser);
        dl.rooms.addRoom(room);
        return roomID;
    };

    this.deleteRoom = async function (id) {
        try {
            await dl.rooms.deleteRoom(id);
        } catch (err) {
            throw err;
        }
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

    this.getNextID = async function () {
        return await dl.rooms.getMaxID() + Math.floor((Math.random() * 10) + 1);
    };

};
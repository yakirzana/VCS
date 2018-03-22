var Room = require('../classes/Room.js');

module.exports = function (db) {
    this.addRoom = function (room) {
        db.collection('rooms').insertOne(room, function (err, r) {
        });
    };

    this.getRoomById = async function(id) {
        try {
            let room = await db.collection('rooms').findOne({_id: id});
            if(room == null)
                throw new Error("cant find room");
            room = Object.assign(new Room, room);
            return room;
        } catch (err) {
            return null;
        }
    };

    this.getAllRooms = async function () {
        try {
            let room = await db.collection('rooms').find().toArray();
            if (room == null)
                throw new Error("there is a problem to find room");
            var roomList = [];
            for (var rom of room) {
                var roomInSystem = Object.assign(new Room, rom);
                roomList.push(roomInSystem);
            }
            return roomList;
        } catch (err) {
            return null;
        }
    };

    this.getRoomsOfUser = async function (username) {
        var res = [];
        var allRooms = await this.getAllRooms();
        for (var room of allRooms) {
            if (username in room.listUsers) {
                res.push(room.roomID);
            }
        }
        return res;

    };

    this.deleteRoom = function (id) {
        db.collection('rooms').deleteOne({_id: id}, function (err, r) {
        });
    };

    this.saveRoom = async function (room) {
        var room = await room;
        var myquery = { _id: room.id };
        var newvalues = { $set: {
                _isLocked: room.isLocked,
                _userInControl: room.userInControl,
                _name: room.name,
                _desc: room.desc,
                _isTimeLimit: room.isTimeLimit,
                _timeLimit: room.timeLimit,
            _base64: room.base64,
            _listUsers: room.listUsers
            }};

        db.collection("rooms").updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
        });

    };

    this.addUserToRoom = async function (id, username) {
        var room = await this.getRoomById(id);
        room.listUsers.push(username);
        this.saveRoom(room);
    };

    this.deleteUserFromRoom = async function (id, username) {
        var room = await this.getRoomById(id);
        var index = room.listUsers.indexOf(username);
        if (index >= 0) {
            room.listUsers.splice(index, 1);
        }
        this.saveRoom(room);
    };

};
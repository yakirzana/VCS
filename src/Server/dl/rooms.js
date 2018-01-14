var Room = require('../classes/Room.js');

module.exports = function (db) {
    this.addRoom = function (room) {
        db.collection('rooms').insertOne(room, function (err, r) {
            if (err == null)
                console.log("added room to db");
            else
                console.log(err);
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
            console.log("Error: ", err);
            return null;
        }
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
                _base64: room.base64
            }};

        db.collection("rooms").updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
        });

    }
};
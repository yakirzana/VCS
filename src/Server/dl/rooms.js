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
    }
};
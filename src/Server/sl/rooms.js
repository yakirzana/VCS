var Room = require('../classes/Room.js');

module.exports = function (bl) {
    this.getRoomById = async function (id) {
        var room = await bl.rooms.getRoomById(id);
        return room;
    };

    this.saveRoom = function (room) {
        bl.rooms.saveRoom(room);
        return true;
    };
};
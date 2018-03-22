var Class = require('../classes/Class.js');

module.exports = function (bl) {
    this.getRoomsInClass = async function (classID) {
        var rooms = await bl.classes.getRoomsInClass(classID);
        for (var i = 0; i < rooms.length; i++)
            rooms[i] = rooms[i].toJson();
        return rooms;
    }
};
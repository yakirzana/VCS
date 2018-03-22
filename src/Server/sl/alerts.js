module.exports = function (bl) {
    this.getAlertFromRoom = function (roomID) {
        return bl.alerts.getAlertForRoom(roomID);
    };

    this.getAlertsFromClass = async function (classID) {
        var rooms = await bl.classes.getRoomsInClass(classID);
        var alerts = {};
        for (var i = 0; i < rooms.length; i++) {
            alerts[rooms[i].id] = bl.getAlertForRoom(rooms[i].id);
        }
        return alerts;
    };

};

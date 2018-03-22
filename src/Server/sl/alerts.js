module.exports = function (bl) {
    this.addAlert = function (roomID, alertType) {
        bl.alerts.addAlert(roomID, alertType);
    };

    this.removeAlert = function (roomID) {
        bl.alerts.addAlert(roomID);
    };

    this.getAlertFromRoom = function (roomID) {
        return bl.alerts.getAlertFromRoom(roomID);
    };

    this.getAlertsFromClass = async function (classID) {
        classID = parseInt(classID);
        var rooms = await bl.classes.getRoomsInClass(classID);
        var alerts = {};
        for (var i = 0; i < rooms.length; i++) {
            alerts[rooms[i]] = this.getAlertFromRoom(rooms[i]);
        }
        return alerts;
    };

};

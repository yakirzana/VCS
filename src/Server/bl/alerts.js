module.exports = function (dl) {
    this.roomsAlert = {};

    this.addAlert = async function (roomID, alertType) {
        this.roomsAlert[roomID] = alertType;
    };

    this.removeAlert = function (roomID) {
        this.roomsAlert[roomID] = undefined;
    };

    this.getAlertForRoom = function (roomID) {
        return this.roomsAlert[roomID];
    };

};
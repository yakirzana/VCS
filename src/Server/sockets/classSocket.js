module.exports = function (io, sl, log) {
    io = io.of('/classes');
    var socketClass;
    io.on('connection', function (socket) {
        socketClass = socket;
        var classID = socket.handshake.headers.referer.split("/").pop();
        socket.join("class" + classID);
    });

    this.addAlert = function (classID, roomID, alertType) {
        var moment = alertType["critical_moment"];
        log.info("got critical_moment: " + JSON.stringify(moment));
        if (moment == "NONE") return;
        var msg = {roomID: roomID, alertType: moment};
        msg = JSON.stringify(msg);
        if (io !== undefined)
            io.emit('alert', msg);
        sl.alerts.addAlert(roomID, moment);
        log.info("got alert to room " + roomID + " alertType " + moment);
    };

    this.updatePic = function (pic) {
        if (io !== undefined)
            io.emit('picUpdate', pic);
    }
};



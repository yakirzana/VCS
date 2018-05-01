module.exports = function (io, sl, log) {
    io = io.of('/classes');
    var socketClass;
    io.on('connection', function (socket) {
        socketClass = socket;
        var classID = socket.handshake.headers.referer.split("/").pop();
        socket.join("class" + classID);
        log.info(socket + " joined");
    });

    this.addAlert = function (classID, roomID, alertType) {
        var moment = alertType["critical_moment"];
        if (moment == "NONE") return;
        var msg = {roomID: roomID, alertType: moment};
        msg = JSON.stringify(msg);
        if (io !== undefined)
            io.emit('alert', msg);
        sl.alerts.addAlert(roomID, moment);
        log.info("got alert to class " + classID + " room " + roomID + " alertType " + moment);
    };
};



var config = require('../config');

module.exports = function (io, sl, classSocket, log) {
    io = io.of('/chat');
    io.on('connection', async function(socket) {
        var roomId = socket.handshake.headers.referer.split("/").pop();
        socket.join(roomId);
        socket.on('addMsg', function (msg) {
            sl.chats.addNewMessage(msg._username, msg._date, msg._msg, msg._roomID);
            socket.broadcast.to(msg._roomID).emit('addMsg', msg);
            log.info("got Chet Message " + JSON.stringify(msg) + " on room " + roomId);
            if (!msg._isTeacher)
                analyzeMsg(classSocket, msg, log);
        });

    });
};

function analyzeMsg(classSocket, msg, log) {
    var request = require('request');

    var options = {
        uri: config.urlRestSendMessage,
        method: 'POST',
        json: {
            "message_text": msg._msg,
            "room_id": msg._roomID,
            "user_id": msg._username,
            "timestamp": msg._date
        }
    };

    console.log("ChatSocket: send post to " + config.urlRestSendMessage + " with chat msg from room ", msg._roomID + " at time " + msg._date);
    log.info("ChatSocket: send post to " + config.urlRestSendMessage + " with chat msg from room ", msg._roomID + " at time " + msg._date);

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("ChatSocket: got answer from post : " + JSON.stringify(body));
            log.info("ChatSocket: got answer from post : " + JSON.stringify(body));
            classSocket.addAlert(1, msg._roomID, body);
        }
        if (error) {
            console.log("ChatSocket: " + error);
            log.info("ChatSocket: " + error);
        }
    });

}





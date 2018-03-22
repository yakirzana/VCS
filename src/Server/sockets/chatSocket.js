function analyzeMsg(classSocket, msg) {
    var request = require('request');

    var options = {
        uri: 'http://192.168.43.156:5002/text_message',
        method: 'POST',
        json: {
            "message_text": msg._msg,
            "room_id": msg._roomID,
            "user_id": msg._username,
            "timestamp": msg._date
        }
    };

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
            classSocket.addAlert("1", msg._roomID, body);
        }
    });

}

module.exports = function (io, sl, classSocket) {
    var io = io.of('/chat');
    io.on('connection', async function(socket) {
        var roomId = socket.handshake.headers.referer.split("/").pop();
        socket.join(roomId);
        socket.on('addMsg', function (msg) {
            sl.chats.addNewMessage(msg._username, msg._date, msg._msg, msg._roomID);
            socket.broadcast.to(msg._roomID).emit('addMsg', msg);
            console.log("add chat msg from socket", msg._roomID);
            analyzeMsg(classSocket, msg);
        });

    });
};





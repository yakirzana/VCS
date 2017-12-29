module.exports = function(io, bl) {
    var io = io.of('/chat');
    io.on('connection', async function(socket) {
        var roomId = socket.handshake.headers.referer.split("/").pop();
        socket.join(roomId);
        socket.on('addMsg', function (msg) {
            bl.chats.addNewMessage(msg._username, msg._date, msg._msg, msg._roomID);
            socket.broadcast.to(msg._roomID).emit('addMsg', msg);
            console.log("add chat msg from socket", msg._roomID);
        });

    });
}



var Message = require('../classes/Message.js');

module.exports = function (dl) {
    this.getMessagesByRoom = async function (roomID) {
        var msg = await dl.chats.getMessagesByRoom(roomID);
        if (msg == null)
            throw new Error("cannot find message");
        return msg;
    };

    this.addNewMessage = function (username, date , msg, roomID) {
        msg = new Message(username, date , msg, parseInt(roomID));
        dl.chats.addNewMessage(msg);
        return msg;
    };

}
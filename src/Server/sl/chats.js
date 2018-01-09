var Message = require('../classes/Message.js');

module.exports = function (bl) {
    this.addNewMessage = async function (username, date, msg, roomID) {
        var msg = await bl.chats.addNewMessage(username, date, msg, roomID);
        return msg != undefined;
    };
};

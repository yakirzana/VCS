var Message = require('../classes/Message.js');

module.exports = function (db, log) {
    this.addNewMessage = function (msg) {
        db.collection('messages').insertOne(msg, function (err, r) {
            log.info("Add Chat " + msg + " Completed");
            if (err)
                log.error("Add Chat " + msg + " Failed " + err.message);
        });
    };

    this.getMessagesByRoom = async function (id) {
        try {
            let msgs = await db.collection('messages').find({_roomID: id}).toArray();
            if (msgs == null)
                throw new Error("cant find message");
            var msgList = [];
            for(var currentMsg of msgs) {
                var msg = Object.assign(new Message, currentMsg);
                msgList.push(msg);
            }
            return msgList;
        } catch (err) {
            log.error("Error on BL getMessagesByRoom " + err.message);
            return null;
        }
    };

    this.removeMessage = function (msg) {
        db.collection('messages').deleteOne({
                _username: msg.username,
                _date: msg.date,
                _msg: msg.msg,
                _roomID: msg.roomID
            }
            , function (err, r) {
                log.info("Delete Chat " + msg + " Completed");
                if (err)
                    log.error("Delete Chat " + msg + " Failed " + err.message);
            });
    };

};

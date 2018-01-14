var Message = require('../classes/Message.js');

module.exports = function (db) {
    this.addNewMessage = function (msg) {
        db.collection('messages').insertOne(msg, function (err, r) {
            if (err == null)
                console.log("added msg to db");
            else
                console.log(err);
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
            console.log("Error: ", err);
            return null;
        }
    };

    this.removeMessage = function (msg) {
        db.collection('messages').deleteOne({
                _username: msg.username,
                _date: msg.data,
                _msg: msg.msg,
                _roomID: msg.roomID
            }
            , function (err, r) {
            });
    };

};

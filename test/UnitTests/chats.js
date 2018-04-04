var MongoClient = require('mongodb').MongoClient;
var DL = require('../../src/Server/dl');
var BL = require('../../src/Server/bl');
var configDB = require('../../src/Server/config/index');
var Message = require('../../src/Server/classes/Message.js');
var _db;
var bl;


exports.group = {

    testGetMessagesByRoom: async function (test) {
        var msg = await bl.chats.addNewMessage("test-user2", "31/08/1999 22:33:47", "test-message", 5);

        var msgs = await bl.chats.getMessagesByRoom(5);
        if (contains(msgs, new Message("test-user2", "31/08/1999 22:33:47", "test-message", 5)))
        {
            test.ok(true);
        }
        else {
            test.ok(false);
        }
        bl.chats.removeMessage(msg);
        test.done();
    },

    testGetMessagesByRoomUndefined: async function (test) {
        var msg = await bl.chats.getMessagesByRoom(1234);
        test.ok(arraysEqual(msg ,[]));
        test.done();
    },

    testAddNewMessage: async function (test) {

        var msg = await bl.chats.addNewMessage("test-user", "31/08/1999 22:33:47", "test-message", 5);

        var msgs = await bl.chats.getMessagesByRoom(5);
        if (contains(msgs, new Message("test-user", "31/08/1999 22:33:47", "test-message", 5)))
        {
            test.ok(true);
        }
        else
        {
            test.ok(false);
        }
        bl.chats.removeMessage(msg);
        test.done();
    },

    testRemoveMessage: async function (test) {

        var msg = await bl.chats.addNewMessage("test-user", "31/08/1999 22:33:47", "test-message", 5);

        var msgs = await bl.chats.getMessagesByRoom(5);
        if (contains(msgs, new Message("test-user", "31/08/1999 22:33:47", "test-message", 5)))
        {
            test.ok(true);
        }
        else
        {
            test.ok(false);
        }
        await bl.chats.removeMessage(msg);
        await sleep(1000);
        var msgs1 = await bl.chats.getMessagesByRoom(5);
        if (contains(msgs1, new Message("test-user", "31/08/1999 22:33:47", "test-message", 5)))
        {
            test.ok(false);
        }
        else
        {
            test.ok(true);
        }
        test.done();
    }
};


exports.setUp = function (done) {
    MongoClient.connect(configDB.urlDB, function (err, db) {
        _db = db;
        bl = new BL(new DL(db));
        done();
    });
};


exports.tearDown = function (done) {
    _db.close();
    done();
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function contains(a, obj) {
    var found = false;
    for(var i = 0; i < a.length; i++) {
        if ((a[i].username == obj.username) && (a[i].date == obj.date) && (a[i].msg == obj.msg) && (a[i].roomID == obj.roomID)) {
            found = true;
            break;
        }
    }
    return found;
}

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}
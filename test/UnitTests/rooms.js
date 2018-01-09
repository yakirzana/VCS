var MongoClient = require('mongodb').MongoClient;
var DL = require('../../src/Server/dl');
var BL = require('../../src/Server/bl');
var configDB = require('../../src/Server/config/database');
var _db;
var bl;


exports.group = {
    testGetRoomById: async function (test) {
        await bl.rooms.addRoom("1234", false, "achiad-room", "My room", true, 5);
        var room = await bl.rooms.getRoomById("1234");
        test.ok(room.id == "1234");
        await bl.rooms.deleteRoom("1234");
        test.done();
    },

    testGetRoomByIdUndefined: async function (test) {
        try {
            var room = await bl.rooms.getRoomById("achiad-room");
            test.ok(false)
        }
        catch(err){
            test.ok(true);
        }
        test.done();
    },

    testAddRoom: async function (test) {
        await bl.rooms.addRoom("1234", false, "achiad-room", "My room", true, 5);

        var room = await bl.rooms.getRoomById("1234");
        test.ok(room.id == "1234");
        test.ok(room.name == "achiad-room");
        await bl.rooms.deleteRoom("1234");
        await sleep(1000);
        try {
            var room1 = await bl.rooms.getRoomById("1234");
            test.ok(false)
        }
        catch(err){
            test.ok(true);
        }
        test.done();
    },

    testDeleteRoom: async function (test) {
        await bl.rooms.addRoom("1234", false, "achiad-room", "My room", true, 5);
        await bl.rooms.deleteRoom("1234");
        await sleep(1000);
        try {
            var room1 = await bl.rooms.getRoomById("1234");
            test.ok(false)
        }
        catch(err){
            test.ok(true);
        }
        test.done();
    }
}


exports.setUp = function (done) {
    MongoClient.connect(configDB.url, function (err, db) {
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

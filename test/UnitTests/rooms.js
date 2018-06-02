var MongoClient = require('mongodb').MongoClient;
var DL = require('../../src/Server/dl');
var BL = require('../../src/Server/bl');
// Log File
var Log = require('../../src/Server/logs/log');
var log = new Log("TESTError.txt", "TESTInfo.txt");
//
var configDB = require('../../src/Server/config/index');
var _db;
var bl;


exports.group = {
    testGetRoomById: async function (test) {
        var id = await bl.rooms.addRoom(false, "achiad-room", "My room", true, 5, null, ["achiad", "hod"]);
        var room = await bl.rooms.getRoomById(id);
        test.ok(room.id == id);
        await bl.rooms.deleteRoom(id);
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
        var id = await bl.rooms.addRoom(false, "achiad-room", "My room", true, 5, null, ["achiad", "hod"]);

        var room = await bl.rooms.getRoomById(id);
        test.ok(room.id == id);
        test.ok(room.name == "achiad-room");
        await bl.rooms.deleteRoom(id);
        await sleep(1000);
        try {
            var room1 = await bl.rooms.getRoomById(id);
            test.ok(false)
        }
        catch(err){
            test.ok(true);
        }
        test.done();
    },

    testDeleteRoom: async function (test) {
        var id = await bl.rooms.addRoom(false, "achiad-room", "My room", true, 5, null, ["achiad", "hod"]);
        await bl.rooms.deleteRoom(id);
        await sleep(1000);
        try {
            var room1 = await bl.rooms.getRoomById(id);
            test.ok(false)
        }
        catch(err){
            test.ok(true);
        }
        test.done();
    },

    testSaveRoomIsLocked: async function (test) {
        var id = await bl.rooms.addRoom(false, "achiad-room", "My room", true, 5, null, ["achiad", "hod"]);
        var room = await bl.rooms.getRoomById(id);
        room.isLocked = true;
        await bl.rooms.saveRoom(room);
        await sleep(1000);
        var room1 = await bl.rooms.getRoomById(id);
        test.ok(room1.isLocked == true);
        await bl.rooms.deleteRoom(id);
        test.done();
    },

    testSaveRoomUserInControl: async function (test) {
        var id = await bl.rooms.addRoom(false, "achiad-room", "My room", true, 5, null, ["achiad", "hod"]);
        var room = await bl.rooms.getRoomById(id);
        room.userInControl = "stud1";
        await bl.rooms.saveRoom(room);
        await sleep(1000);
        var room1 = await bl.rooms.getRoomById(id);
        test.ok(room1.userInControl == "stud1");
        await bl.rooms.deleteRoom(id);
        test.done();
    },

    testSaveRoomName: async function (test) {
        var id = await bl.rooms.addRoom(false, "achiad-room", "My room", true, 5, null, ["achiad", "hod"]);
        var room = await bl.rooms.getRoomById(id);
        room.name = "rotem-room";
        await bl.rooms.saveRoom(room);
        await sleep(1000);
        var room1 = await bl.rooms.getRoomById(id);
        test.ok(room1.name == "rotem-room");
        await bl.rooms.deleteRoom(id);
        test.done();
    },

    testSaveRoomDescription: async function (test) {
        var id = await bl.rooms.addRoom(false, "achiad-room", "My room", true, 5, null, ["achiad", "hod"]);
        var room = await bl.rooms.getRoomById(id);
        room.desc = "My new room";
        await bl.rooms.saveRoom(room);
        await sleep(1000);
        var room1 = await bl.rooms.getRoomById(id);
        test.ok(room1.desc == "My new room");
        await bl.rooms.deleteRoom(id);
        test.done();
    },

    testSaveRoomIsTimeLimit: async function (test) {
        var id = await bl.rooms.addRoom(false, "achiad-room", "My room", true, 5, null, ["achiad", "hod"]);
        var room = await bl.rooms.getRoomById(id);
        room.isTimeLimit = false;
        await bl.rooms.saveRoom(room);
        await sleep(1000);
        var room1 = await bl.rooms.getRoomById(id);
        test.ok(room1.isTimeLimit == false);
        await bl.rooms.deleteRoom(id);
        test.done();
    },

    testSaveRoomTimeLimit: async function (test) {
        var id = await bl.rooms.addRoom(false, "achiad-room", "My room", true, 5, null, ["achiad", "hod"]);
        var room = await bl.rooms.getRoomById(id);
        room.timeLimit = 6;
        await bl.rooms.saveRoom(room);
        await sleep(1000);
        var room1 = await bl.rooms.getRoomById(id);
        test.ok(room1.timeLimit == 6);
        await bl.rooms.deleteRoom(id);
        test.done();
    },

    testUsersInRoom: async function (test) {
        var id = await bl.rooms.addRoom(false, "achiad-room", "My room", true, 5, null, ["achiad", "hod"]);
        listUsers = await bl.rooms.getUsersInRoomById(id);
        test.ok(arraysEqual(listUsers, ["achiad", "hod"]));
        await bl.rooms.addUserToRoom(id, "yakir");
        listUsers = await bl.rooms.getUsersInRoomById(id);
        test.ok(true);
        await bl.rooms.deleteUserFromRoom(id, "yakir");
        listUsers = await bl.rooms.getUsersInRoomById(id);
        await bl.rooms.deleteRoom(id);
        test.done();
    },



};


exports.setUp = function (done) {
    MongoClient.connect(configDB.urlDB, function (err, db) {
        _db = db;
        bl = new BL(new DL(db, log));
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

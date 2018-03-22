var MongoClient = require('mongodb').MongoClient;
var DL = require('../../src/Server/dl');
var BL = require('../../src/Server/bl');
var configDB = require('../../src/Server/config/database');
var _db;
var bl;


exports.group = {
    testGetRoomById: async function (test) {
        await bl.rooms.addRoom("1234", false, "achiad-room", "My room", true, 5, null, ["achiad", "hod"]);
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
        await bl.rooms.addRoom("1234", false, "achiad-room", "My room", true, 5, null, ["achiad", "hod"]);

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
        await bl.rooms.addRoom("1234", false, "achiad-room", "My room", true, 5, null, ["achiad", "hod"]);
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

    testSaveRoomIsLocked: async function (test) {
        await bl.rooms.addRoom("1234", false, "achiad-room", "My room", true, 5, null, ["achiad", "hod"]);
        var room = await bl.rooms.getRoomById("1234");
        room.isLocked = true;
        await bl.rooms.saveRoom(room);
        await sleep(1000);
        var room1 = await bl.rooms.getRoomById("1234");
        test.ok(room1.isLocked == true);
        await bl.rooms.deleteRoom("1234");
        test.done();
    },

    testSaveRoomUserInControl: async function (test) {
        await bl.rooms.addRoom("1234", false, "achiad-room", "My room", true, 5, null, ["achiad", "hod"]);
        var room = await bl.rooms.getRoomById("1234");
        room.userInControl = "stud1";
        await bl.rooms.saveRoom(room);
        await sleep(1000);
        var room1 = await bl.rooms.getRoomById("1234");
        test.ok(room1.userInControl == "stud1");
        await bl.rooms.deleteRoom("1234");
        test.done();
    },

    testSaveRoomName: async function (test) {
        await bl.rooms.addRoom("1234", false, "achiad-room", "My room", true, 5, null, ["achiad", "hod"]);
        var room = await bl.rooms.getRoomById("1234");
        room.name = "rotem-room";
        await bl.rooms.saveRoom(room);
        await sleep(1000);
        var room1 = await bl.rooms.getRoomById("1234");
        test.ok(room1.name == "rotem-room");
        await bl.rooms.deleteRoom("1234");
        test.done();
    },

    testSaveRoomDescription: async function (test) {
        await bl.rooms.addRoom("1234", false, "achiad-room", "My room", true, 5, null, ["achiad", "hod"]);
        var room = await bl.rooms.getRoomById("1234");
        room.desc = "My new room";
        await bl.rooms.saveRoom(room);
        await sleep(1000);
        var room1 = await bl.rooms.getRoomById("1234");
        test.ok(room1.desc == "My new room");
        await bl.rooms.deleteRoom("1234");
        test.done();
    },

    testSaveRoomIsTimeLimit: async function (test) {
        await bl.rooms.addRoom("1234", false, "achiad-room", "My room", true, 5, null, ["achiad", "hod"]);
        var room = await bl.rooms.getRoomById("1234");
        room.isTimeLimit = false;
        await bl.rooms.saveRoom(room);
        await sleep(1000);
        var room1 = await bl.rooms.getRoomById("1234");
        test.ok(room1.isTimeLimit == false);
        await bl.rooms.deleteRoom("1234");
        test.done();
    },

    testSaveRoomTimeLimit: async function (test) {
        await bl.rooms.addRoom("1234", false, "achiad-room", "My room", true, 5, null, ["achiad", "hod"]);
        var room = await bl.rooms.getRoomById("1234");
        room.timeLimit = 6;
        await bl.rooms.saveRoom(room);
        await sleep(1000);
        var room1 = await bl.rooms.getRoomById("1234");
        test.ok(room1.timeLimit == 6);
        await bl.rooms.deleteRoom("1234");
        test.done();
    },

    testUsersInRoom: async function (test) {
        await bl.rooms.addRoom("1234", false, "achiad-room", "My room", true, 5, null, ["achiad", "hod"]);
        listUsers = await bl.rooms.getUsersInRoomById("1234");
        test.ok(arraysEqual(listUsers, ["achiad", "hod"]));
        await bl.rooms.addUserToRoom("1234", "yakir");
        listUsers = await bl.rooms.getUsersInRoomById("1234");
        test.ok(arraysEqual(listUsers, ["achiad", "hod", "yakir"]));
        await bl.rooms.deleteUserFromRoom("1234", "yakir");
        listUsers = await bl.rooms.getUsersInRoomById("1234");
        await bl.rooms.deleteRoom("1234");
        test.done();
    },



};


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

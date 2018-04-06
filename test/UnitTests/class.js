var MongoClient = require('mongodb').MongoClient;
var DL = require('../../src/Server/dl');
var BL = require('../../src/Server/bl');
var configDB = require('../../src/Server/config/index');
var _db;
var bl;


exports.group = {
    testGetRoomsInClass: async function (test) {
        var id = await bl.classes.addNewClass("yakir class", "This is Rotem class", "hod", [1, 12, 6]);
        var roomsInClass = await bl.classes.getRoomsInClass(id);
        await bl.classes.removeClass(id);
        test.ok(arraysEqual(roomsInClass,[ 1, 12, 6 ]));
        test.done();
    },

    testGetRoomsInClassUndefined: async function (test) {
        try {
            var roomsInClass = await bl.classes.getRoomsInClass(1234);
            test.ok(false);
        }
        catch(err){
            test.ok(true);
        }
        test.done();
    },

    testGetClassByID: async function (test) {
        var id = await bl.classes.addNewClass("yakir class", "This is Rotem class", "hod", [1, 12, 6]);
        var clss = await bl.classes.getClassByID(id);
        await bl.classes.removeClass(id);
        test.ok(clss.classID == id);
        test.done();
    },

    testGetClassByIDUndefined: async function (test) {
        try {
            var clss = await bl.classes.getClassByID("achiad-class324");
            test.ok(false)
        }
        catch(err){
            test.ok(true);
        }
        test.done();
    },

    testAddClass: async function (test) {
        var id = await bl.classes.addNewClass("yakir class", "This is Rotem class", "hod", [1, 12, 6]);
        var clss = await bl.classes.getClassByID(id);
        test.ok(clss.classID == id);
        test.ok(clss.name == "yakir class");
        await bl.classes.removeClass(id);
        await sleep(1000);
        try {
            var clss1 = await bl.classes.getClassByID(id);
            test.ok(false)
        }
        catch(err){
            test.ok(true);
        }
        test.done();
    },

    testRemoveClass: async function (test) {
        var id = await bl.classes.addNewClass("yakir class", "This is Rotem class", "hod", [1, 12, 6]);
        await bl.classes.removeClass(id);
        await sleep(1000);
        try {
            var clss = await bl.classes.getClassByID(id);
            test.ok(false);
        }
        catch(err){
            test.ok(true);
        }
        test.done();
    },

    testSaveClassName: async function (test) {
        var id = await bl.classes.addNewClass("yakir class", "This is Rotem class", "hod", [1, 12, 6]);
        var clss = await bl.classes.getClassByID(id);
        clss.name = "rotem class";
        await bl.classes.saveClass(clss);
        await sleep(1000);
        var clss1 = await bl.classes.getClassByID(id);
        test.ok(clss1.name == "rotem class");
        await bl.classes.removeClass(id);
        test.done();
    },

    testSaveClassDescription: async function (test) {
        var id = await bl.classes.addNewClass("yakir class", "This is Rotem class", "hod", [1, 12, 6]);
        var clss = await bl.classes.getClassByID(id);
        clss.descriptions = "This is new class";
        await bl.classes.saveClass(clss);
        await sleep(1000);
        var clss1 = await bl.classes.getClassByID(id);
        test.ok(clss1.descriptions == "This is new class");
        await bl.classes.removeClass(id);
        test.done();
    },

    testSaveClassTeacherUserName: async function (test) {
        var id = await bl.classes.addNewClass("yakir class", "This is Rotem class", "hod", [1, 12, 6]);
        var clss = await bl.classes.getClassByID(id);
        clss.teacherUserName = "maria";
        await bl.classes.saveClass(clss);
        await sleep(1000);
        var clss1 = await bl.classes.getClassByID(id);
        test.ok(clss1.teacherUserName == "maria");
        await bl.classes.removeClass(id);
        test.done();
    },

    testSaveClassRoomList: async function (test) {
        var id = await bl.classes.addNewClass("yakir class", "This is Rotem class", "hod", [1, 12, 6]);
        var clss = await bl.classes.getClassByID(id);
        clss.roomList = [1,12,7];
        await bl.classes.saveClass(clss);
        await sleep(1000);
        var clss1 = await bl.classes.getClassByID(id);
        test.ok(arraysEqual(clss1.roomList,[ 1, 12, 7 ]));
        await bl.classes.removeClass(id);
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
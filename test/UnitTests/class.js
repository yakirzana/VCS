var MongoClient = require('mongodb').MongoClient;
var DL = require('../../src/Server/dl');
var BL = require('../../src/Server/bl');
var configDB = require('../../src/Server/config/database');
var _db;
var bl;


exports.group = {
    testGetRoomsInClass: async function (test) {
        await bl.classes.addNewClass("yakir class" , 1234 , "This is Rotem class" , "hod" , [1,12,6]);
        var roomsInClass = await bl.classes.getRoomsInClass(1234);
        await bl.classes.removeClass(1234);
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
        await bl.classes.addNewClass("yakir class" , 1234 , "This is Rotem class" , "hod" , [1,12,6]);
        var clss = await bl.classes.getClassByID(1234);
        await bl.classes.removeClass(1234);
        test.ok(clss.classID == 1234);
        test.done();
    },

    testGetClassByIDUndefined: async function (test) {
        try {
            var clss = await bl.classes.getClassByID("achiad-class");
            test.ok(false)
        }
        catch(err){
            test.ok(true);
        }
        test.done();
    },

    testAddClass: async function (test) {
        await bl.classes.addNewClass("yakir class" , 1234 , "This is Rotem class" , "hod" , [1,12,6]);

        var clss = await bl.classes.getClassByID(1234);
        test.ok(clss.classID == 1234);
        test.ok(clss.name == "yakir class");
        await bl.classes.removeClass(1234);
        await sleep(1000);
        try {
            var clss1 = await bl.classes.getClassByID("1234");
            test.ok(false)
        }
        catch(err){
            test.ok(true);
        }
        test.done();
    },

    testRemoveClass: async function (test) {
        await bl.classes.addNewClass("yakir class" , 1234 , "This is Rotem class" , "hod" , [1,12,6]);
        await bl.classes.removeClass(1234);
        await sleep(1000);
        try {
            var clss = await bl.classes.getClassByID(1234);
            test.ok(false);
        }
        catch(err){
            test.ok(true);
        }
        test.done();
    }
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
var MongoClient = require('mongodb').MongoClient;
var DL = require('../../src/Server/dl');
var BL = require('../../src/Server/bl');
var SL = require('../../src/Server/sl');
var configDB = require('../../src/Server/config/');
var _db;
var sl;


exports.group = {
    testDeleteNewRoomSuccess: async function (test) {
        try {
            await sl.users.register("teacTest3", "1234", "teac", "her", "Male", "teacher@gm.com", true);
            test.ok(await sl.users.login("teacTest3", "1234"));
            var idClass = await sl.classes.addNewClass("teacTest3 class", "This is teacTest3 class", "teacTest3");
            await sleep(1000);
            var idRoom = await sl.rooms.addRoom("teacTest3 room", "This is teacTest3 room", "teacTest3", 0, idClass);
            await sleep(1000);
            await sl.rooms.deleteRoom(idRoom);
            await sleep(1000);
            await sl.classes.removeClass(idClass);
            await sleep(1000);
            await sl.users.deleteUser("teacTest3");
            test.ok(true);
            test.done();
            return;
        } catch (err) {
            test.ok(false);
            await sl.classes.removeClass(idClass);
            await sl.users.deleteUser("teacTest3");
        }
    },
    testDeleteRoomInvalidRoomID: async function (test) {
        try {
            await sl.users.register("teacTest3", "1234", "teac", "her", "Male", "teacher@gm.com", true);
            test.ok(await sl.users.login("teacTest3", "1234"));
            var idClass = await sl.classes.addNewClass("teacTest3 class", "This is teacTest3 class", "teacTest3");
            await sleep(1000);
            var idRoom = await sl.rooms.addRoom("teacTest3 room", "This is teacTest3 room", "teacTest3", 0, idClass);
            sleep(1000);
            await sl.rooms.deleteRoom(-3);
            test.ok(false);
            test.done();
            return;
        } catch (err) {
            test.equal(err.message, "Error in delete room, invalid roomID");
            await sl.rooms.deleteRoom(idRoom);
            await sl.classes.removeClass(idClass);
            await sl.users.deleteUser("teacTest3");
        }
        test.done();
    },

    testDeleteRoomInvalidRoomID2: async function (test) {
        try {
            await sl.users.register("teacTest3", "1234", "teac", "her", "Male", "teacher@gm.com", true);
            test.ok(await sl.users.login("teacTest3", "1234"));
            var idClass = await sl.classes.addNewClass("teacTest3 class", "This is teacTest3 class", "teacTest3");
            await sleep(1000);
            var idRoom = await sl.rooms.addRoom("teacTest3 room", "This is teacTest3 room", "teacTest3", 0, idClass);
            sleep(1000);
            await sl.rooms.deleteRoom(-9999);
            test.ok(false);
            test.done();
            return;
        } catch (err) {
            test.equal(err.message, "Error in delete room, invalid roomID");
            await sl.rooms.deleteRoom(idRoom);
            await sl.classes.removeClass(idClass);
            await sl.users.deleteUser("teacTest3");
        }
        test.done();
    },

};


exports.setUp = function (done) {
    MongoClient.connect(configDB.urlDB, function (err, db) {
        _db = db;
        var bl = new BL(new DL(db));
        sl = new SL(bl, "heb");
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

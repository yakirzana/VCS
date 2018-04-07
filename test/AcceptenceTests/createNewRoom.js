var MongoClient = require('mongodb').MongoClient;
var DL = require('../../src/Server/dl');
var BL = require('../../src/Server/bl');
var SL = require('../../src/Server/sl');
var configDB = require('../../src/Server/config/');
var _db;
var sl;


exports.group = {
    testCreateNewRoomSucsses: async function (test) {
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

    testCreateNewRoomSucsses2: async function (test) {
        try {
            await sl.users.register("teacTest3", "1234", "teac", "her", "Male", "teacher@gm.com", true);
            test.ok(await sl.users.login("teacTest3", "1234"));
            await sl.users.register("teacTest4", "1234", "teac", "her", "Male", "teacher@gm.com", true);
            sleep(1000);
            test.ok(await sl.users.login("teacTest4", "1234"));
            var idClass1 = await sl.classes.addNewClass("teacTest3 class", "This is teacTest3 class", "teacTest3");
            await sleep(1000);
            var idClass2 = await sl.classes.addNewClass("teacTest4 class", "This is teacTest4 class", "teacTest4");
            await sleep(1000);
            var idRoom1 = await sl.rooms.addRoom("teacTest3 room", "This is teacTest3 room", "teacTest3", 0, idClass1);
            await sleep(1000);
            var idRoom2 = await sl.rooms.addRoom("teacTest4 room", "This is teacTest4 room", "teacTest4", 0, idClass2);
            await sleep(1000);
            await sl.rooms.deleteRoom(idRoom1);
            await sleep(1000);
            await sl.rooms.deleteRoom(idRoom2);
            await sleep(1000);
            await sl.classes.removeClass(idClass1);
            await sleep(1000);
            await sl.classes.removeClass(idClass2);
            await sleep(1000);
            await sl.users.deleteUser("teacTest3");
            await sl.users.deleteUser("teacTest4");
            test.ok(true);
            test.done();
            return;
        } catch (err) {
            test.ok(false);
            await sl.classes.removeClass(idClass1);
            await sl.classes.removeClass(idClass2);
            await sl.users.deleteUser("teacTest3");
            await sl.users.deleteUser("teacTest4");
        }
    },

    testCreateNewRoomUndefinedName: async function (test) {
        try {
            await sl.users.register("teacTest3", "1234", "teac", "her", "Male", "teacher@gm.com", true);
            test.ok(await sl.users.login("teacTest3", "1234"));
            var idClass = await sl.classes.addNewClass("teacTest3 class", "This is teacTest3 class", "teacTest3");
            await sleep(1000);
            await sl.rooms.addRoom("", "This is teacTest3 room", "teacTest3", 0, idClass);
            test.ok(false);
            test.done();
            return;
        } catch (err) {
            test.equal(err.message, "Error in add room, invalid parameters");
            await sl.classes.removeClass(idClass);
            await sl.users.deleteUser("teacTest3");
        }
        test.done();
    },

    testCreateNewRoomUndefinedDesc: async function (test) {
        try {
            await sl.users.register("teacTest3", "1234", "teac", "her", "Male", "teacher@gm.com", true);
            test.ok(await sl.users.login("teacTest3", "1234"));
            var idClass = await sl.classes.addNewClass("teacTest3 class", "This is teacTest3 class", "teacTest3");
            await sleep(1000);
            await sl.rooms.addRoom("teacTest3 room", "", "teacTest3", 0, idClass);
            test.ok(false);
            test.done();
            return;
        } catch (err) {
            test.equal(err.message, "Error in add room, invalid parameters");
            await sl.classes.removeClass(idClass);
            await sl.users.deleteUser("teacTest3");
        }
        test.done();
    },

    testCreateNewRoomUndefinedTeacherName: async function (test) {
        try {
            await sl.users.register("teacTest3", "1234", "teac", "her", "Male", "teacher@gm.com", true);
            test.ok(await sl.users.login("teacTest3", "1234"));
            var idClass = await sl.classes.addNewClass("teacTest3 class", "This is teacTest3 class", "teacTest3");
            await sleep(1000);
            await sl.rooms.addRoom("teacTest3 room", "This is teacTest3 room", "", 0, idClass);
            test.ok(false);
            test.done();
            return;
        } catch (err) {
            test.equal(err.message, "Error in add room, invalid parameters");
            await sl.classes.removeClass(idClass);
            await sl.users.deleteUser("teacTest3");
        }
        test.done();
    },
    testCreateNewRoomInvalidChars1: async function (test) {
        try {
            await sl.users.register("teacTest3", "1234", "teac", "her", "Male", "teacher@gm.com", true);
            test.ok(await sl.users.login("teacTest3", "1234"));
            var idClass = await sl.classes.addNewClass("teacTest3 class", "This is teacTest3 class", "teacTest3");
            await sleep(1000);
            await sl.rooms.addRoom("teacTe\nst3 room", "This is teacTest3 room", "teacTest3", 0, idClass);
            test.ok(false);
            test.done();
            return;
        } catch (err) {
            test.equal(err.message, "Error in add room,invalid characters, please try again");
            await sl.classes.removeClass(idClass);
            await sl.users.deleteUser("teacTest3");
        }
        test.done();
    },

    testCreateNewRoomInvalidChars2: async function (test) {
        try {
            await sl.users.register("teacTest3", "1234", "teac", "her", "Male", "teacher@gm.com", true);
            test.ok(await sl.users.login("teacTest3", "1234"));
            var idClass = await sl.classes.addNewClass("teacTest3 class", "This is teacTest3 class", "teacTest3");
            await sleep(1000);
            await sl.rooms.addRoom("t\teacTest3 room", "This is teacTest3 room", "teacTest3", 0, idClass);
            test.ok(false);
            test.done();
            return;
        } catch (err) {
            test.equal(err.message, "Error in add room,invalid characters, please try again");
            await sl.classes.removeClass(idClass);
            await sl.users.deleteUser("teacTest3");
        }
        test.done();
    },
    testCreateNewRoomInvalidClassID: async function (test) {
        try {
            await sl.users.register("teacTest3", "1234", "teac", "her", "Male", "teacher@gm.com", true);
            test.ok(await sl.users.login("teacTest3", "1234"));
            var idClass = await sl.classes.addNewClass("teacTest3 class", "This is teacTest3 class", "teacTest3");
            await sleep(1000);
            await sl.rooms.addRoom("teacTest3 room", "This is teacTest3 room", "teacTest3", 0, 9999);
            test.ok(false);
            test.done();
            return;
        } catch (err) {
            test.equal(err.message, "Error in add room, invalid class ID or teachername");
            await sl.classes.removeClass(idClass);
            await sl.users.deleteUser("teacTest3");
        }
        test.done();
    },
    testCreateNewRoomInvalidTeacherName: async function (test) {
        try {
            await sl.users.register("teacTest3", "1234", "teac", "her", "Male", "teacher@gm.com", true);
            test.ok(await sl.users.login("teacTest3", "1234"));
            var idClass = await sl.classes.addNewClass("teacTest3 class", "This is teacTest3 class", "teacTest3");
            await sleep(1000);
            await sl.rooms.addRoom("teacTest3 room", "This is teacTest3 room", "teacTest4", 0, idClass);
            test.ok(false);
            test.done();
            return;
        } catch (err) {
            test.equal(err.message, "Error in add room, invalid class ID or teachername");
            await sl.classes.removeClass(idClass);
            await sl.users.deleteUser("teacTest3");
        }
        test.done();
    }

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

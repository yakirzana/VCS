var MongoClient = require('mongodb').MongoClient;
var DL = require('../../src/Server/dl');
var BL = require('../../src/Server/bl');
var SL = require('../../src/Server/sl');
// Log File
var Log = require('../../src/Server/logs/log');
var log = new Log("TESTError.txt", "TESTInfo.txt");
//
var configDB = require('../../src/Server/config/');
var _db;
var sl;


exports.group = {
    testTeacherRemoveUserSuccess: async function (test) {
        try {
            await sl.users.register("elibin", "1234", "Eli", "Bin", "Male", "elib@gmail.com", false);
            await sleep(1000);
            await sl.users.register("sivanm", "1234567", "Sivan", "Mednik", "Female", "sivanm@gmail.com", false);
            await sleep(1000);
            test.ok(await sl.users.login("elibin", "1234"));
            test.ok(await sl.users.login("sivanm", "1234567"));
            await sl.users.register("teacTest3", "1234", "teac", "her", "Male", "teacher@gm.com", true);
            await sleep(1000);
            test.ok(await sl.users.login("teacTest3", "1234"));
            var idClass = await sl.classes.addNewClass("Test class", "This is Test3 class", "teacTest3");
            await sleep(1000);
            var idRoom1 = await sl.rooms.addRoom("elibin room", "This is teacTest3 room", "teacTest3", 0, idClass);
            await sleep(1000);
            var idRoom2 = await sl.rooms.addRoom("sivanm room", "This is teacTest3 room", "teacTest3", 0, idClass);
            await sleep(1000);
            var idRoom3 = await sl.rooms.addRoom("elibinNew room", "This is teacTest3 room", "teacTest3", 0, idClass);
            await sleep(1000);
            await sl.rooms.addUserToRoom(idRoom1, "elibin");
            await sl.rooms.addUserToRoom(idRoom3, "elibin");
            await sl.rooms.addUserToRoom(idRoom2, "sivanm");
            var roomsEli = await sl.rooms.getRoomsOfUser("elibin");
            var roomsSivan = await sl.rooms.getRoomsOfUser("sivanm");
            var found = true;
            for (room of roomsEli) {
                if (!(room.id == idRoom1 || room.id == idRoom3 ))
                    found = false;
            }
            for (room of roomsSivan) {
                if (!(room.id == idRoom2))
                    found = false;
            }
            await sleep(1000);
            await sl.rooms.deleteRoom(idRoom1);
            await sl.rooms.deleteRoom(idRoom2);
            await sl.rooms.deleteRoom(idRoom3);
            await sl.classes.removeClass(idClass);
            await sl.users.deleteUser("teacTest3");
            await sl.users.deleteUser("elibin");
            await sl.users.deleteUser("sivanm");
            test.ok(found);
            test.done();
            return;
        } catch (err) {
            await sl.rooms.deleteRoom(idRoom1);
            await sl.rooms.deleteRoom(idRoom2);
            await sl.rooms.deleteRoom(idRoom3);
            test.equal(err.message, "Error in delete room, invalid roomID");
            await sl.classes.removeClass(idClass);
            await sl.users.deleteUser("teacTest3");
            await sl.users.deleteUser("elibin");
            await sl.users.deleteUser("sivanm");

        }
    },

    testTeacherRemoveUserSuccess2: async function (test) {
        try {
            await sl.users.register("elibin", "1234", "Eli", "Bin", "Male", "elib@gmail.com", false);
            await sleep(1000);
            await sl.users.register("sivanm", "1234567", "Sivan", "Mednik", "Female", "sivanm@gmail.com", false);
            await sleep(1000);
            test.ok(await sl.users.login("elibin", "1234"));
            test.ok(await sl.users.login("sivanm", "1234567"));
            await sl.users.register("teacTest3", "1234", "teac", "her", "Male", "teacher@gm.com", true);
            await sleep(1000);
            test.ok(await sl.users.login("teacTest3", "1234"));
            var idClass = await sl.classes.addNewClass("Test class", "This is Test3 class", "teacTest3");
            await sleep(1000);
            var idRoom1 = await sl.rooms.addRoom("elibin room", "This is teacTest3 room", "teacTest3", 0, idClass);
            await sleep(1000);
            var idRoom2 = await sl.rooms.addRoom("sivanm room", "This is teacTest3 room", "teacTest3", 0, idClass);
            await sleep(1000);
            var idRoom3 = await sl.rooms.addRoom("elibinNew room", "This is teacTest3 room", "teacTest3", 0, idClass);
            await sleep(1000);
            await sl.rooms.addUserToRoom(idRoom1, "elibin");
            await sl.rooms.addUserToRoom(idRoom3, "elibin");
            await sl.rooms.addUserToRoom(idRoom2, "sivanm");
            var roomsEli = await sl.rooms.getRoomsOfUser("elibin");
            var roomsSivan = await sl.rooms.getRoomsOfUser("sivanm");
            var found = true;
            for (room of roomsEli) {
                if (!(room.id == idRoom1 || room.id == idRoom3 ))
                    found = false;
            }
            for (room of roomsSivan) {
                if (!(room.id == idRoom2))
                    found = false;
            }
            await sleep(1000);
            await sl.rooms.deleteRoom(idRoom1);
            await sl.rooms.deleteRoom(idRoom2);
            await sl.rooms.deleteRoom(idRoom3);
            await sl.classes.removeClass(idClass);
            await sl.users.deleteUser("teacTest3");
            await sl.users.deleteUser("elibin");
            await sl.users.deleteUser("sivanm");
            test.ok(found);
            test.done();
            return;
        } catch (err) {
            await sl.rooms.deleteRoom(idRoom1);
            await sl.rooms.deleteRoom(idRoom2);
            await sl.rooms.deleteRoom(idRoom3);
            test.equal(err.message, "Error in delete room, invalid roomID");
            await sl.classes.removeClass(idClass);
            await sl.users.deleteUser("teacTest3");
            await sl.users.deleteUser("elibin");
            await sl.users.deleteUser("sivanm");

        }
    },

    testTeacherRemoveUserSuccess3: async function (test) {
        try {
            await sl.users.register("elibin", "1234", "Eli", "Bin", "Male", "elib@gmail.com", false);
            await sleep(1000);
            await sl.users.register("sivanm", "1234567", "Sivan", "Mednik", "Female", "sivanm@gmail.com", false);
            await sleep(1000);
            test.ok(await sl.users.login("elibin", "1234"));
            test.ok(await sl.users.login("sivanm", "1234567"));
            await sl.users.register("teacTest3", "1234", "teac", "her", "Male", "teacher@gm.com", true);
            await sleep(1000);
            test.ok(await sl.users.login("teacTest3", "1234"));
            var idClass = await sl.classes.addNewClass("Test class", "This is Test3 class", "teacTest3");
            await sleep(1000);
            var idRoom1 = await sl.rooms.addRoom("elibin room", "This is teacTest3 room", "teacTest3", 0, idClass);
            await sleep(1000);
            var idRoom2 = await sl.rooms.addRoom("sivanm room", "This is teacTest3 room", "teacTest3", 0, idClass);
            await sleep(1000);
            var idRoom3 = await sl.rooms.addRoom("elibinNew room", "This is teacTest3 room", "teacTest3", 0, idClass);
            await sleep(1000);
            await sl.rooms.addUserToRoom(idRoom1, "elibin");
            await sl.rooms.addUserToRoom(idRoom3, "elibin");
            await sl.rooms.addUserToRoom(idRoom2, "sivanm");
            var roomsEli = await sl.rooms.getRoomsOfUser("elibin");
            var roomsSivan = await sl.rooms.getRoomsOfUser("sivanm");
            var found = true;
            for (room of roomsEli) {
                if (!(room.id == idRoom1 || room.id == idRoom3 ))
                    found = false;
            }
            for (room of roomsSivan) {
                if (!(room.id == idRoom2))
                    found = false;
            }
            await sleep(1000);
            await sl.rooms.deleteRoom(idRoom1);
            await sl.rooms.deleteRoom(idRoom2);
            await sl.rooms.deleteRoom(idRoom3);
            await sl.classes.removeClass(idClass);
            await sl.users.deleteUser("teacTest3");
            await sl.users.deleteUser("elibin");
            await sl.users.deleteUser("sivanm");
            test.ok(found);
            test.done();
            return;
        } catch (err) {
            await sl.rooms.deleteRoom(idRoom1);
            await sl.rooms.deleteRoom(idRoom2);
            await sl.rooms.deleteRoom(idRoom3);
            test.equal(err.message, "Error in delete room, invalid roomID");
            await sl.classes.removeClass(idClass);
            await sl.users.deleteUser("teacTest3");
            await sl.users.deleteUser("elibin");
            await sl.users.deleteUser("sivanm");

        }
    },


    testTeacherRemoveUserSuccess4: async function (test) {
        try {
            await sl.users.register("elibin", "1234", "Eli", "Bin", "Male", "elib@gmail.com", false);
            await sleep(1000);
            await sl.users.register("sivanm", "1234567", "Sivan", "Mednik", "Female", "sivanm@gmail.com", false);
            await sleep(1000);
            test.ok(await sl.users.login("elibin", "1234"));
            test.ok(await sl.users.login("sivanm", "1234567"));
            await sl.users.register("teacTest3", "1234", "teac", "her", "Male", "teacher@gm.com", true);
            await sleep(1000);
            test.ok(await sl.users.login("teacTest3", "1234"));
            var idClass = await sl.classes.addNewClass("Test class", "This is Test3 class", "teacTest3");
            await sleep(1000);
            var idRoom1 = await sl.rooms.addRoom("elibin room", "This is teacTest3 room", "teacTest3", 0, idClass);
            await sleep(1000);
            var idRoom2 = await sl.rooms.addRoom("sivanm room", "This is teacTest3 room", "teacTest3", 0, idClass);
            await sleep(1000);
            var idRoom3 = await sl.rooms.addRoom("elibinNew room", "This is teacTest3 room", "teacTest3", 0, idClass);
            await sleep(1000);
            await sl.rooms.addUserToRoom(idRoom1, "elibin");
            await sl.rooms.addUserToRoom(idRoom3, "elibin");
            await sl.rooms.addUserToRoom(idRoom2, "sivanm");
            var roomsEli = await sl.rooms.getRoomsOfUser("elibin");
            var roomsSivan = await sl.rooms.getRoomsOfUser("sivanm");
            var found = true;
            for (room of roomsEli) {
                if (!(room.id == idRoom1 || room.id == idRoom3 ))
                    found = false;
            }
            for (room of roomsSivan) {
                if (!(room.id == idRoom2))
                    found = false;
            }
            await sleep(1000);
            await sl.rooms.deleteRoom(idRoom1);
            await sl.rooms.deleteRoom(idRoom2);
            await sl.rooms.deleteRoom(idRoom3);
            await sl.classes.removeClass(idClass);
            await sl.users.deleteUser("teacTest3");
            await sl.users.deleteUser("elibin");
            await sl.users.deleteUser("sivanm");
            test.ok(found);
            test.done();
            return;
        } catch (err) {
            await sl.rooms.deleteRoom(idRoom1);
            await sl.rooms.deleteRoom(idRoom2);
            await sl.rooms.deleteRoom(idRoom3);
            test.equal(err.message, "Error in delete room, invalid roomID");
            await sl.classes.removeClass(idClass);
            await sl.users.deleteUser("teacTest3");
            await sl.users.deleteUser("elibin");
            await sl.users.deleteUser("sivanm");

        }
    },

    testTeacherRemoveUserNoSuccess: async function (test) {
        try {
            await sl.users.register("elibin", "1234", "Eli", "Bin", "Male", "elib@gmail.com", false);
            await sleep(1000);
            await sl.users.register("sivanm", "1234567", "Sivan", "Mednik", "Female", "sivanm@gmail.com", false);
            await sleep(1000);
            test.ok(await sl.users.login("elibin", "1234"));
            test.ok(await sl.users.login("sivanm", "1234567"));
            await sl.users.register("teacTest3", "1234", "teac", "her", "Male", "teacher@gm.com", true);
            await sleep(1000);
            test.ok(await sl.users.login("teacTest3", "1234"));
            var idClass = await sl.classes.addNewClass("Test class", "This is Test3 class", "teacTest3");
            await sleep(1000);
            var idRoom1 = await sl.rooms.addRoom("sivanmnew room", "This is sivanm room", "teacTest3", 0, idClass);
            await sleep(1000);
            var idRoom2 = await sl.rooms.addRoom("sivanm room", "This is sivanm room", "teacTest3", 0, idClass);
            await sleep(1000);
            var idRoom3 = await sl.rooms.addRoom("sivanmNew room", "This is sivanm room", "teacTest3", 0, idClass);
            await sleep(1000);
            await sl.rooms.addUserToRoom(idRoom1, "sivanm");
            await sl.rooms.addUserToRoom(idRoom3, "sivanm");
            await sl.rooms.addUserToRoom(idRoom2, "sivanm");
            var roomsEli = await sl.rooms.getRoomsOfUser("elibin");
            await sl.rooms.deleteRoom(idRoom1);
            await sleep(1000);
            await sl.rooms.deleteRoom(idRoom2);
            await sleep(1000);
            await sl.rooms.deleteRoom(idRoom3);
            await sleep(1000);
            await sl.classes.removeClass(idClass);
            await sleep(1000);
            await sl.users.deleteUser("teacTest3");
            await sl.users.deleteUser("elibin");
            await sl.users.deleteUser("sivanm");
            test.ok(arraysEqual(roomsEli, []));
            test.done();
            return;
        } catch (err) {
            test.equal(err.message, "Error in delete room, invalid roomID");
            await sl.rooms.deleteRoom(idRoom1);
            await sl.rooms.deleteRoom(idRoom2);
            await sl.rooms.deleteRoom(idRoom3);
            await sl.classes.removeClass(idClass);
            await sl.users.deleteUser("teacTest3");
            await sl.users.deleteUser("elibin");
            await sl.users.deleteUser("sivanm");

        }
    },

    testTeacherRemoveUserNoSuccess2: async function (test) {
        try {
            await sl.users.register("elibin", "1234", "Eli", "Bin", "Male", "elib@gmail.com", false);
            await sleep(1000);
            await sl.users.register("sivanm", "1234567", "Sivan", "Mednik", "Female", "sivanm@gmail.com", false);
            await sleep(1000);
            test.ok(await sl.users.login("elibin", "1234"));
            test.ok(await sl.users.login("sivanm", "1234567"));
            await sl.users.register("teacTest3", "1234", "teac", "her", "Male", "teacher@gm.com", true);
            await sleep(1000);
            test.ok(await sl.users.login("teacTest3", "1234"));
            var idClass = await sl.classes.addNewClass("Test class", "This is Test3 class", "teacTest3");
            await sleep(1000);
            var idRoom1 = await sl.rooms.addRoom("sivanmnew room", "This is sivanm room", "teacTest3", 0, idClass);
            await sleep(1000);
            var idRoom2 = await sl.rooms.addRoom("sivanm room", "This is sivanm room", "teacTest3", 0, idClass);
            await sleep(1000);
            var idRoom3 = await sl.rooms.addRoom("sivanmNew room", "This is sivanm room", "teacTest3", 0, idClass);
            await sleep(1000);
            await sl.rooms.addUserToRoom(idRoom1, "sivanm");
            await sl.rooms.addUserToRoom(idRoom3, "sivanm");
            await sl.rooms.addUserToRoom(idRoom2, "sivanm");
            var roomsEli = await sl.rooms.getRoomsOfUser("elibin");
            await sl.rooms.deleteRoom(idRoom1);
            await sleep(1000);
            await sl.rooms.deleteRoom(idRoom2);
            await sleep(1000);
            await sl.rooms.deleteRoom(idRoom3);
            await sleep(1000);
            await sl.classes.removeClass(idClass);
            await sleep(1000);
            await sl.users.deleteUser("teacTest3");
            await sl.users.deleteUser("elibin");
            await sl.users.deleteUser("sivanm");
            test.ok(arraysEqual(roomsEli, []));
            test.done();
            return;
        } catch (err) {
            test.equal(err.message, "Error in delete room, invalid roomID");
            await sl.rooms.deleteRoom(idRoom1);
            await sl.rooms.deleteRoom(idRoom2);
            await sl.rooms.deleteRoom(idRoom3);
            await sl.classes.removeClass(idClass);
            await sl.users.deleteUser("teacTest3");
            await sl.users.deleteUser("elibin");
            await sl.users.deleteUser("sivanm");

        }
    }

};


exports.setUp = function (done) {
    MongoClient.connect(configDB.urlDB, function (err, db) {
        _db = db;
        var bl = new BL(new DL(db, log));
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
};

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
};
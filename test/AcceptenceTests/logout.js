var MongoClient = require('mongodb').MongoClient;
var DL = require('../../src/Server/dl');
var BL = require('../../src/Server/bl');
var SL = require('../../src/Server/sl');
var configDB = require('../../src/Server/config/');
var _db;
var sl;


exports.group = {
    testLogoutSuccess: async function (test) {
        await sl.users.register("teacTest1", "1234", "teac", "her", "Male", "teacher@gm.com", true);
        await sl.users.login("teacTest1", "1234");
        await sl.users.logout("teacTest1");
        await sl.users.deleteUser("teacTest1");
        test.ok(true);
        test.done();
    },
    testLogoutUserNotExist: async function (test) {
        await sl.users.register("teacTest1", "1234", "teac", "her", "Male", "teacher@gm.com", true);
        try {
            await sl.users.login("teacTest1", "1234");
            await sl.users.logout("teacTest2");
            await sl.users.deleteUser("teacTest1");
            test.ok(true);
            test.done();
            return;
        }
        catch (err) {
            test.equal(err.message, "cannot find user");
        }
        await sl.users.deleteUser("teacTest1");
        test.done();
    },
    testLogoutUserNotDefined: async function (test) {
        await sl.users.register("teacTest1", "1234", "teac", "her", "Male", "teacher@gm.com", true);
        try {
            await sl.users.login("teacTest1", "1234");
            await sl.users.logout("");
            await sl.users.deleteUser("teacTest1");
            test.ok(true);
            test.done();
            return;
        }
        catch (err) {
            test.equal(err.message, "cannot find user");
        }
        await sl.users.deleteUser("teacTest1");
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

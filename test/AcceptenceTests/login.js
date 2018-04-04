var MongoClient = require('mongodb').MongoClient;
var DL = require('../../src/Server/dl');
var BL = require('../../src/Server/bl');
var SL = require('../../src/Server/sl');
var configDB = require('../../src/Server/config/');
var _db;
var sl;


exports.group = {
    testLoginFaildUserDontExist: async function (test) {
        try {
            await sl.users.login("teacTest2", "1234");
            test.ok(false);
        }
        catch (err) {
            test.equal(err.message, "the user don't exist in system");
        }
        test.done();
    },
    testLoginFaildWrongPassword: async function (test) {
        await sl.users.register("teacTest1", "1234", "teac", "her", "Male", "teacher@gm.com", true);
        try {
            await sl.users.login("teacTest1", "12345");
            await sl.users.deleteUser("teacTest1");
            test.ok(false);
            test.done();
            return;
        }
        catch (err) {
            test.equal(err.message, "illegal password");
        }
        await sl.users.deleteUser("teacTest1");
        test.done();
    },
    testLoginSucsses: async function (test) {
        await sl.users.register("teacTest3", "1234", "teac", "her", "Male", "teacher@gm.com", true);
        test.ok(await sl.users.login("teacTest3", "1234"));
        await sl.users.deleteUser("teacTest3");
        test.done();
    }

};


exports.setUp = function (done) {
    MongoClient.connect(configDB.urlDB, function (err, db) {
        _db = db;
        var bl = new BL(new DL(db))
        sl = new SL(bl);
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

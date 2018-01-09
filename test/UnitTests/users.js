var MongoClient = require('mongodb').MongoClient;
var DL = require('../../src/Server/dl');
var BL = require('../../src/Server/bl');
var configDB = require('../../src/Server/config/database');
var _db;
var bl;


exports.group = {
    testGetUserByUserName: async function (test) {
        await bl.users.addUser("teacTest", "1234", "teac", "her", "Male", "teacher@gm.com", true);
        var usr = await bl.users.getUserByUserName("teacTest");
        test.ok(usr.username == "teacTest");
        test.ok(usr.password == "1234");
        await bl.users.deleteUser("teacTest");
        test.done();
    },

    testGetUserByUserNameUndefined: async function (test) {
        var usr = await bl.users.getUserByUserName("ach@@iad");
        test.ok(usr.username == undefined);
        test.ok(usr.password == undefined);
        test.done();
    },

    testAddUser: async function (test) {
        await bl.users.addUser("teacTest", "1234", "teac", "her", "Male", "teacher@gm.com", true);

        var usr = await bl.users.getUserByUserName("teacTest");
        test.ok(usr.username == "teacTest");
        test.ok(usr.password == "1234");
        await bl.users.deleteUser("teacTest");
        await sleep(1000);
        var usr1 = await bl.users.getUserByUserName("teacTest");
        test.ok(usr1.username == undefined);
        test.done();
    },

    testDeleteUser: async function (test) {
        await bl.users.addUser("teacTest1", "1234", "teac", "her", "Male", "teacher@gm.com", true);
        await bl.users.deleteUser("teacTest1");
        await sleep(1000);
        var usr = await bl.users.getUserByUserName("teacTest1");
        await test.ok(await usr.username == undefined);
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

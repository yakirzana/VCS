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
        try {
            var usr = await bl.users.getUserByUserName("ach@@iad");
            test.ok(false);
        }
        catch(err){
            test.ok(true);
        }
        test.done();
    },

    testAddUser: async function (test) {
        await bl.users.addUser("teacTest", "1234", "teac", "her", "Male", "teacher@gm.com", true);

        var usr = await bl.users.getUserByUserName("teacTest");
        test.ok(usr.username == "teacTest");
        test.ok(usr.password == "1234");
        await bl.users.deleteUser("teacTest");
        await sleep(1000);
        try {
            var usr = await bl.users.getUserByUserName("teacTest");
            test.ok(false);
        }
        catch(err){
            test.ok(true);
        }
        test.done();
    },

    testDeleteUser: async function (test) {
        await bl.users.addUser("teacTest1", "1234", "teac", "her", "Male", "teacher@gm.com", true);
        await bl.users.deleteUser("teacTest1");
        await sleep(1000);
        try {
            var usr = await bl.users.getUserByUserName("teacTest1");
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

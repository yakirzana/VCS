const crypto = require('crypto');
var MongoClient = require('mongodb').MongoClient;
var DL = require('../../src/Server/dl');
var BL = require('../../src/Server/bl');
// Log File
var Log = require('../../src/Server/logs/log');
var log = new Log("TESTError.txt", "TESTInfo.txt");
//
var configDB = require('../../src/Server/config/index');
var _db;
var bl;


exports.group = {
    testGetUserByUserName: async function (test) {
        await bl.users.addUser("teacTest", "1234", "teac", "her", "Male", "teacher@gm.com", true);
        var usr = await bl.users.getUserByUserName("teacTest");
        test.ok(usr.username == "teacTest");
        test.ok(usr.password == bl.users.getHashPassword("1234"));
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
        test.ok(usr.password == bl.users.getHashPassword("1234"));
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
    },

    testSaveUserPassword: async function (test) {
        await bl.users.addUser("teacTest1", "1234", "teac", "her", "Male", "teacher@gm.com", true);
        var user = await bl.users.getUserByUserName("teacTest1");
        user.password = "123456";
        await bl.users.saveUser(user);
        await sleep(1000);
        var user1 = await bl.users.getUserByUserName("teacTest1");
        test.ok(user1.password == "123456");
        await bl.users.deleteUser("teacTest1");
        test.done();
    },

    testSaveUserFirstName: async function (test) {
        await bl.users.addUser("teacTest1", "1234", "teac", "her", "Male", "teacher@gm.com", true);
        var user = await bl.users.getUserByUserName("teacTest1");
        user.firstName = "achiad";
        await bl.users.saveUser(user);
        await sleep(1000);
        var user1 = await bl.users.getUserByUserName("teacTest1");
        test.ok(user1.firstName == "achiad");
        await bl.users.deleteUser("teacTest1");
        test.done();
    },

    testSaveUserLastName: async function (test) {
        await bl.users.addUser("teacTest1", "1234", "teac", "her", "Male", "teacher@gm.com", true);
        var user = await bl.users.getUserByUserName("teacTest1");
        user.lastName = "Gelerenter";
        await bl.users.saveUser(user);
        await sleep(1000);
        var user1 = await bl.users.getUserByUserName("teacTest1");
        test.ok(user1.lastName == "Gelerenter");
        await bl.users.deleteUser("teacTest1");
        test.done();
    },

    testSaveUserSex: async function (test) {
        await bl.users.addUser("teacTest1", "1234", "teac", "her", "Male", "teacher@gm.com", true);
        var user = await bl.users.getUserByUserName("teacTest1");
        user.sex = "FeMale";
        await bl.users.saveUser(user);
        await sleep(1000);
        var user1 = await bl.users.getUserByUserName("teacTest1");
        test.ok(user1.sex == "FeMale");
        await bl.users.deleteUser("teacTest1");
        test.done();
    },

    testSaveUserEmail: async function (test) {
        await bl.users.addUser("teacTest1", "1234", "teac", "her", "Male", "teacher@gm.com", true);
        var user = await bl.users.getUserByUserName("teacTest1");
        user.email = "teacher@gmail.com";
        await bl.users.saveUser(user);
        await sleep(1000);
        var user1 = await bl.users.getUserByUserName("teacTest1");
        test.ok(user1.email == "teacher@gmail.com");
        await bl.users.deleteUser("teacTest1");
        test.done();
    },

    testSaveUserIsTeacher: async function (test) {
        await bl.users.addUser("teacTest1", "1234", "teac", "her", "Male", "teacher@gm.com", true);
        var user = await bl.users.getUserByUserName("teacTest1");
        user.isTeacher = false;
        await bl.users.saveUser(user);
        await sleep(1000);
        var user1 = await bl.users.getUserByUserName("teacTest1");
        test.ok(user1.isTeacher == false);
        await bl.users.deleteUser("teacTest1");
        test.done();
    },

    testIsPassMatch: async function (test) {
        await bl.users.addUser("teacTest1", "1234", "teac", "her", "Male", "teacher@gm.com", true);
        var user = await bl.users.getUserByUserName("teacTest1");

        test.ok(await bl.users.isPassMatch("teacTest1", "1234"));
        test.ok(!(await bl.users.isPassMatch("teacTest1", "12345")));

        await bl.users.deleteUser("teacTest1");
        test.done();
    },

    testIsHashMatch: async function (test) {
        await bl.users.addUser("teacTest1", "1234", "teac", "her", "Male", "teacher@gm.com", true);
        await bl.users.addUser("teacTest2", "1234", "teac", "her", "Male", "teacher@gm.com", true);
        await sleep(1000);

        var hash1 = await bl.users.createUserHash("teacTest1");
        var hash2 = await bl.users.createUserHash("teacTest2");

        test.ok(await bl.users.isHashMatch("teacTest1", hash1));
        test.ok(await bl.users.isHashMatch("teacTest2", hash2));
        test.ok(!(await bl.users.isHashMatch("teacTest1", "hash")));

        await bl.users.deleteUser("teacTest1");
        await bl.users.deleteUser("teacTest2");
        test.done();
    },

    testCreateUserHash: async function (test) {
        await bl.users.addUser("teacTest1", "1234", "teac", "her", "Male", "teacher@gm.com", true);
        await sleep(1000);

        var hash1 = await bl.users.createUserHash("teacTest1");
        var hash2 = crypto.createHash('sha256').update("teacTest1" + bl.users.getHashPassword("1234")).digest('hex');
        test.equals(hash1, hash2);

        await bl.users.deleteUser("teacTest1");
        test.done();
    }

};


exports.setUp = function (done) {
    MongoClient.connect(configDB.urlDB, function (err, db) {
        _db = db;
        var dl = new DL(db, log);
        bl = new BL(dl);

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

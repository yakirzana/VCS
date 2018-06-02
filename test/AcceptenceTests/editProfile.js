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
    testEditSucsses: async function (test) {
        try {
            await sl.users.register("elibin", "1234", "Eli", "Bin", "Male", "elib@gmail.com", false);
            await sl.users.register("sivanm", "1234567", "Sivan", "Mednik", "Female", "sivanm@gmail.com", false);
            await sl.users.register("teacTest1", "1234", "teac", "her", "Male", "teacher@gm.com", true);
            await sl.users.login("elibin", "1234");
            await sl.users.login("sivanm", "1234567");
            await sl.users.login("teacTest1", "1234");
            await sl.users.editUser("elibin", "123456", "Eli", "Bin", "Male");
            await sl.users.editUser("sivanm", "1234567", "Sivanm", "Mednik", "Female");
            await sl.users.editUser("teacTest1", "1234", "teac", "hers", "Male");
            var user1 = await sl.users.getUserByUserName("elibin");
            var user2 = await sl.users.getUserByUserName("sivanm");
            var user3 = await sl.users.getUserByUserName("teacTest1");
            test.ok(await sl.users.isPassMatch("elibin", "123456"));
            test.equal(user2.firstName, "Sivanm");
            test.equal(user3.lastName, "hers");
            await sl.users.deleteUser("teacTest1");
            await sl.users.deleteUser("sivanm");
            await sl.users.deleteUser("elibin");
            test.ok(true);
            test.done();
            return;
        }
        catch (err) {
            test.equal(err.message, "Error in edit profile, please try again");
        }
        test.done();
    },

    testEditSucsses2: async function (test) {
        try {
            await sl.users.register("elibin", "1234", "Eli", "Bin", "Male", "elib@gmail.com", false);
            await sl.users.register("sivanm", "1234567", "Sivan", "Mednik", "Female", "sivanm@gmail.com", false);
            await sl.users.register("teacTest1", "1234", "teac", "her", "Male", "teacher@gm.com", true);
            await sl.users.login("elibin", "1234");
            await sl.users.login("sivanm", "1234567");
            await sl.users.login("teacTest1", "1234");
            await sl.users.editUser("elibin", "1234", "Eli", "Bin", "Female");
            sleep(1000);
            await sl.users.editUser("sivanm", "1234567", "Sivanmed", "Mednik", "Female");
            sleep(1000);
            await sl.users.editUser("teacTest1", "1234", "teacs", "her", "Male");
            sleep(1000);
            var user1 = await sl.users.getUserByUserName("elibin");
            var user2 = await sl.users.getUserByUserName("sivanm");
            sleep(3000);
            var user3 = await sl.users.getUserByUserName("teacTest1");
            sleep(3000);
            test.equal(user1.sex, "Female");
            test.equal(user2.firstName, "Sivanmed");
            test.equal(user3.firstName, "teacs");
            await sl.users.deleteUser("teacTest1");
            await sl.users.deleteUser("sivanm");
            await sl.users.deleteUser("elibin");
            test.ok(true);
            test.done();
            return;
        }
        catch (err) {
            test.equal(err.message, "Error in edit profile, please try again");
        }
        test.done();
    },
    testEditSucsses3: async function (test) {
        try {
            await sl.users.register("elibin", "1234", "Eli", "Bin", "Male", "elib@gmail.com", false);
            await sl.users.login("elibin", "1234");
            await sl.users.editUser("elibin", "1234", "Eli", "Bin", "Male");
            var user1 = await sl.users.getUserByUserName("elibin");
            test.equal(user1.sex, "Male");
            test.equal(user1.firstName, "Eli");
            test.equal(user1.lastName, "Bin");
            await sl.users.deleteUser("elibin");
            test.ok(true);
            test.done();
            return;
        }
        catch (err) {
            test.equal(err.message, "Error in edit profile, please try again");
        }
        test.done();
    },
    testEditInvalid1: async function (test) {
        try {
            await sl.users.register("elibin", "1234", "Eli", "Bin", "Male", "elib@gmail.com", false);
            await sl.users.login("elibin", "1234");
            await sl.users.editUser("", "1234", "Eli", "Bin", "Male");
            test.ok(false);
            test.done();
            return;
        }
        catch (err) {
            test.equal(err.message, "Error in edit profile, please try again");
            await sl.users.deleteUser("elibin");
        }
        test.done();
    },
    testEditInvalid2: async function (test) {
        try {
            await sl.users.register("elibin", "1234", "Eli", "Bin", "Male", "elib@gmail.com", false);
            await sl.users.login("elibin", "1234");
            await sl.users.editUser("", "1234", "Eli", "Bin", "Male");
            test.ok(false);
            test.done();
            return;
        }
        catch (err) {
            test.equal(err.message, "Error in edit profile, please try again");
            await sl.users.deleteUser("elibin");
        }
        test.done();
    },
    testEditInvalid3: async function (test) {
        try {
            await sl.users.register("elibin", "1234", "Eli", "Bin", "Male", "elib@gmail.com", false);
            await sl.users.login("elibin", "1234");
            await sl.users.editUser("elibin", "1234", "", "Bin", "Male");
            test.ok(false);
            test.done();
            return;
        }
        catch (err) {
            test.equal(err.message, "Error in edit profile, please try again");
            await sl.users.deleteUser("elibin");
        }
        test.done();
    },
    testEditInvalid4: async function (test) {
        try {
            await sl.users.register("elibin", "1234", "Eli", "Bin", "Male", "elib@gmail.com", false);
            await sl.users.login("elibin", "1234");
            await sl.users.editUser("elibin", "1234", "Eli", "", "Male");
            test.ok(false);
            test.done();
            return;
        }
        catch (err) {
            test.equal(err.message, "Error in edit profile, please try again");
            await sl.users.deleteUser("elibin");
        }
        test.done();
    },
    testEditInvalid5: async function (test) {
        try {
            await sl.users.register("elibin", "1234", "Eli", "Bin", "Male", "elib@gmail.com", false);
            await sl.users.login("elibin", "1234");
            await sl.users.editUser("elibin", "1234", "Eli", "Bin", "");
            test.ok(false);
            test.done();
            return;
        }
        catch (err) {
            test.equal(err.message, "Error in edit profile, please try again");
            await sl.users.deleteUser("elibin");
        }
        test.done();
    },
    testEditInvalidChar1: async function (test) {
        try {
            await sl.users.register("elibin", "1234", "Eli", "Bin", "Male", "elib@gmail.com", false);
            await sl.users.login("elibin", "1234");
            await sl.users.editUser("eli\nbin", "1234", "Eli", "Bin", "Male");
            test.ok(false);
            test.done();
            return;
        }
        catch (err) {
            test.equal(err.message, "Error in edit profile,invalid characters, please try again");
            await sl.users.deleteUser("elibin");
        }
        test.done();
    },
    testEditInvalidChar2: async function (test) {
        try {
            await sl.users.register("elibin", "1234", "Eli", "Bin", "Male", "elib@gmail.com", false);
            await sl.users.login("elibin", "1234");
            await sl.users.editUser("eli\tbin", "1234", "Eli", "Bin", "Male");
            test.ok(false);
            test.done();
            return;
        }
        catch (err) {
            test.equal(err.message, "Error in edit profile,invalid characters, please try again");
            await sl.users.deleteUser("elibin");
        }
        test.done();
    },
    testEditInvalidPassword: async function (test) {
        try {
            await sl.users.register("elibin", "1234", "Eli", "Bin", "Male", "elib@gmail.com", false);
            await sl.users.login("elibin", "1234");
            await sl.users.editUser("elibin", "34", "Eli", "Bin", "Male");
            test.ok(false);
            test.done();
            return;
        }
        catch (err) {
            test.equal(err.message, "Error in edit profile,password too short");
            await sl.users.deleteUser("elibin");
        }
        test.done();
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
}
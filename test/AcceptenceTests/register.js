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
    testRegisterSucsses: async function (test) {
        try {
            test.ok(await sl.users.register("elibin", "1234", "Eli", "Bin", "Male", "elib@gmail.com", false));
            test.ok(await sl.users.register("sivanm", "1234567", "Sivan", "Mednik", "Female", "sivanm@gmail.com", false));
            test.ok(await sl.users.register("teacTest1", "1234", "teac", "her", "Male", "teacher@gm.com", true));
            await sl.users.deleteUser("teacTest1");
            await sl.users.deleteUser("sivanm");
            await sl.users.deleteUser("elibin");
        }
        catch (err) {
            test.equal(err.message, "Error in register, please try again");
        }
        test.done();
    },
    testRegisterUserNameExist: async function (test) {
        try {
            await sl.users.register("elibin", "1234", "Eli", "Bin", "Male", "elib@gmail.com", false);
            await sl.users.register("elibin", "12345", "Elimo", "Bingi", "Male", "elimo@gmail.com", false);
            test.ok(false);
            test.done();
            return;
        }
        catch (err) {
            test.equal(err.message, "Error in register, please try again");
        }
        await sl.users.deleteUser("elibin");
        test.done();
    },
    testRegisterPasswordShort: async function (test) {
        try {
            await sl.users.register("elibin", "123", "Eli", "Bin", "Male", "elib@gmail.com", false);
            test.ok(false);
            test.done();
            return;
        }
        catch (err) {
            test.equal(err.message, "Error in register,password too short");
        }
        test.done();
    },
    testRegisterNoUserName: async function (test) {
        try {
            await sl.users.register("", "123", "Eli", "Bin", "Male", "elib@gmail.com", false);
            test.ok(false);
            test.done();
            return;
        }
        catch (err) {
            test.equal(err.message, "Error in register, please try again");
        }
        test.done();
    },
    testRegisterNoPassword: async function (test) {
        try {
            await sl.users.register("elibin", "", "Eli", "Bin", "Male", "elib@gmail.com", false);
            test.ok(false);
            test.done();
            return;
        }
        catch (err) {
            test.equal(err.message, "Error in register, please try again");
        }
        test.done();
    },
    testRegisterIllegalChars: async function (test) {
        try {
            await sl.users.register("elib\nin", "1234", "Eli", "Bin", "Male", "elib@gmail.com", false);
            test.ok(false);
            test.done();
            return;
        }
        catch (err) {
            test.equal(err.message, "Error in register,invalid characters, please try again");
        }
        test.done();
    },
    testRegisterIllegalChars2: async function (test) {
        try {
            await sl.users.register("elib\tin", "1234", "Eli", "Bin", "Male", "elib@gmail.com", false);
            test.ok(false);
            test.done();
            return;
        }
        catch (err) {
            test.equal(err.message, "Error in register,invalid characters, please try again");
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
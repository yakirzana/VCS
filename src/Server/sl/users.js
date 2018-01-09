var User = require('../classes/User.js');

module.exports = function (bl) {
    this.login = async function (username, password) {
        try {
            await bl.users.getUserByUserName(username);
        }
        catch (err) {
            throw new Error("the user don't exist in system");
        }
        if (!await bl.users.isPassMatch(username, password))
            throw new Error("illegal password");
        return true;
    };

    this.logout = function (username) {
        return true;
    };

    this.register = function (username, password, firstName, lastName, sex, email, isTeacher) {
        var user = bl.users.addUser(username, password, firstName, lastName, sex, email, isTeacher);
        return user;
    };

    this.deleteUser = async function (username) {
        await bl.users.deleteUser(username);
        return true;
    };

    this.getUserByUserName = async function (username) {
        return await bl.users.getUserByUserName(username);
    };

    this.createUserHash = function (username) {
        return bl.users.createUserHash(username);
    };

    this.isHashMatch = function (username, hash) {
        return bl.users.isHashMatch(username, hash);
    };

};

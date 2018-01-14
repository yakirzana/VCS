const crypto = require('crypto');
var User = require('../classes/User.js');

module.exports = function (dl) {
    this.getUserByUserName = async function (username) {
        var user = await dl.users.getUserByUserName(username);
        if(user == null)
            throw new Error("cannot find user");
        return user;
    };

    this.addUser = function (username, password, firstName, lastName, sex, email, isTeacher) {
        var user = new User(username, password, firstName, lastName, sex, email, isTeacher);
        dl.users.addUser(user);
        return user;
    };

    this.isPassMatch = async function (username, password) {
        var user;
        try {
            user = await this.getUserByUserName(username);
        }
        catch (err) {
            return false;
        }
        return (user != undefined && user.password == password);
    };

    this.isHashMatch = async function (username, hash) {
        var user = await this.getUserByUserName(username);
        var userHash = crypto.createHash('sha256').update(username + user.password).digest('hex');
        return userHash == hash;
    };

    this.createUserHash = async function (username) {
        var user = await this.getUserByUserName(username);
        return crypto.createHash('sha256').update(username + user.password).digest('hex');
    };


    this.deleteUser = async function (username) {
        var user = await this.getUserByUserName(username);
        await dl.users.deleteUser(user);
    };

    this.saveUser = function (user) {
        dl.users.saveUser(user);
    };
};


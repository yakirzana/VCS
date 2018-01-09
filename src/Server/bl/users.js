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
        try {
            var user = await this.getUserByUserName(username);
        }
        catch (err) {
            return false;
        }
        return user != undefined && user.password == password;
    };

    this.isHashMatch = function (username, hash) {
        var user = this.getUserByUserName(username);
        var userHash = crypto.createHash('sha256').update(username + user.password);
        return userHash == hash;
    };

    this.createUserHash = function (username) {
        var user =  this.getUserByUserName(username);
        return crypto.createHash('sha256').update(username + user.password);
    };


    this.deleteUser = async function (username) {
        var user = await this.getUserByUserName(username);
        await dl.users.deleteUser(user);
    };
};


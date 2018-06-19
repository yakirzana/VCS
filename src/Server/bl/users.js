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
        password = this.getHashPassword(password);
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
        password = this.getHashPassword(password);
        return (user != undefined && user.password == password);
    };

    this.isHashMatch = async function (username, hash) {
        var user = await this.getUserByUserName(username);
        var userHash = crypto.createHash('sha256').update(username + user.password).digest('hex');
        return userHash == hash;
    };

    this.createUserHash = async function (username) {
        await new Promise(resolve => setTimeout(resolve, 500));
        var user = await this.getUserByUserName(username);
        var hash = await crypto.createHash('sha256').update(username + user.password).digest('hex');
        return hash;
    };

    this.deleteUser = async function (username) {
        var user = await this.getUserByUserName(username);
        await dl.users.deleteUser(user);
    };

    this.editUser = async function (username, password, firstName, lastName, gender) {
        var user = await this.getUserByUserName(username);
        if (password != null)
            user.password = this.getHashPassword(password);
        user.firstName = firstName;
        user.lastName = lastName;
        user.sex = gender;
        await this.saveUser(user);
    };

    this.makeUserTeacher = async function (username) {
        var user = await this.getUserByUserName(username);
        user.isTeacher = true;
        await this.saveUser(user);
    };

    this.getHashPassword = function (password) {
        var hash = crypto.createHash('sha1');
        hash.update(password);
        return hash.digest('hex');
    };

    this.saveUser = async function (user) {
        await dl.users.saveUser(user);
    };

    this.getAllRegularUsers = async function () {
        return await dl.users.getAllRegularUsers();
    };
};


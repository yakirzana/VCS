const crypto = require('crypto');
var User = require('../classes/User.js');

var users = [new User("stud1", "1234", "stud", "ent", "Male", "student@gm.com", false),
             new User("stud2", "1234", "stud", "it", "Female", "studenit@gm.com", false),
             new User("teac1", "1234", "teac", "her", "Male", "teacher@gm.com", true),
            ];

module.exports.getUserByUserName = function(username) {
    var user = users.find (o => o.username === username);
    return user;
};

module.exports.addUser = function (username, password, firstName, lastName, sex, email, isTeacher) {
    var user = new User(sername, password, firstName, lastName, sex, email, isTeacher);
    users.push(user);
    return user;
};

module.exports.isPassMatch = function (username, password) {
    var user = this.getUserByUserName(username);
    return user != undefined && user.password == password;
};

module.exports.isHashMatch = function (username, hash) {
    var user = this.getUserByUserName(username);
    var userHash = crypto.createHash('sha256').update(username + user.password);
    return userHash == hash;
};

module.exports.createUserHash = function (username) {
    var user = this.getUserByUserName(username);
    return crypto.createHash('sha256').update(username + user.password);
};


module.exports.deleteUser = function (username) {
    var user = this.getUserByUserName(username);
    var index = users.indexOf(user);
    delete users[index];
    return user;
};
var user = require('../classes/User.js');

var users = [];

module.exports.getUserByUserName = function(username) {
    var user = users.find (o => o.username === username);
    return user;
};

module.exports.addUser = function (username, password, firstName, lastName, sex, email, isTeacher) {
    user = new User(sername, password, firstName, lastName, sex, email, isTeacher);
    users.push(user);
    return user;
};


module.exports.deleteUser = function (username) {
    user = this.getUserByUserName(username);
    var index = users.indexOf(user);
    delete users[index];
    return user;
};
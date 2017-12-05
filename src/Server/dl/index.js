var Users = require('./users');

module.exports = function (db) {
    this.users = new Users(db);
};

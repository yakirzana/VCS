var Users = require('./users');
var Rooms = require('./rooms');

module.exports = function (db) {
    this.users = new Users(db);
    this.rooms = new Rooms(db);
};

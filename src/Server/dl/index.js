var Users = require('./users');
var Rooms = require('./rooms');
var Chats = require('./chats');
var Classes = require('./classes');

module.exports = function (db, log) {
    this.users = new Users(db, log);
    this.rooms = new Rooms(db, log);
    this.chats = new Chats(db, log);
    this.classes = new Classes(db, log);
};

var Users = require('./users');
var Rooms = require('./rooms');
var Chats = require('./chats');
var Classes = require('./classes');

module.exports = function (db) {
    this.users = new Users(db);
    this.rooms = new Rooms(db);
    this.chats = new Chats(db);
    this.classes = new Classes(db);
};

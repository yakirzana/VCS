var Users = require('./users');
var Rooms = require('./rooms');
var Chats = require('./chats');
var Classes = require('./classes');
var Alerts = require('./alerts');

module.exports = function (bl) {
    this.strings = require('../lang/heb.json');
    this.users = new Users(bl);
    this.rooms = new Rooms(bl);
    this.chats = new Chats(bl);
    this.classes = new Classes(bl);
    this.alerts = new Alerts(bl);
};

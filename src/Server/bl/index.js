var Users = require('./users');
var Rooms = require('./rooms');
var Chats = require('./chats');
var Classes = require('./classes');
var Alerts = require('./alerts');

module.exports = function (dl) {
    this.rooms = new Rooms(dl);
    this.users = new Users(dl);
    this.chats = new Chats(dl);
    this.classes = new Classes(dl);
    this.aletrs = new Alerts(dl);
};


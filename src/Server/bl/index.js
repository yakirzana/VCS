var Users = require('./users');
var Rooms = require('./rooms');

module.exports = function (dl) {
    this.strings = require('../lang/heb.json');
    this.rooms = new Rooms(dl);
    this.users = new Users(dl);
};


var Users = require('./users');

module.exports = function (dl) {
    this.strings = require('../lang/heb.json');
    this.rooms = require('./rooms');
    this.users = new Users(dl);
};


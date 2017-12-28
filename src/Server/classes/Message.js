'use strict';

module.exports = class Message {
    constructor(username, date, msg, roomID) {
        this._username = username;
        this._date = date;
        this._msg = msg;
        this._roomID = roomID;
    }


    get username() {
        return this._username;
    }

    set username(value) {
        this._username = value;
    }

    get date() {
        return this._date;
    }

    set date(value) {
        this._date = value;
    }


    get msg() {
        return this._msg;
    }

    set msg(value) {
        this._msg = value;
    }

    get roomID() {
        return this._roomID;
    }

    set roomID(value) {
        this._roomID = value;
    }
}
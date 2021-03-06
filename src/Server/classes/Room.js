'use strict';

module.exports = class Room {
    constructor(id, isLocked, name, desc, isTimeLimit, timeLimit, base64, listUsers) {
        this._id = id;
        this._isLocked = isLocked;
        this._userInControl = undefined;
        this._name = name;
        this._desc = desc;
        this._isTimeLimit = isTimeLimit;
        this._timeLimit = timeLimit;
        this._base64 = base64;
        this._listUsers = listUsers;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get userInControl() {
        return this._userInControl;
    }

    set userInControl(value) {
        this._userInControl = value;
    }


    get isLocked() {
        return this._isLocked;
    }

    set isLocked(value) {
        this._isLocked = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get desc() {
        return this._desc;
    }

    set desc(value) {
        this._desc = value;
    }

    get isTimeLimit() {
        return this._isTimeLimit;
    }

    set isTimeLimit(value) {
        this._isTimeLimit = value;
    }

    get timeLimit() {
        return this._timeLimit;
    }

    set timeLimit(value) {
        this._timeLimit = value;
    }

    get base64() {
        return this._base64;
    }

    set base64(value) {
        this._base64 = value;
    }

    get listUsers() {
        return this._listUsers;
    }

    set listUsers(value) {
        this._listUsers = value;
    }

    toJson() {
        return {id: this.id, name: this.name, desc: this.desc};
    }

};

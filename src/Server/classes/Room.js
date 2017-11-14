'use strict';

module.exports = class Room {
    constructor(id, isLocked, name, desc, isTimeLimit, timeLimit) {
        this._id = id;
        this._isLocked = isLocked;
        this._userInControl = undefined;
        this._name = name;
        this._desc = desc;
        this._isTimeLimit = isTimeLimit;
        this._timeLimit = timeLimit;
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

}

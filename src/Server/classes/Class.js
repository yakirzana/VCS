'use strict';

module.exports = class Class {
    constructor(name, classID, descriptions, teacherUserName, roomList) {
        this._name = name;
        this._classID = classID;
        this._descriptions = descriptions;
        this._teacherUserName = teacherUserName;
        this._roomList = roomList;
    }


    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get classID() {
        return this._classID;
    }

    set classID(value) {
        this._classID = value;
    }


    get descriptions() {
        return this._descriptions;
    }

    set descriptions(value) {
        this._descriptions = value;
    }

    get teacherUserName() {
        return this._teacherUserName;
    }

    set teacherUserName(value) {
        this._teacherUserName = value;
    }

    get roomList() {
        return this._roomList;
    }

    set roomList(value) {
        this._roomList = value;
    }
}
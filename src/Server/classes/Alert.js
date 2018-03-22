'use strict';

module.exports = class Alert {
    constructor(alertType, roomID, date) {
        this._alertType = alertType;
        this._roomID = roomID;
        this._date = date;
    }

    get alertType() {
        return this._alertType;
    }

    set alertType(value) {
        this._alertType = value;
    }

    get roomID() {
        return this._roomID;
    }

    set roomID(value) {
        this._roomID = value;
    }


    get date() {
        return this._date;
    }

    set date(value) {
        this._date = value;
    }
};

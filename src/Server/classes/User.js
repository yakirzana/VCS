'use strict';

module.exports = class User {
    constructor(username, password, firstName, lastName, sex, email, isTeacher) {
        this._username = username;
        this._password = password;
        this._firstName = firstName;
        this._lastName = lastName;
        this._sex = sex;
        this._email = email;
        this._isTeacher = isTeacher;
    }

    get username() {
        return this._username;
    }

    set username(value) {
        this._username = value;
    }

    get password() {
        return this._password;
    }

    set password(value) {
        this._password = value;
    }


    get firstName() {
        return this._firstName;
    }

    set firstName(value) {
        this._firstName = value;
    }

    get lastName() {
        return this._lastName;
    }

    set lastName(value) {
        this._lastName = value;
    }

    get sex() {
        return this._sex;
    }

    set sex(value) {
        this._sex = value;
    }

    get email() {
        return this._email;
    }

    set email(value) {
        this._email = value;
    }

    get isTeacher() {
        return this._isTeacher;
    }

    set isTeacher(value) {
        this._isTeacher = value;
    }
};

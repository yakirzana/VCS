var Class = require('../classes/Class.js');

module.exports = function (dl) {
    this.getRoomsInClass = async function (classID) {
        var roomList = await dl.classes.getRoomsInClass(classID);
        if(roomList == null)
            throw new Error("cannot find roomList");
        return roomList;
    };

    this.getClassByUser = async function (username) {
        var res = [];
        var classList;
        var roomList = await dl.rooms.getRoomsOfUser(username);
        for (var room of roomList) {
            classList = await this.getClassByRoomID(room);
            for (var clss of classList) {
                if (res.indexOf(clss) <= -1)
                    res.push(clss);
            }
        }
        if (res == null)
            throw new Error("cannot find classList");
        return res;
    };

    this.getClassByID = async function (classID) {
        var clss = await dl.classes.getClassByID(classID);
        if(clss == null)
            throw new Error("cannot find roomList");
        return clss;
    };

    this.deleteRoomFromClass = async function (roomID, classID) {
        await dl.classes.deleteRoomFromClass(roomID, classID);
    };

    this.addNewClass = async function (name, descriptions, teacherUserName, roomList) {
        var classID = await this.getNextID();

        var clss = new Class(name, classID, descriptions, teacherUserName, roomList);
        dl.classes.addNewClass(clss);
        return classID;
    };

    this.addRoomToClass = async function (roomID, classID) {
        classID = parseInt(classID);
        var cls = await this.getClassByID(classID);
        var roomList = cls.roomList;
        roomList.indexOf(roomID) === -1 ? roomList.push(roomID) : console.log("This room " + roomID + " is already exists in class " + classID);
        await this.saveClass(cls);
    };

    this.removeClass = async function (classID) {
        dl.classes.removeClass(classID);
    };

    this.saveClass = function(clss) {
        dl.classes.saveClass(clss);
    };

    this.getClassByRoomID = async function (roomID) {
        var classes = await dl.classes.getClassByRoomID(roomID);
        return classes;
    };
    this.getAllClasses = async function () {
        var classes = await dl.classes.getAllClasses();
        return classes;
    };

    this.getAllClassesOfTeach = async function (teach) {
        return await dl.classes.getAllClassesOfTeach(teach);
    };

    this.getNextID = async function () {
        return await dl.classes.getMaxID() + Math.floor((Math.random() * 10) + 1);
    };
};
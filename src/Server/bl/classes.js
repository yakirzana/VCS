var Class = require('../classes/Class.js');

module.exports = function (dl) {
    this.getRoomsInClass = async function (classID) {
        var roomList = await dl.classes.getRoomsInClass(classID);
        if(roomList == null)
            throw new Error("cannot find roomList");
        return roomList;
    };

    this.getClassByID = async function (classID) {
        var clss = await dl.classes.getClassByID(classID);
        if(clss == null)
            throw new Error("cannot find roomList");
        return clss;
    };

    this.addNewClass = function (name, classID, descriptions, teacherUserName, roomList) {
        var clss = new Class(name, classID, descriptions, teacherUserName, roomList);
        dl.classes.addNewClass(clss);
        return clss;
    };

    this.removeClass = async function (classID) {
        dl.classes.removeClass(classID);
    };

    this.saveClass = function(clss) {
        dl.classes.saveClass(clss);
    }
}
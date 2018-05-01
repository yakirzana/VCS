var Class = require('../classes/Class.js');

module.exports = function (db, log) {
    this.getRoomsInClass = async function (classID) {
        try {
            let clss = await db.collection('classes').findOne({_classID: classID});
            if(clss == null)
                throw new Error("cant find class");
            clss = Object.assign(new Class, clss);
            return clss.roomList;
        } catch (err) {
            log.error("error on bl getRoomsInClass " + err.message);
            return null;
        }
    };

    this.getClassByID = async function (classID) {
        try {
            let clss = await db.collection('classes').findOne({_classID: classID});
            if(clss == null)
                throw new Error("cant find class");
            clss = Object.assign(new Class, clss);
            return clss;
        } catch (err) {
            log.error("error on bl getClassByID With classID " + classID + " " + err.message);
            return null;
        }
    };

    this.addNewClass = function (clss) {
        db.collection('classes').insertOne(clss, function (err, r) {
            log.info("Add Class " + clss + " Completed");
            if (err)
                log.error("Add Class " + Class + " Failed " + err.message);
        });
    };

    this.removeClass = function (classID) {
        db.collection('classes').deleteOne({_classID: classID}, function (err, r) {
            log.info("Delete Class " + classID + " Completed");
            if (err)
                log.error("Delete Class " + classID + " Failed " + err.message);
        });
    };

    this.getMaxID = async function () {
        var cls = await db.collection('classes').find().sort({_classID: -1}).limit(1); // for MAX
        var id = await cls.toArray();
        if (id.length == 0)
            return 0;
        return await id[0]._classID;
    };

    this.deleteRoomFromClass = async function (roomID, classID) {
        var clss = await this.getClassByID(classID);
        var index = clss.roomList.indexOf(roomID);
        if (index >= 0) {
            clss.roomList.splice(index, 1);
        }
        this.saveClass(clss);
    };

    this.saveClass = async function (clss) {
        var clss = await clss;
        var myquery = { _classID: clss.classID };
        var newvalues = { $set: {
            _name: clss.name,
            _descriptions: clss.descriptions,
            _teacherUserName: clss.teacherUserName,
            _roomList: clss.roomList
        }};

        db.collection("classes").updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
        });

    }

    this.getClassByRoomID = async function (roomID) {
        var res = [];
        var allClasses = await this.getAllClasses();
        for (var clss of allClasses) {
            if (clss.roomList.indexOf(roomID) >= 0) {
                res.push(clss.classID);
            }
        }
        return res;

    };

    this.getAllClasses = async function () {
        try {
            let clss = await db.collection('classes').find().toArray();
            if (clss == null)
                throw new Error("there is a problem to find classes");
            var clssList = [];
            for (var cls of clss) {
                var classInSystem = Object.assign(new Class, cls);
                clssList.push(classInSystem);
            }
            return clssList;
        } catch (err) {
            log.error("error on bl getAllClasses " + err.message);
            return null;
        }
    };

    this.getAllClassesOfTeach = async function (teach) {
        try {
            let clss = await db.collection('classes').find({"_teacherUserName": teach}).toArray();
            if (clss == null)
                throw new Error("there is a problem to find classes");
            var clssList = [];
            for (var cls of clss) {
                var classInSystem = Object.assign(new Class, cls);
                clssList.push(classInSystem);
            }
            return clssList;
        } catch (err) {
            log.error("error on bl getAllClassesOfTeach " + err.message);
            return null;
        }
    };
};
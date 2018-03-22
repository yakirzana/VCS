var Class = require('../classes/Class.js');

module.exports = function (db) {
    this.getRoomsInClass = async function (classID) {
        try {
            let clss = await db.collection('classes').findOne({_classID: classID});
            if(clss == null)
                throw new Error("cant find class");
            clss = Object.assign(new Class, clss);
            return clss.roomList;
        } catch (err) {
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
            return null;
        }
    };

    this.addNewClass = function (clss) {
        db.collection('classes').insertOne(clss, function (err, r) {
        });
    };
    this.removeClass = function (classID) {
        db.collection('classes').deleteOne({_classID: classID}, function (err, r) {
        });
    }

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
            if (roomID in clss.roomList) {
                res.push(clss.classID)
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
            return null;
        }
    };
};
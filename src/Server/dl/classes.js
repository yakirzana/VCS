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
            console.log("Error: ", err);
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
            console.log("Error: ", err);
            return null;
        }
    };

    this.addNewClass = function (clss) {
        db.collection('classes').insertOne(clss, function (err, r) {
            if (err == null)
                console.log("added class to db");
            else
                console.log(err);
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
            console.log(res);
        });

    }
};
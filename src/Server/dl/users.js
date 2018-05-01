var User = require('../classes/User.js');

module.exports = function (db, log) {
    this.addUser = function (user) {
        db.collection('users').insertOne(user, function (err, r) {
            log.info("Add user " + user + " Completed");
            if (err)
                log.error("Add user " + user + " Failed " + err.message);
        });
    };

    this.getUserByUserName = async function(username) {
        try {
            let user = await db.collection('users').findOne({_username: username});
            if (user == null)
                return null;
            user = Object.assign(new User, user);
            return user;
        } catch (err) {
            log.error("Error on Bl getUserByUserName " + err.message);
            return null;
        }
    };

    this.deleteUser = function (user) {
        db.collection('users').deleteOne({_username: user.username}, function (err, r) {
            log.info("Delete user " + user + " Completed");
            if (err)
                log.error("Delete user " + user + " Failed " + err.message);
        });

    };

    this.saveUser = async function (user) {
        var user = await user;
        var myquery = {_username: user.username};
        var newvalues = {
            $set: {
                _password: user.password,
                _firstName: user.firstName,
                _lastName: user.lastName,
                _sex: user.sex,
                _email: user.email,
                _isTeacher: user.isTeacher
            }
        };

        db.collection("users").updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
        });

    };

    this.getAllRegularUsers = async function () {
        try {
            let users = await db.collection('users').find({_isTeacher: false}).toArray();
            if (users == null)
                throw new Error("there is a problem to find users");
            var userList = [];
            for (var user of users) {
                var userInSystem = Object.assign(new User, user);
                userList.push(userInSystem);
            }
            return userList;
        } catch (err) {
            return null;
        }
    };
};

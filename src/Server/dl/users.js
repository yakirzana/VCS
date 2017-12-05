var User = require('../classes/User.js');

module.exports = function (db) {
    this.addUser = function (user) {
        db.collection('users').insertOne(user, function (err, r) {
            if (err == null)
                console.log("added users to db");
            else
                console.log(err);
        });
    };

    this.getUserByUserName = async function (username) {
        let user = await db.collection('users').find({_username: username}).next();
        user = Object.assign(new User, user);
        return user;
    };

    this.deleteUser = function (user) {
        db.collection('users').deleteOne({_username: user.username}, function (err, r) {
        });
    }
};

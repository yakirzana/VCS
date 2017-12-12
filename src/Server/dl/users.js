var User = require('../classes/User.js');

module.exports = function (db) {
    this.addUser = function (user) {
        db.collection('users').insertOne(user, function (err, r) {
            if (err == null)
                console.log("added user to db");
            else
                console.log(err);
        });
    };

    this.getUserByUserName = async function(username) {
        try {
            let user = await db.collection('users').findOne({_username: username});
            user = Object.assign(new User, user);
            return user;
        } catch (err) {
            console.log("Error: ", err);
            return null;
        }
    };

    this.deleteUser = function (user) {
        db.collection('users').deleteOne({_username: user.username}, function (err, r) {
        });
    }
};

var User = require('../classes/User.js');

module.exports = function (db) {
    this.addUser = function (user) {
        db.collection('users').insertOne(user, function (err, r) {
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
            return null;
        }
    };

    this.deleteUser = function (user) {
        db.collection('users').deleteOne({_username: user.username}, function (err, r) {
        });
    }
};

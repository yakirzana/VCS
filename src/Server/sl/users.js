var User = require('../classes/User.js');

module.exports = function (bl) {
    this.login = async function (username, password) {
        try {
            await bl.users.getUserByUserName(username);
        }
        catch (err) {
            throw new Error("the user doesn't exist in system");
        }
        if (!await bl.users.isPassMatch(username, password))
            throw new Error("illegal password");
        return true;
    };

    this.logout = async function (username) {
        return true;
    };

    this.register = async function (username, password, firstName, lastName, sex, email, isTeacher = false) {
        username = username.trim();
        if (username == "" || password == "" || firstName == "" || lastName == "" || sex == "" || email == "")
            throw new Error("Error in register, please try again");
        if (username.indexOf('\n') > -1 || username.indexOf('\t') > -1 || username.indexOf('@') > -1 || username.indexOf(' ') > -1)
            throw new Error("Error in register,invalid characters, please try again");
        if (password.length < 4)
            throw new Error("Error in register,password too short");
        try {
            await bl.users.getUserByUserName(username);
        }
        catch (err) {
            var user = await bl.users.addUser(username, password, firstName, lastName, sex, email, isTeacher);
            return user;
        }
        throw new Error("Error in register, please try again");
    };

    this.deleteUser = async function (username) {
        var rooms = await bl.rooms.getRoomsOfUser(username);
        for (room of rooms) {
            await bl.rooms.deleteUserFromRoom(room + "", username);
        }
        await bl.users.deleteUser(username);
        return true;
    };

    this.getUserByUserName = async function (username) {
        var user = await bl.users.getUserByUserName(username);
        delete user._password;
        return user;
    };

    this.createUserHash = async function (username) {
        return await bl.users.createUserHash(username);
    };

    this.isHashMatch = async function (username, hash) {
        return await bl.users.isHashMatch(username, hash);
    };

    this.editUser = async function (username, password, firstName, lastName, gender) {
        if (username == "" || firstName == "" || lastName == "" || gender == "")
            throw new Error("Error in edit profile, please try again");
        if (username.indexOf('\n') > -1 || username.indexOf('\t') > -1 || username.indexOf('@') > -1)
            throw new Error("Error in edit profile,invalid characters, please try again");
        if (password != "" && password.length < 4)
            throw new Error("Error in edit profile,password too short");
        if (password == undefined || password.trim() == "")
            password = null;
        await bl.users.editUser(username, password, firstName, lastName, gender);
    };

    this.makeUsersTeacher = async function (users) {
        for (user of users)
            await bl.users.makeUserTeacher(user);
    };

    this.isPassMatch = async function (username, password) {
        return await bl.users.isPassMatch(username, password);
    };

    this.getUsersForRoom = async function (roomId, classId, search) {
        var allUsers = await bl.users.getAllRegularUsers();
        var users = {};
        users.checked = [];
        users.notChecked = [];

        if (roomId > 0) {
            var room = await bl.rooms.getRoomById(roomId);
            var list = await room.listUsers;
            for (var i = 0; i < list.length; i++) {
                var selectedUser = await bl.users.getUserByUserName(list[i]);
                users.checked.push({
                    username: selectedUser.username,
                    fullName: selectedUser.firstName + " " + selectedUser.lastName
                });
            }
        }

        for (user of allUsers) {
            if (users.checked.findIndex(x => x.username === user.username) >= 0)
                continue;
            var userString = user.username + " " + user.firstName + " " + user.lastName;
            if (search == undefined || userString.includes(search))
                users.notChecked.push({username: user.username, fullName: user.firstName + " " + user.lastName});
        }
        return users;
    };
};

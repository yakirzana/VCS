var SL = require('../sl');

module.exports = function (app, sl, socket, log) {
    this.loggedUser = null;
    this.loggedIsTeacher = null;

    async function checkAuthRestricted(req, res, next) {
        if (!await isLogged(req, res, next))
            res.redirect('/login');
        else
            next();
    }

    async function checkAuth(req, res, next) {
        await isLogged(req);
        next();
    }

    async function isLogged(req) {
        if (!req.session || !req.session.userHash || !req.session.username ||
            await !sl.users.isHashMatch(req.session.username, req.session.userHash)) {
            this.loggedUser = null;
            this.loggedIsTeacher = null;
            return false;
        } else {
            this.loggedUser = req.session.username;
            var user = await sl.users.getUserByUserName(this.loggedUser);
            this.loggedIsTeacher = user.isTeacher;
            return true;
        }
    }

    // Post From Forms

    app.post('/login', async function (req, res) {
        var post = req.body;
        try {
            if (!(post && post.username && post.password))
                throw new Error("Missing info");
            await sl.users.login(post.username, post.password);
            req.session.userHash = await sl.users.createUserHash(post.username);
            req.session.username = post.username;
            res.redirect('/');
        }
        catch (err) {
            req.flash("message", err.message);
            res.redirect('/login');
        }
    });

    app.post('/signup', async function (req, res) {
        var post = req.body;
        try {
            if (!(post && post.username && post.password))
                throw new Error("Missing info");
            await sl.users.register(post.username, post.password, post.firstName, post.lastName, post.gender, post.email, false);
            req.session.userHash = await sl.users.createUserHash(post.username);
            req.session.username = post.username;
            res.redirect('/');
        }
        catch (err) {
            req.flash("message", err.message);
            res.redirect('/signup');
        }
    });

    app.post('/addClass', async function (req, res) {
        var post = req.body;
        try {
            if (!(post && post.className && post.className != "" && post.desc && post.desc != ""))
                throw new Error(sl.strings.missingForm);
            var id = await sl.classes.addNewClass(post.className, post.desc, this.loggedUser);
            res.end(JSON.stringify({result: sl.strings.successesForm, url: "/class/" + id}));
        }
        catch (err) {
            res.end(JSON.stringify({result: err.message}));
        }
    });

    app.post('/editClass', async function (req, res) {
        var post = req.body;
        try {
            if (!(post && post.className && post.className != "" && post.desc && post.desc != "" && post.classID && post.classID != ""))
                throw new Error(sl.strings.missingForm);
            await sl.classes.editClass(post.classID, post.className, post.desc);
            res.end(JSON.stringify({result: sl.strings.successesForm}));
        }
        catch (err) {
            res.end(JSON.stringify({result: err.message}));
        }
    });

    app.post('/removeClass', async function (req, res) {
        var post = req.body;
        try {
            if (!(post && post.classID && post.classID != ""))
                throw new Error(sl.strings.missingForm);
            await sl.classes.removeClass(post.classID);
            res.end(JSON.stringify({result: sl.strings.successesForm}));
        }
        catch (err) {
            res.end(JSON.stringify({result: err.message}));
        }
    });

    app.post('/addRoom', async function (req, res) {
        var post = req.body;
        try {
            if (!(post && post.roomName && post.roomName != "" && post.desc && post.desc != "" && post.timeLimit && post.timeLimit != ""
                && post.selectClass && post.selectClass != "" && post.users))
                throw new Error(sl.strings.missingForm);
            var id = await sl.rooms.addRoom(post.roomName, post.desc, this.loggedUser, post.timeLimit, post.selectClass);
            var users = JSON.parse(post.users);
            await sl.rooms.addUsersToRoom(id, users);
            res.end(JSON.stringify({result: sl.strings.successesForm, url: "/room/" + id}));
            res.end();
        }
        catch (err) {
            res.end(JSON.stringify({result: err.message}));
        }
    });

    app.post('/editRoom', async function (req, res) {
        var post = req.body;
        try {
            if (!(post && post.roomName && post.roomName != "" && post.desc && post.desc != "" && post.roomID && post.roomID != "" && post.users))
                throw new Error(sl.strings.missingForm);
            await sl.rooms.editRoom(post.roomID, post.roomName, post.desc, post.reset);
            var users = JSON.parse(post.users);
            await sl.rooms.addUsersToRoom(post.roomID, users);
            res.end(JSON.stringify({result: sl.strings.successesForm}));
        }
        catch (err) {
            res.end(JSON.stringify({result: err.message}));
        }
    });

    app.post('/removeRoom', async function (req, res) {
        var post = req.body;
        try {
            if (!(post && post.roomID && post.roomID != ""))
                throw new Error(sl.strings.missingForm);
            await sl.rooms.deleteRoom(post.roomID);
            res.end(JSON.stringify({result: sl.strings.successesForm}));
        }
        catch (err) {
            res.end(JSON.stringify({result: err.message}));
        }
    });

    app.post('/editProfile', async function (req, res) {
        var post = req.body;
        try {
            if (!(post && post.firstName && post.firstName != "" && post.lastName && post.lastName != "" && post.gender && post.gender != ""))
                throw new Error(sl.strings.missingForm);

            await sl.users.editUser(this.loggedUser, post.password, post.firstName, post.lastName, post.gender);

            res.end(JSON.stringify({result: sl.strings.successesForm}));
        }
        catch (err) {
            res.end(JSON.stringify({result: err.message}));
        }
    });

    app.post('/EditTeachers', async function (req, res) {
        var post = req.body;
        try {
            if (!(post && post.users))
                throw new Error(sl.strings.missingForm);
            var users = JSON.parse(post.users);
            await sl.users.makeUsersTeacher(users);
            log.info("users " + post.users + " is changed to be a teacher");
            res.end(JSON.stringify({result: sl.strings.successesForm}));
        }
        catch (err) {
            res.end(JSON.stringify({result: err.message}));
        }
    });

    //

    // Pages

    app.get('/logout', function (req, res) {
        sl.users.logout(req.session.username);
        delete req.session.username;
        delete req.session.userHash;
        res.redirect('/');
    });

    app.get('/login', checkAuth, function (req, res) {
        res.render('pages/login', {
            page: "login",
            strings: sl.strings,
            message: req.flash('message'),
            logged: this.loggedUser,
            isTech: this.loggedIsTeacher
        });
    });

    app.get('/signup', checkAuth, function (req, res) {
        res.render('pages/signup', {
            page: "signup",
            strings: sl.strings,
            message: req.flash('message'),
            logged: this.loggedUser,
            isTech: this.loggedIsTeacher
        });
    });

    app.get('/room/:roomId*', checkAuthRestricted, async function (req, res) {
        var roomId = req.params.roomId;
        var room;
        try {
            if (this.loggedIsTeacher)
                sl.alerts.removeAlert(roomId);
            room = await sl.rooms.getRoomById(roomId);
            if (!this.loggedIsTeacher && !room.users.contains(this.loggedUser))
                throw new Error();
            var chats = await sl.chats.getMessagesByRoom(parseInt(roomId));
            res.render('pages/room', {
                page: "room",
                strings: sl.strings,
                room,
                logged: this.loggedUser,
                isTech: this.loggedIsTeacher,
                chats: chats
            });
        }
        catch (err) {
            res.render('pages/noAccess', {
                page: "noAccess",
                strings: sl.strings,
                logged: this.loggedUser,
                isTech: this.loggedIsTeacher,
            });
        }
        //

    });

    app.get('/class/:classId*', checkAuthRestricted, async function (req, res) {
        try {
            var classId = req.params.classId;
            var user = await sl.users.getUserByUserName(this.loggedUser);
            if (this.loggedIsTeacher)
                var rooms = await sl.classes.getRoomsInClass(classId);
            else
                var rooms = await sl.classes.getRoomsAccessible(parseInt(classId), this.loggedUser);
            var alert = await sl.alerts.getAlertsFromClass(classId);
            var myClass = await sl.classes.getClassByID(classId);
            res.render('pages/class', {
                page: "class",
                strings: sl.strings,
                classId,
                logged: this.loggedUser,
                isTech: this.loggedIsTeacher,
                isTeacher: user.isTeacher,
                rooms: rooms,
                alert: alert,
                myClass: myClass
            });
        }
        catch (err) {
            res.render('pages/noAccess', {
                page: "noAccess",
                strings: sl.strings,
                logged: this.loggedUser,
                isTech: this.loggedIsTeacher,
            });
        }
    });

    app.get('/', checkAuth, function (req, res) {
        res.render('pages/home', {
            page: "home",
            strings: sl.strings,
            logged: this.loggedUser,
            isTech: this.loggedIsTeacher
        });
    });

    app.get('/myRooms', checkAuthRestricted, async function (req, res) {
        var rooms = await sl.rooms.getRoomsOfUser(this.loggedUser);
        res.render('pages/myRooms', {
            page: "room",
            strings: sl.strings,
            logged: this.loggedUser,
            rooms: rooms,
            isTech: this.loggedIsTeacher,
        });
    });

    app.get('/myClasses', checkAuthRestricted, async function (req, res) {
        if (this.loggedIsTeacher)
            var classes = await sl.classes.getClassesOfTeach(this.loggedUser);
        else
            var classes = await sl.classes.getClassesOfUser(this.loggedUser);
        res.render('pages/myClasses', {
            page: "class",
            strings: sl.strings,
            logged: this.loggedUser,
            isTech: this.loggedIsTeacher,
            classes: classes
        });
    });

    app.get('/admin', checkAuthRestricted, function (req, res) {
        res.render('pages/admin', {
            page: "admin",
            strings: sl.strings,
            logged: this.loggedUser,
            isTech: this.loggedIsTeacher
        });
    });

    app.get('/profile', checkAuthRestricted, async function (req, res) {
        var user = await sl.users.getUserByUserName(this.loggedUser);
        res.render('pages/profile', {
            page: "profile",
            strings: sl.strings,
            logged: this.loggedUser,
            isTech: this.loggedIsTeacher,
            user: user
        });
    });

    //

    // Getters From Forms

    app.get('/getClasses', checkAuthRestricted, async function (req, res) {
        var classes = await sl.classes.getClassesOfTeach(this.loggedUser);
        res.end(JSON.stringify(classes));
    });

    app.get('/getRooms', checkAuthRestricted, async function (req, res) {
        var classes = await sl.rooms.getRoomsOfUser(this.loggedUser);
        res.end(JSON.stringify(classes));
    });

    app.get('/getUsers/:roomId/:classId/:search*?', async function (req, res) {
        var roomId = req.params.roomId;
        var classId = req.params.classId;
        var search = req.params.search;
        var users = await sl.users.getUsersForRoom(roomId, classId, search);
        res.end(JSON.stringify(users));
    });

    //

    // Rest API with analyzer system
    app.get('/report/:roomId/:alertType', function (req, res) {
        var roomId = req.params.roomId;
        var alertType = req.params.alertType;
        console.log("got alert to " + roomId + " " + alertType);
        log.info("Routs: got alert to " + roomId + " " + alertType);
        socket.alerts.addAlert(null, roomId, {"critical_moment": alertType});
        res.end("OK");
    });
    //


    // Errors!!

    //The 404 Route (ALWAYS Keep this as the last route)
    app.get('*', function (req, res) {
        res.render('pages/404', {
            page: "404",
            strings: sl.strings,
            logged: this.loggedUser,
            isTech: this.loggedIsTeacher
        });
    });

    app.use(function (err, req, res, next) {
        console.log("Got Error ON Express!! " + err.msg);
        log.error("Got Error ON Express!! " + err.msg);
        next();
    });
    //
};
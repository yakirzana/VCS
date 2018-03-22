var SL = require('../sl');

module.exports = function (app, sl) {
    this.loggedUser = null;

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
            return false;
        } else {
            this.loggedUser = req.session.username;
            return true;
        }
    }

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
            logged: this.loggedUser
        });
    });

    app.get('/room/:roomId*', checkAuthRestricted, async function (req, res) {
        var roomId = req.params.roomId;
        var room;
        try {
            room = await sl.rooms.getRoomById(roomId);
            var chats = await sl.chats.getMessagesByRoom(parseInt(roomId));
            res.render('pages/room', {page: "room", strings: sl.strings, room, logged: this.loggedUser, chats: chats});
        }
        catch (err) {
            //TODO replace with error msg to user
            res.render('pages/home', {page: "home", strings: sl.strings, logged: this.loggedUser});
        }
        //

    });

    app.get('/class/:classId*', checkAuthRestricted, async function (req, res) {
        var classId = req.params.classId;
        var user = await sl.users.getUserByUserName(this.loggedUser);
        var rooms = await sl.classes.getRoomsInClass(classId);
        console.log(rooms);
        var alert = await sl.alerts.getAlertsFromClass(classId);
        console.log(alert);
        res.render('pages/class', {
            page: "class",
            strings: sl.strings,
            classId,
            logged: this.loggedUser,
            isTeacher: user.isTeacher,
            rooms: rooms,
            alert: alert
        });
    });

    app.get('/', checkAuth, function (req, res) {
        res.render('pages/home', {page: "home", strings: sl.strings, logged: this.loggedUser});
    });

    app.get('/myRooms', checkAuthRestricted, function (req, res) {
        res.render('pages/myRooms', {page: "room", strings: sl.strings, logged: this.loggedUser});
    });

    app.get('/myClasses', checkAuthRestricted, function (req, res) {
        res.render('pages/myClasses', {page: "class", strings: sl.strings, logged: this.loggedUser});
    });
}
module.exports = function (app, bl) {
    this.loggedUser = null;

    function checkAuthRestricted(req, res, next) {
        if (!isLogged(req, res, next))
            res.redirect('/login');
        else
            next();
    }

    function checkAuth(req, res, next) {
        isLogged(req);
        next();
    }

    function isLogged(req) {
        if (!req.session || !req.session.userHash || !req.session.username ||
            bl.users.isHashMatch(req.session.username, req.session.userHash)) {
            this.loggedUser = null;
            return false;
        } else {
            this.loggedUser = req.session.username;
            return true;
        }
    }

    app.post('/login', function (req, res) {
        var post = req.body;
        if ((post && post.username && post.password )
            && (bl.users.isPassMatch(post.username, post.password))) {
            req.session.userHash = bl.users.createUserHash(post.username);
            req.session.username = post.username;
            res.redirect('/');
        } else {
            req.flash("message","bad");
            res.redirect('/login');
        }
    });

    app.get('/logout', function (req, res) {
        delete req.session.username;
        delete req.session.userHash;
        res.redirect('/');
    });

    app.get('/login', checkAuth, function (req, res) {
        res.render('pages/login', {
            page: "login",
            strings: bl.strings,
            message: req.flash('message'),
            logged: this.loggedUser
        });
    });

    app.get('/room/:roomId*', checkAuthRestricted, async function (req, res) {
        var roomId = req.params.roomId;
        var room;
        try {
            room = await bl.rooms.getRoomById(roomId);
            var chats = await bl.chats.getMessagesByRoom(parseInt(roomId));
            res.render('pages/room', {page: "room", strings: bl.strings, room, logged: this.loggedUser, chats: chats});
        }
        catch (err) {
            //TODO replace with error msg to user
            room = bl.rooms.addRoom(roomId, true, "name", "desc", false, true, null);
            console.log("Create new room ", roomId);
        }
        //

    });

    app.get('/class/:classId*', checkAuthRestricted, async function (req, res) {
        var classId = req.params.classId;
        var user = await bl.users.getUserByUserName(this.loggedUser);
        res.render('pages/class', {page: "class", strings: bl.strings, classId, logged: this.loggedUser, isTeacher: user.isTeacher});
    });

    app.get('/', checkAuth, function (req, res) {
        res.render('pages/home', {page: "home", strings: bl.strings, logged: this.loggedUser});
    });

    app.get('/myRooms', checkAuthRestricted, function (req, res) {
        res.render('pages/myRooms', {page: "room", strings: bl.strings, logged: this.loggedUser});
    });

    app.get('/myClasses', checkAuthRestricted, function (req, res) {
        res.render('pages/myClasses', {page: "class", strings: bl.strings, logged: this.loggedUser});
    });
}
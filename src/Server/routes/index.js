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

    app.get('/room/:roomId*', checkAuthRestricted, function (req, res) {
        var roomId = req.params.roomId;
        var room = bl.rooms.getRoomById(roomId);
        //TODO: remove later and return a error
        if (room === undefined) {
            room = bl.rooms.addRoom(roomId, true, "name", "desc", false, true, null);
        }
        //
        res.render('pages/room', {page: "room", strings: bl.strings, room, logged: this.loggedUser});
    });

    app.get('/', checkAuth, function (req, res) {
        res.render('pages/home', {page: "home", strings: bl.strings, logged: this.loggedUser});
    });

    app.get('/myRooms', checkAuthRestricted, function (req, res) {
        res.render('pages/myRooms', {page: "room", strings: bl.strings, logged: this.loggedUser});
    });
}
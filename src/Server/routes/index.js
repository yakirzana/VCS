var bl = require('../bl');

function checkAuth(req, res, next) {
    if (!req.session || !req.session.userHash || !req.session.username ||
        bl.users.isHashMatch(req.session.username, req.session.userHash)) {
        res.redirect('/login');
    } else {
        next();
    }
}

module.exports = function(app, data) {
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

    app.get('/login', function (req, res) {
        res.render('pages/login', {page: "login" , strings: data.strings, message: req.flash('message')});
    });

    app.get('/room/:roomId*', function(req, res) {
        var roomId = req.params.roomId;
        var room = data.rooms.getRoomById(roomId);
        //TODO: remove later and return a error
        if (room === undefined) {
            room = data.rooms.addRoom(roomId, true, "name", "desc", false, true, null);
        }
        //
        res.render('pages/room', {page: "room" , strings: data.strings, room});
    });

    app.get('/', function(req, res) {
        res.render('pages/home', {page:"home", strings: data.strings});
    });

    app.get('/myRooms', checkAuth,  function(req, res) {
        res.render('pages/myRooms', {page:"room", strings: data.strings});
    });
}
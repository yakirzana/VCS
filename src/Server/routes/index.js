function checkAuth(req, res, next) {
    next();
    return;
    if (!req.session || !req.session.user_id) {
        res.send('You are not authorized to view this page');
    } else {
        next();
    }
}

module.exports = function(app, data) {
    app.post('/login', function (req, res) {
        var post = req.body;
        if (post.user === 'john' && post.password === 'johnspassword') {
            req.session.user_id = johns_user_id_here;
            res.redirect('/room/1234');
        } else {
            res.send('Bad user/pass');
        }
    });

    app.get('/logout', function (req, res) {
        delete req.session.user_id;
        res.redirect('/');
    });

    app.get('/room/:roomId*', checkAuth, function(req, res) {
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

    app.get('/myRooms', function(req, res) {
        res.render('pages/myRooms', {page:"room", strings: data.strings});
    });
}
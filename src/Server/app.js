var path = require("path");
var express = require('express');
var flash    = require('connect-flash');
var session = require('express-session');
var bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient;

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Log = require('./logs/log');
var log = new Log("Error.txt");
var DL = require('./dl');
var BL = require('./bl');
var SL = require('./sl');
var Socket = require('./sockets');
var config = require('./config/');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../Client/views'));
app.use(express.static(path.join(__dirname, '../Client/public')));
app.use(session({
    secret: 'keyboard cat', resave: true, saveUninitialized: true,
    cookie: {maxAge: 20 * 60 * 60000}
}));
app.use(flash());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

MongoClient.connect(config.urlDB, function (err, db) {
    if (err == null) {
        console.log("Connected successfully to database");
        run(db);
    }
    else {
        log.error("Error with connection to DB");
        log.error(err);
    }
});

async function run(db) {
    var dl = new DL(db);
    var bl = new BL(dl);
    var sl = new SL(bl, "heb");
    var socket = new Socket(io, sl);

    require('./routes')(app, sl, socket);


    http.listen(80, function() {
        console.log('listening on port 80');
    });

    //await bl.rooms.addRoom("1", false, "achiad-room", "This is Achiad room", true, 5, null, ["stud1", "stud2"]);
    //await bl.rooms.addRoom("2", false, "rotem-room", "This is Rotem room", true, 5, null, ["stud1"]);
    //await bl.rooms.addRoom("3", false, "hod-room", "This is Hod room", true, 5, null, ["stud2"]);
    //await bl.rooms.addRoom("4", false, "yakir-room", "This is Yakir room", true, 5, null, []);
    //await bl.rooms.addRoom("5", false, "avi-room", "This is Avi room", false, 5, null, ["stud1", "stud2"]);
    //var rooms = await sl.classes.getRoomsAccessible(1, "");
    //console.log(rooms)
    // await bl.users.addUser("stud1", "1234", "teac", "her", "Male", "teacher@gm.com", false);
    // await bl.users.addUser("stud2", "1234", "teac", "her", "Male", "teacher@gm.com", false);
    // await bl.users.addUser("teac1", "1234", "teac", "her", "Male", "teacher@gm.com", true);
    //await sl.users.deleteUser("stud1");
    //await bl.rooms.addRoom("6", false, "omer-room", "This is Omer room", true, 20, null, ["stud1", "stud2"]);
}

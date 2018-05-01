var path = require("path");
var express = require('express');
var flash    = require('connect-flash');
var session = require('express-session');
var bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient;

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Log File
var Log = require('./logs/log');
var log = new Log("Error.txt", "Info.txt");

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

MongoClient.connect(config.urlDB, async function (err, db) {
    if (err == null) {
        console.log("Connected successfully to database");
        log.info("Connected successfully to database");
        await run(db, log);
    }
    else {
        log.error("Error with connection to DB");
        log.error(err);
    }
});

async function run(db, log) {
    var dl = new DL(db, log);
    var bl = new BL(dl);
    var sl = new SL(bl, "heb");
    var socket = new Socket(io, sl, log);

    require('./routes')(app, sl, socket, log);


    http.listen(80, function() {
        console.log('listening on port 80');
        log.info("listening on port 80");
    });
}

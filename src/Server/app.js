var path = require("path");
var express = require('express');
var flash    = require('connect-flash');
var session = require('express-session');
var bodyParser = require('body-parser');

// var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Log = require('./logs/log');
var log = new Log("Error.txt");
var DL = require('./dl');
var BL = require('./bl');
var SL = require('./sl');
var configDB = require('./config/database');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../Client/views'));
app.use(express.static(path.join(__dirname, '../Client/public')));
app.use(session({
    secret: 'keyboard cat', resave: true, saveUninitialized: true,
    cookie: {maxAge: 20 * 60 * 60000}
}));
app.use(flash());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

MongoClient.connect(configDB.url, function (err, db) {
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
    var sl = new SL(bl);

    sl.alerts.addAlert("1", "NMD");

    require('./routes')(app, sl);
    require('./sockets')(io, sl);
    http.listen(80, function() {
        console.log('listening on port 80');
    });
}

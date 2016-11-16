var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');

var errorHandler = require('./middleware/generic/errorHandler');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true } ));
app.set('view engine', 'ejs');

var ip = "152.66.181.183";
var port = 3000;
var _dirname = 'D:\\Software Programing\\NodeJS\\LegoMessenger\\';

// * Serve static before session
app.use(express.static(_dirname + 'public'));


// * Session above all
app.use(session({
    secret: 'thousand master',
    cookie: {
        // maxAge: 30*60000
    },
    resave: true,
    saveUninitialized: false
}));


// * Let's create the .tpl and .error on the res object
app.use(function (req, res, next) {
    res.tpl = {};
    res.tpl.serverurl = "http://" + ip + ":" + port;
    res.tpl.error = [];

    return next();
});


// * Include all the routes
// TODO: include routes .Soul
require('./routes/chat')(app);
require('./routes/outside')(app);



// * Redirect main to /cocktails
// TODO: change default redirect destination .Soul
// app.use('/', function (req, res, next) {
//     return res.redirect('/cocktails');
// });


// * Standard error handler
app.use(errorHandler());


// * Start server
var server = app.listen(port, function(){
    console.log("Listening on " + port + " port ");
});
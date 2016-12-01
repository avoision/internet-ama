// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan 				= require('morgan')

var bodyParser 		= require('body-parser')
var session 			= require('express-session')
var MongoStore    = require('connect-mongo')(session);

// configuration ===============================================================
mongoose.connect(process.env.MONGO_URL); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

app.use(morgan('dev'))

app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs'); // set up ejs for templating

app.use(session({ 
  secret: 'thearemoreworlds',
  resave: false,
  saveUninitialized: false,
  maxAge: Date.now() + (60 * 60 * 1000),  
  store: new MongoStore({ 
    mongooseConnection: mongoose.connection,
    ttl: 60 * 60 // 
  })
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session



// routes ======================================================================
require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

require('./utilities/twitter.js')(app, passport)

app.use(express.static(__dirname + '/../build'));



// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

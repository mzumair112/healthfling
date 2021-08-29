var express = require('express');
var path = require('path');
const rendertron = require('rendertron-middleware');

var nodemailer = require('nodemailer');

var app = express();

// API ROUTES -------------------

// get an instance of the router for api routes
var apiRoutes = express.Router();

var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
mongoose.Promise = global.Promise
var CryptoJS = require("crypto-js");

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./api/models/user'); // get our mongoose model

var port = process.env.PORT || 8000;
mongoose.connect(config.database, { useMongoClient: true }); // connect to database
app.set('superSecret', config.secret); // secret variable

const BOTS = rendertron.botUserAgents.concat('googlebot',
	'Slack-ImgProxy',
	'Slackbot-LinkExpanding',
	'Viber');
const BOT_UA_PATTERN = new RegExp(BOTS.join('|'), 'i');

// Render middleware for crawler bots
app.use(rendertron.makeMiddleware({
  proxyUrl: 'http://68.66.207.52:3000/render',
	userAgentPattern: BOT_UA_PATTERN
}));

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false, limit:'5mb' }));
app.use(bodyParser.json({limit:'5mb'}));

// use morgan to log requests to the console
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'files')));
 
app.use(function (req, res, next) {
	User.findOne({
		tempAccessToken: req.headers['authorization']
	}, (err, user) => {
		if (err) {
			return next(err);
		}
		req.user = user;
		return next();
	}).lean();
})

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {
	// find the user
	User.findOne({
	  name: req.body.name
	}, function(err, user) {

	  if (err) throw err;

	  if (!user) {
	    res.json({ success: false, message: 'Authentication failed. User not found.' });
	  } else if (user) {

	  	var bytes  = CryptoJS.AES.decrypt(user.password, config.key);
		var password = bytes.toString(CryptoJS.enc.Utf8);

	    // check if password matches
	    if (password != req.body.password) {
	      res.json({ success: false, message: 'Authentication failed. Wrong password.' });
	    } else {

	      // if user is found and password is right
	      // create a token with only our given payload
	  // we don't want to pass in the entire user since that has the password
	  const payload = {
	    admin: user.admin
	  };
	      var token = jwt.sign(payload, app.get('superSecret'));

	      // return the information including token as JSON
	      res.json({
	        success: true,
	        message: 'Enjoy your token!',
	        token: token
	      });
	    }

	  }

	});
});

var routes = require('./api/routes/galleryRoutes'); //importing route
routes(apiRoutes);

var userRoutes = require('./api/routes/userRoutes'); //importing route
userRoutes(apiRoutes);

var postRoutes = require('./api/routes/postRoutes'); //importing route
postRoutes(apiRoutes);

var mailRoutes = require('./api/routes/mailRoutes'); //importing route
mailRoutes(apiRoutes);

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

app.use('/*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// // application -------------------------------------------------------------
// app.get('*', function (req, res) {
//     res.sendFile(__dirname + '/public/404.html'); // load the single view file (angular will handle the page changes on the front-end)
// });

app.listen(port);

console.log('Healthy Fling server started on: ' + port);

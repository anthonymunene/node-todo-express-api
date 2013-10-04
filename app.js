
/**
 * Module dependencies.
 */
"use strict";
var express = require('express'),
  routes = require('./routes'),
  user = require('./routes/user'),
  http = require('http'),
  path = require('path'),
  MongoClient = require('mongodb').MongoClient;
  // mongoose.connect()
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/templates');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('fast delivery site'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
	app.use(express.errorHandler());
}
app.get('/', routes.index);
app.get('/users', user.list);

MongoClient.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port + '/fastdelivery', function (err , db) {
	if(err) {
		console.log('Sorry there is no monog db srver running')
	} else {
		var attachDB = function (req, res, next) {
			req.db = db;
			next();
		}
	}

	http.createServer(app).listen(config.port, function () {
		console.log('Express server listening on port ' + config.port;
	});
});
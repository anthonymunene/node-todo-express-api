var express = require('express');
var	routes = require('./routes');
var	tasks = require('./routes/tasks');
var	hbs = require('express-hbs');
var	http = require('http');
var	path = require('path');
var	mongoskin = require('mongoskin');


//make the database connection
var db = mongoskin.db('mongodb://localhost:27017/todo?auto_reconnect', {safe: true});
var app = express();
/*
 * we export the database object to all middlewares.
 * by doing so we will be able to perform database operations in the routes module
*/
app.use(function (req, res, next) {
	req.db = {};
	req.db.tasks = db.collection('tasks');
	next();
});
app.locals.appname = 'Express.js Todo App';
// Set global __basedir to the directory of the application entry-point file
global.__basedir = path.resolve(__dirname, '../');

// app.engine('html', consolidate.handlebars);
// app.set('views', __basedir +'/views');
// app.set('view engine', 'html');

app.engine('hbs', hbs.express3({
	partialsDir: __basedir + '/views/partials',
	defaultLayout: __basedir + '/views/layout/default.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', __basedir + '/views');



//setup static folder with middleware

app.use(express.favicon());

//print requests in the terminal window
app.use(express.logger('dev'));

//painlessly access incoming data
app.use(express.urlencoded()); // Replace for depricated connect.bodyParser()
app.use(express.json()); // Replace for depricated connect.bodyParser()

//middleware workaround for HTTP methods that involves headers
app.use(express.methodOverride());

app.use(express.cookieParser());
app.use(express.session({
	secret: '59B93087-78BC-4EB9-99A-A61FC844F6C9'
}));
app.use(express.csrf());

app.use(express.static(__basedir + '/public'));
//expose CRSF to templates
app.use(function (req, res, next) {
	res.locals.csrf = req.csrfToken();
	console.info(res.locals.csrf);
	return next();
});


//enable router plugin
app.use(app.router);


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//execute this whenever a request matches route/RegExp with :task_id in it
app.param('task_id', function (req, res, next, taskId) {
	req.db.tasks.findById(taskId, function (error, task) {
		if (error) return next(error);
		if(!task) return next(new Error('Task is not found'));

		//if found, store in the request and proceed to next middleware
		req.task = task;
		return next();
	});

});

//define our routes

app.get('/', routes.index);
app.get('/tasks', tasks.list);
app.post('/tasks', tasks.markAllCompleted);
app.post('/tasks', tasks.add);
app.post('/tasks/:task_id', tasks.markCompleted);
app.del('/tasks/:task_id', tasks.del);
app.get('tasks/completed', tasks.completed);
//handle mistyped urls

app.all('*', function (req, res) {
  res.send(404);
});
/*http.createServer(app).listen(3000, function(){
  console.log('Express server listening on port ' + 3000);
});*/
module.exports = app;
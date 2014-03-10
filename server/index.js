var express = require('express');
var mongoskin = require('mongoskin');

//make the database connection
var db = mongoskin.db('mongodb://localhost:27017/rest-api-test', {safe: true});
var app = express();

//print requests in the terminal window
app.use(express.logger('dev'));

//painlessly access incoming data
app.use(express.urlencoded()); // Replace for depricated connect.bodyParser()
app.use(express.json()); // Replace for depricated connect.bodyParser()



app.param("collectionName", function (req, res, next, collectionName) {
	req.collection = db.collection(collectionName);
	return next();
});

app.get("/", function (req, res) {
	res.send("Please select a collection, e.g collections/messages");
});
app.get("/collections/:collectionName", function (req, res, next) {
	req.collection.find({}, {
		limit: 10,
		sort: [["_id", -1]]
	}).toArray(function (e, results) {
		if (e) {
			return next(e);
		}
		console.log("results are", results);
		res.send(results);
	});
});
app.post("/collections/:collectionName", function (req, res, next) {
	req.collection.insert(req.body, {},
		function (e, results) {
			if (e) {
				return next(e);
			}
			res.send(results);
		}

	);
});
app.get("/collections/:collectionName/:id", function (req, res, next) {
	console.log("using get...id equals ");
	req.collection.findById(
		req.params.id,
		function (e, result) {
			if (e) {
				return next(e);
			}
			res.send(result);
		}

	);
});
app.put("/collections/:collectionName/:id", function (req, res, next) {
	req.collection.updateById(
		req.params.id,
		{ $set: req.body }, {safe: true, multi: false},
		function (e, result) {
			if (e) {
				return next(e);
			}
			res.send((result === 1) ? {msg: "success"} : {msg: "error"});
		}

	);
});
app.del("/collections/:collectionName/:id", function (req, res, next) {
	req.collection.removeById(
		req.params.id,
		function (e, results) {
			if (e) {
				return next(e);
			}
			res.send((results === 1) ? {msg: "success"} : {msg: "error"});
		}

	);
});



module.exports = app;

var Q = require('q');


var mongo = require('./mongo.js')(Q);

mongo.then(function(db){
	
	var tasks = require('./todo.js')(db);
	
	var express = require('express');
	var fs = require('fs');

	var app = express();
	
	var session = require('express-session');

	var bodyParser = require('body-parser');
		
	app.use( bodyParser.json() );       
	
	app.use(bodyParser.urlencoded({     
		extended: true
	})); 

	app.use(express.static('public'));
	
	app.use(session({
		  secret: 'secretKey54f452',
		  resave: false,
		  saveUninitialized: true		  
	}));
	
	var isLogged = function(req,res,next){
		if(req.session.user=="bpk") {
			next();
		} else {
			res.status(403);
			res.json({errors:["Login required"]});
		}
	};
	
	app.get('/tasks/:id?', function (req, res) {
		tasks.getTasks(req.params.id,function(tasks){
			//console.info(req.session.user);
			res.json(tasks);
		});
	});
	
	app.get('/movie',isLogged,function(req,res){
		var file = "movie.mp4";
		var range = req.headers.range;
		var positions = range.replace(/bytes=/, "").split("-");
		var start = parseInt(positions[0], 10);
		
		fs.stat(file, function(err, stats) {
		  var total = stats.size;
		  var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
		  var chunksize = (end - start) + 1;

		  res.writeHead(206, {
			"Content-Range": "bytes " + start + "-" + end + "/" + total,
			"Accept-Ranges": "bytes",
			"Content-Length": chunksize,
			"Content-Type": "video/mp4"
		  });

		  var stream = fs.createReadStream(file, { start: start, end: end })
			.on("open", function() {
			  stream.pipe(res);
			}).on("error", function(err) {
			  res.end(err);
			});
		});
		
	});
	
	app.post('/login', function (req, res) {
		//console.info(req.body);
		if(req.body.passwd=='123456') {
			req.session.user = 'bpk';
			res.json({});
		} else {
			res.status(500);
			res.json({errors:["Invalid credentials"]});
		}
	});
	
	app.listen(80, function () {

	  console.log('Server started');

	});
	
});



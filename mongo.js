
module.exports = function(Q) {	
	var mongo = require('mongodb');
	var MongoClient = mongo.MongoClient;
	var Server = mongo.Server;
	var mongoClient = new MongoClient(new Server('127.0.0.1', 27017));
	var db = mongoClient.db("newdb");
	var ObjectID = mongo.ObjectID;	
	
	var dbRet = {};
	dbRet.oid = ObjectID;
	
	var def = Q.defer();
	db.open(function(){
		
		db.collection('tasks',{strict:true}, function(err, collection) {			
			//console.info(collection);
			dbRet.tasks = collection;
			def.resolve(dbRet);
		});
	});	
	
	return def.promise;
};
	


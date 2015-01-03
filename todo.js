
module.exports = function(db) {
	 
	// console.info(db.tasks);
	 
	 return {
				getTasks: function(id,callback) {
					console.info(id);
					var settings = {};
					if(id) {
						settings._id = new db.oid(id);
					}
					db.tasks.find(settings).toArray(function(err, items) {
						//callback([{x:9},{y:8}]);
						callback(items);
					});
				}
			}
}
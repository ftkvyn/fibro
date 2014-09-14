exports.search = function (res, rawPattern, criteria, allowedCriterias, entity, tableName) {
	if(allowedCriterias.indexOf(criteria) === -1){
		console.log('Creieria = ' + criteria);
		return res.badRequest('Error searching users.');
	}
	var values = rawPattern
		.split(',')
		.map(function(str){
		return str.trim().replace("'","\\'");
	});
	var query = "";
	if(values[0]){
		query = "SELECT * FROM " + tableName + " WHERE " + criteria + " LIKE '%" + values[0] + "%'";
	}

	for (var i = values.length - 1; i >= 1; i--) {
		query = query + " AND " + criteria + " LIKE '%" + values[i] + "%'";
	};
	entity.query(query, function(err, itemsRaw) {
	 	if(err){
			console.log(err);
			return res.badRequest('Error searching ' + tableName + "s.");
		}

	  	var items = _.map(itemsRaw, function(item) {
	    	return new entity._model(item);
	  	});

	  	return res.send({items : items, pattern: rawPattern});	
	});
}
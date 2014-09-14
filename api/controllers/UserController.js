module.exports = {
	update: function (req, res) {
		if(+req.param('id') !== req.session.user.id){
			return res.send(403);
		}
		User.findOne(req.param('id'))
		.exec(function(err, user){
			if(err || (!user)){
				return res.badRequest('User not found.');
			}
			user.name = req.body.name;
			user.skills = req.body.skills;
			user.location = req.body.location;
			user.about = req.body.about;
			if(user.birthDate){
				user.birthDate = new Date(req.body.birthDate);
			}
			user.save(function(err, user){
				return res.send(user);	
			});			
		});		
	},

	uploadImage: function(req, res){
		console.log(req.files.userPhoto);
	},

	search: function(req,res){
		return searchService.search(res, 
			req.body.pattern, 
			req.body.criteria, 
			["skills", "name", "about", "location"], 
			User,
			"user");

		var request = { where :{}};
		var rawPattern = req.body.pattern;
		switch(req.body.criteria){
			case "skills":
			case "name":
			case "location":
			case "about":
				break;
			default:{
				console.log('Creieria = ' + req.body.criteria);
				return res.badRequest('Error searching users.');
			}
		}
		var values = rawPattern
					.split(',')
					.map(function(str){
						return str.trim().replace("'","\\'");
					});
		var query = "";
		if(values[0]){
			query = "SELECT * FROM user WHERE " + req.body.criteria + " LIKE '%" + values[0] + "%'";
		}

		for (var i = values.length - 1; i >= 1; i--) {
			query = query + " AND " + req.body.criteria + " LIKE '%" + values[i] + "%'";
		};
		User.query(query, function(err, usersRaw) {
		 	if(err){
				console.log(err);
				return res.badRequest('Error searching users.');
			}

		  	var users = _.map(usersRaw, function(user) {
		    	return new User._model(user);
		  	});

		  	return res.send({items : users, pattern: rawPattern});	
		});
	}
};


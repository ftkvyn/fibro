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

	search: function(req,res){
		var request = { where :{}};
		var rawPattern = req.body.pattern;
		var values = rawPattern
					.split(',')
					.map(function(str){
						return str.trim();
					});
		var query = User.find();
		if(values[0]){
			switch (req.body.criteria) {
			  case "skills":
			  	query = query.where({or:[{'skills' : {'contains': values[0] }}]});
			    break;
			  default:
			  	console.log(req.body.criteia);
			    return res.badRequest('Invalid search criteia.');
			}
		}

		if(values[1]){
			switch (req.body.criteria) {
			  case "skills":
			  	// query = User.find({'skills' : [{'contains': values[0] }, {'contains': values[1] }]});
			  	// query = User.find({'skills' : {'contains': values[0] },
			  	// 				   'skills' : {'contains': values[1] }});
				query = User.find()
						.where({'skills' : {'contains': values[0] }})
						.where({'skills' : {'contains': values[1] }});
			    break;
			  default:
			  	console.log(req.body.criteia);
			    return res.badRequest('Invalid search criteia.');
			}	
		}

		query
		.skip(req.body.skip)
		.exec(function(err, users){
			if(err){
				console.log(err);
				return res.badRequest('Error searching users.');
			}
			
			return res.send({items : users, pattern: rawPattern});	
		});	
	}

	// search: function(req,res){
	// 	var request = { or : []};
	// 	var rawPattern = req.body.pattern;
	// 	var values = rawPattern
	// 				.split(',')
	// 				.map(function(str){
	// 					return str.trim();
	// 				});
	// 	for (var i = values.length - 1; i >= 0; i--) {
	// 		if(values[i]){
	// 			switch (req.body.criteria) {
	// 			  case "skills":
	// 			  	request.or.push({skills : {'contains' : values[i]}});
	// 			    break;
	// 			  case "name":
	// 			  	request.or.push({name : {'contains' : values[i]}});
	// 			    break;
	// 			  case "about":
	// 			    request.or.push({about : {'contains' : values[i]}});
	// 			    break;
	// 			  case "location":
	// 			    request.or.push({location : {'contains' : values[i]}});
	// 			    break;
	// 			  default:
	// 			  	console.log(req.body.criteia);
	// 			    return res.badRequest('Invalid search criteia.');
	// 			}
	// 		}
	// 	};

	// 	User.find(request)
	// 	.skip(req.body.skip)
	// 	.exec(function(err, users){
	// 		if(err){
	// 			return res.badRequest('Error searching users.');
	// 		}
			
	// 		return res.send({items : users, pattern: rawPattern});	
	// 	});	
	// }
};


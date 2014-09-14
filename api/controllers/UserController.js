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
			req.body.criteria.replace('about', 'about_plainText'), 
			["skills", "name", "about_plainText", "location"], 
			User,
			"user");
	}
};


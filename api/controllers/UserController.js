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
			user.about = req.body.about;
			user.birthDate = new Date(req.body.birthDate);
			user.save(function(err, user){
				return res.send(user);	
			});			
		});		
	}
};


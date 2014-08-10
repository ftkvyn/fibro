module.exports = {
	profile : function(req,res){
		User.findOne(req.param('id'))
		.exec(function(err, user){
			if(err || (!user)){
				return res.badRequest('User not found.');
			}
			var isMe = false;
			if(req.session && req.session.user){ 
				isMe = user.id == req.session.user.id;
			}
			return res.view('profile', 
			{
		      user: user,
		      isMe: isMe,	      
		    });
		});

		
	}
};
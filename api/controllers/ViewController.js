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
			return res.view('user/profile', 
			{
		      user: user,
		      isMe: isMe,	      
		    });
		});		
	},

	newProject : function(req, res){
		if(req.session && req.session.user){ 
			return res.view('project/new');
		}else{
			return res.view('/', {message: 'Please, login.'});
		}
		
	}
};
module.exports = {
	profile : function(req,res){
		User.findOne(req.param('id'))
		.populate('projects')
		.populate('createdProjects')		
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
		
	},

	project : function(req,res){
		Project.findOne(req.param('id'))
		.populate('author')
		.populate('members')
		.exec(function(err, project){
			if(err || (!project)){
				return res.badRequest('Project not found.');
			}
			var isAuthor = false;
			if(req.session && req.session.user){ 
				isAuthor = project.author.id == req.session.user.id;
			}
			return res.view('project/view', 
			{
		      project: project,
		      isAuthor: isAuthor,
		      isMember: false,
		      isInvited: false,
		      isRequestingMembership: false	      
		    });
		});		
	},
};
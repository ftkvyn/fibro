var Q = require('q');

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
		var projectId = req.param('id');
		var proj_q = Project.findOne(projectId)
		.populate('author')
		.populate('members');

		var userId = 0;
		if(req.session && req.session.user){
			userId = req.session.user.id;
		}
		var request_q = MembershipRequest.findOne(
			{user: userId, project: projectId, isDeclined: false});

		var invite_q = Invitation.findOne(
			{user: userId, project: projectId, isDeclined: false})			
		.populate('inviter');

		Q.all([proj_q, request_q, invite_q]).then(function(data){
			var project = data[0];
			var request = data[1];
			var invitation = data[2];

			var isAuthor = false;
			var isMember = false;
			var isRequesting = false;
			if(req.session && req.session.user){ 
				isAuthor = project.author.id == req.session.user.id;
				for (var i = project.members.length - 1; i >= 0; i--) {
					 if(project.members[i].id ===  req.session.user.id){
					 	isMember = true;
					 	break;
					 }
				};
				if(request){
					isRequesting = true;
				}
			}			
			return res.view('project/view', 
			{
		      project: project,
		      invitation: invitation,
		      isAuthor: isAuthor,
		      isMember: isMember,
		      isRequestingMembership: isRequesting	      
		    });
		}, 
		function(err){
			return res.serverError('Error loading project.');
		});
	},
};
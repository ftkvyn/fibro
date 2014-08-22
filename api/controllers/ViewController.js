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

	editProfile: function(req, res){
		if(+req.param('id') !== req.session.user.id){
			return res.send(403);
		}
		return res.view('user/edit', {userId : req.param('id')});
	},

	newProject : function(req, res){
		if(req.session && req.session.user){ 
			return res.view('project/edit',{isNew : true, projectId : undefined});
		}else{
			return res.view('/', {message: 'Please, login.'});
		}
		
	},

	editProject : function(req, res){
		var projectId = req.param('id');
		Project.findOne(projectId)
		.exec(function(err, project){
			if(project.author != req.session.user.id){
				return res.send(403);
			}
			return res.view('project/edit',{isNew : false, projectId : project.id});
		})
		
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

	chats : function(req, res){

		return res.view('messages/chatList');
	},

	chat: function(req, res){

		var sendResponce = function(name){
			return res.view('messages/chat',
			{
				type: req.param('type'),
				id: req.param('id'),
				name: name
			});
		}

		var id = req.param('id');
		var type = req.param('type');
		var obj;
		if(type == 'project'){
			obj = Project;
		} else if(type == 'user'){
			obj = User;
		} else{
			console.log('Type = ' + type);			
			return res.badRequest('Fuck you, thats why.');
		}		

		obj.findOne(id)
			.exec(function(err, item){
				sendResponce(item.name);
		});
	},

	searchUser: function(req, res){

		return res.view('search/users');
	}
};











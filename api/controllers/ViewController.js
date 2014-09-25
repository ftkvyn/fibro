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
			user.projects = arrayService.distinct(user.projects, user.createdProjects);
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
		.populate('members')
		.populate('posts', {sort: 'createdAt DESC'});

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

	projectPosts : function(req, res){
		var projectId = req.param('id');
		var proj_q = Project.findOne(projectId)
		.populate('members');		

		var posts_q = Post.find({sort: 'createdAt DESC', where: {project:projectId}})
		.populate('author');
		Q.all([proj_q, posts_q]).then(function(data){
			var project = data[0];
			project.posts = data[1];
			var isAuthor = false;
			var isMember = false;
			var isRequesting = false;
			if(req.session && req.session.user){ 
				isAuthor = project.author == req.session.user.id;
				for (var i = project.members.length - 1; i >= 0; i--) {
					 if(project.members[i].id ===  req.session.user.id){
					 	isMember = true;
					 	break;
					 }
				};
			}
			return res.view('project/posts', 
			{
		      project: project,
		      isAuthor: isAuthor,
		      isMember: isMember,
		    });
		});
	},

	recentPosts : function(req,res){

		return res.view('post/recent');
	},

	chats : function(req, res){
		// Project
		// .find()
		// .exec(function(err, projects){
		// 	var saves = [];

		// 	for (var i = projects.length - 1; i >= 0; i--) {
		// 		projects[i].description = "<strong>Lorem Ipsum</strong> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
		// 		projects[i].description_plainText = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
		// 		projects[i].privateInformation = "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).";
		// 		saves.push(projects[i].save());
		// 		Q.all(saves).then(function(){
							
		// 		});
		// 	};			
		// });		

		// User.find()
		// .exec(function(err, users){
		// 	for (var i = users.length - 1; i >= 0; i--) {
		// 		users[i].profilePic = 'http://graph.facebook.com/' + users[i].fb_id + '/picture';
		// 		users[i].profilePicLarge 
		// 			= 'http://graph.facebook.com/' + users[i].fb_id + '/picture?type=large';				
		// 		users[i].save(function(){});
		// 	};
		// });
		res.view('messages/chatList');
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

		var viewBag = {
			fellows: []
		};

		var sendResult = function(){
			res.view('search/users', viewBag);
		}

		if(req.session.user){
			User.findOne(req.session.user.id)
			.populate('projects')
			.exec(function(err, user){
				var ids = user.projects.map(function(p){return p.id});
				Project.find({id: ids})
				.populate('members')
				.exec(function(err, projects){
					if(err){					
						return sendResult();
					}
					viewBag.fellows = [];
					for (var i = projects.length - 1; i >= 0; i--) {
						for (var j = projects[i].members.length - 1; j >= 0; j--) {
							if(!arrayService.contains(viewBag.fellows, projects[i].members[j])){
								viewBag.fellows.push(projects[i].members[j]);
							} 
						};
					};
					sendResult();
				});
			});
					
		}else{
			sendResult();
		}		
	},

	searchProject: function(req, res){
		//createdProjects
		//projects
		var viewBag = {
			createdProjects: [],
			projects: []
		};

		var sendResult = function(){
			res.view('search/projects', viewBag);
		}

		if(req.session.user){
			User.findOne(req.session.user.id)
			.populate('projects')
			.populate('createdProjects')		
			.exec(function(err, user){
				if(err || (!user)){
					return res.badRequest('User not found.');
				}
				var projects = [];
				for (var i = user.projects.length - 1; i >= 0; i--) {
					if (user.createdProjects.indexOf(user.projects[i]) == -1){
						projects.push(user.projects[i]);
					}
				};
				viewBag.projects = arrayService.distinct(user.projects, user.createdProjects);
				viewBag.createdProjects = user.createdProjects;
				sendResult();
			});		
		}else{
			sendResult();
		}

		
	},

	newPost : function(req, res){
		var projectId = req.param('projectId');
		if(req.session && req.session.user){ 
			return res.view('post/edit',{isNew : true, projectId : projectId, postId: undefined});
		}else{
			return res.view('/', {message: 'Please, login.'});
		}
		
	},

	editPost : function(req, res){
		var postId = req.param('id');
		Post.findOne(postId)
		.exec(function(err, post){
			if(post.author != req.session.user.id){
				return res.send(403);
			}
			return res.view('post/edit',{isNew : false, projectId : post.project, postId: post.id});
		})
		
	},

	post : function(req,res){
		var postId = req.param('id');
		Post.findOne(postId)
			.populate('author')
			.populate('project')
			.populate('comments', {sort: 'createdAt ASC'})
			.exec(function(err, post){
				// Should be removed when deep populate will work.
				var users = [];
				for(var i = 0; i < post.comments.length; i++){
					if(users.indexOf(post.comments[i].author) < 0){
						users.push(post.comments[i].author);
					}					
				}
				User.find({id: users})
				.exec(function(err, users){
					var usersMap = [];
					for(var i = 0; i < users.length; i++){
						usersMap[users[i].id] = users[i];
					}						
					for(var i = 0; i < post.comments.length; i++){
						post.comments[i].author = usersMap[post.comments[i].author];
					}					
					var isAuthor = post.author.id === req.session.user.id;
					return res.view('post/view',{post: post, isAuthor: isAuthor});
				});				
			});
	},
};











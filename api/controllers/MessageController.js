/**
 * MessageController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

 var Q = require('q');

module.exports = {

	find: function(req, res){
		var loadMessages = function(query){
			Message.find(query).exec(function(err,messages){
				if(err){
					console.log(err);
					return res.badRequest('Unable load messages.');
				}
				return res.send(messages);
			});
		}

		var userId = req.session.user.id;
		var type = req.param('type');
		var id = req.param('id');
		var query = { 		 
			sort: 'createdAt DESC' 
		};
		if(type === 'user'){
			query.where = { 
				or : [
					{from: userId, toUser: id},
					{toUser: userId, from: id}
				] 
			};
			loadMessages(query);
		} else if(type === 'project'){
			query.where = { 
					toProject: id
			};
			//ToDo: move to services;
			Project.findOne(id)
			.populate('members')
			.exec(function(err, project){
				if(err){
					console.log(err);
					return res.badRequest('Unable load messages.');
				}
				var isMember = false;
				for (var i = project.members.length - 1; i >= 0; i--) {
					if(project.members[i].id == userId){
						isMember = true;
						loadMessages(query);
					}
				};
				if(!isMember){
					console.log('Not a member. User ' + userId + ', project ' + id);
					return res.badRequest('Unable load messages.');	
				}
			});
		} else{
			//Wrong type argument
			console.log('Type ' + type);
			return res.badRequest('Unable load messages.');
		}		
	},

	create: function(req, res){
		var createMessage = function(){
			Message.create(req.body)
			.exec(function(err, message){
				if(err){
					console.log(err);
					return res.badRequest('Unable create message.');
				}
				return res.send(message);
			});
		};

		req.body.from = req.session.user.id;

		if(req.body.toProject){
			var id = req.body.toProject;
			var userId = req.body.from;
			//ToDo: move to services
			Project.findOne(id)
			.populate('members')
			.exec(function(err, project){
				if(err){
					console.log(err);
					return res.badRequest('Unable create message.');
				}
				var isMember = false;
				for (var i = project.members.length - 1; i >= 0; i--) {
					if(project.members[i].id == userId){
						isMember = true;
						createMessage();
					}
				};
				if(!isMember){
					console.log('Not a member. User ' + userId + ', project ' + id);
					return res.badRequest('Unable create message.');	
				}
			});
		}else{
			createMessage();
		}
	},

	chats: function(req, res){

		var chats = [];

		//ToDo: don't load all users;
		users_q = User.find();
		var userId = req.session.user.id;
		currentUser_q = User.findOne(userId)
				.populate('projects');

		Q.all([users_q, currentUser_q]).then(function(data){
			var users = data[0];
			var projects = data[1].projects;

			for (var i = users.length - 1; i >= 0; i--) {
				if(users[i].id === userId){
					continue;
				}
				chats.push(
					{
						target: {
							name: users[i].name,
							id: users[i].id,
							fb_id: users[i].fb_id,
							//ToDo: set image
						}, 
						type: 'user'
					});
			};
			for (var i = projects.length - 1; i >= 0; i--) {
				chats.push(
					{
						target: {
							name: projects[i].name,
							id: projects[i].id
							//ToDo: set image
						}, 
						type: 'project'
					});
			};
			
			//ToDo: load last message for each chat;
			return res.send(chats);

		},
		function(err){
			console.log(err);
			return res.serverError('Unable load chats list.');
		});
	},
};


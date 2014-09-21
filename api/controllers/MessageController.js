/**
 * MessageController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Q = require('q');

module.exports = {

	subscribe: function(req, res){
		var type = req.param('type');
		var id = req.param('id');
		var socket = req.socket;

		if(type === 'project'){		
			Project.findOne(id)
					.populate('members')
					.exec(function(err, project){
						for (var i = project.members.length - 1; i >= 0; i--) {
							if(project.members[i].id === req.session.user.id){
								socket.join('project_' + id);
								return res.send(200);													
							}
						};
						return res.send(403);
					});
			
		} else if(type === 'user'){
			socket.join('user_' + req.session.user.id);
		}

		return res.send(200);
	},

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

		var loadMembershipStartDate = function(query, userId, projectId){
			Chat.findOne({
				owner: userId,
				targetProject: projectId
			}).exec(function (err, chat){
				if(chat){
					query.where.createdAt = {'>=': chat.createdAt};
					loadMessages(query);
				}else
				{
					return res.badRequest('Unable load messages.');
				}
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
						loadMembershipStartDate(query, userId, project.id);
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
		var projectMembers;

		var createMessage = function(){
			Message.create(req.body)
			.exec(function(err, message){
				if(err){
					console.log(err);
					return res.badRequest('Unable create message.');
				}
				broadcastMessage(message);	

				chatService.processNewMessage(message);
			});
		};

		var broadcastMessage = function(message){
		    var io = sails.io;
		    
		    if(message.toProject){		
		    	io.sockets.in('project_' + message.toProject).emit('message', message);
			} else if(message.toUser){
				io.sockets.in('user_' + message.toUser).emit('message', message);
			}
			return res.send(message);
		}

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
				projectMembers = project.members;
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
};


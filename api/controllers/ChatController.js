/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	find : function (req, res) {
		var skip = +req.param('skip') || 0;
		var count = +req.param('count') || 10;
		var userId = req.session.user.id;
		Chat.find(
			{
				where: {
					owner: userId
				},
				sort: 'updatedAt DESC', 
				limit: count, 
				skip: skip
			})
		.populate('lastMessage')
		.populate('targetUser')
		.populate('targetProject')
		.exec(function(err, chats){
			if(err){
				console.log(err);
				return res.badRequest('Unable load chats');
			}
			res.send(chats);
		});
	},

	markAsRead : function(req,res){
		var userId = req.session.user.id;
		var type = req.param('type');
		var id = req.param('id');

		var query = {where: {}};

		if(type === 'project'){
			query.where.targetProject = id;
			query.where.owner = userId;
		}
		else if(type === 'user'){
			query.where.targetUser = id;
			query.where.owner = userId;
		}
		else {
			console.log('Type = ' + type);
			return res.badRequest('Bad type');
		}

		Chat.findOne(query).exec(function(err, chat){
			if(err){
				console.log(err);
				return res.badRequest('Unable load chat');
			}
			chat.unreadMessages = 0;
			chat.save(function(err){
				if(err){
					console.log(err);
				}
				res.send(200);

				notificationsService.updateUnreadChats(req.session.user.id);
			});

		});
	},

	getChatUsers: function(req, res){
		var type = req.param('type');
		var id = req.param('id');
		if(type === 'user'){
			User.find({id : [id, req.session.user.id]})
			.exec(function(err, users){
				return res.send(users);
			});
		} else if(type === 'project'){
			Project.findOne(id)
			.populate('members')
			.exec(function(err, project){
				var users = project.members;
				return res.send(users);
			})
		} else{
			//Wrong type argument
			console.log('Type ' + type);
			return res.badRequest('Unable load users.');
		}

	}
};


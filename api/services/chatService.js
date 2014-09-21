var Q = require('q');

		    
var clb = function(err){
	if(err){
		console.log(err);
	}
}

exports.processNewMessage = function (message){
	var cb = clb;
	var createOrUpdateUserChats = function(err, chats){
		if(err){
			console.log(err);		
			return;
		}
		if(chats.length == 1){
			console.log('Only one chat for users pair');
			console.log(message);
			return;
		}
		if(chats.length > 2){
			console.log('More than two chats for users pair');
			console.log(message);
			return;
		}
		if(chats.length == 0){
			createMessageChats();
			return;
		}
		var saves = [];
		for (var i = chats.length - 1; i >= 0; i--) {
			chats[i].lastMessage = message.id;
			if(chats[i].owner != message.from){
				chats[i].unreadMessages++;
			}

			saves.push(chats[i].save());
		};		
		Q.all(saves).then(cb);
	}

	var createMessageChats = function(){
		Q.all([
		Chat.create({
			owner: message.from,
			targetUser: message.toUser,
			unreadMessages: 0,
			lastMessage: message.id
		}),
		Chat.create({
			owner: message.toUser,
			targetUser: message.from,
			unreadMessages: 1,
			lastMessage: message.id
		})]).then(cb);
	}

	var processProjectChats = function(cb){
		Chat.find({targetProject : message.toProject})
		.exec(function(err, chats){
			if(err){
				console.log(err);	
				return;
			}
			var saves = [];
			var members = [];
			for (var i = chats.length - 1; i >= 0; i--) {
				chats[i].lastMessage = message.id;
				if(message.from !== chats[i].owner){
					chats[i].unreadMessages++;
				}
				saves.push(chats[i].save());
				members.push(chats[i].owner);
			};
			Q.all(saves).done(function(){
				for (var i = members.length - 1; i >= 0; i--) {
					notificationsService.updateUnreadChats(members[i]);
				};
			});
		});
	}

	var processUsersChats = function(){
		Chat.find({or:
			[
				{owner: message.from, targetUser: message.toUser},
				{owner: message.toUser, targetUser: message.from}
			]})
		.exec(createOrUpdateUserChats);
	}


	if(message.toProject){
		processProjectChats();		
		return;
	}
	if(message.toUser){
		cb = function(){
			notificationsService.updateUnreadChats(message.toUser);
		}
		processUsersChats();
		
		return;
	}

	// notificationsService.updateUnreadChats(message.from);
}

exports.addUserToProjectChat = function(userId, projectId){
	Chat.create({
		owner: userId,
		targetProject: projectId
	}).exec(function(){
		notificationsService.updateUnreadChats(userId);	
	});
	
}

exports.removeUserFromProjectChat = function(userId, projectId){
	Chat.destroy({
		owner: userId,
		targetProject: projectId
	}).exec(function(){
		notificationsService.updateUnreadChats(userId);	
	});
}
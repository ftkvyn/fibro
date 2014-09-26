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
		var date = new Date();
		for (var i = chats.length - 1; i >= 0; i--) {
			chats[i].lastMessage = message.id;
			if(chats[i].owner != message.from){
				chats[i].unreadMessages++;
				chats[i].updatedAt = date;
			}

			saves.push(chats[i].save());
		};		
		Q.all(saves).then(cb);
	}

	var createMessageChats = function(){
		var date = new Date();
		Q.all([
		Chat.create({
			owner: message.from,
			targetUser: message.toUser,
			unreadMessages: 0,
			updatedAt: date,
			lastMessage: message.id
		}),
		Chat.create({
			owner: message.toUser,
			targetUser: message.from,
			unreadMessages: 1,
			updatedAt: date,
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
			var date = new Date();
			var saves = [];
			var members = [];
			for (var i = chats.length - 1; i >= 0; i--) {
				chats[i].lastMessage = message.id;
				chats[i].updatedAt = date;
				if(message.from !== chats[i].owner){
					chats[i].unreadMessages++;					
				}
				// saves.push(chats[i].save());
				chats[i].save(function(err, chat){
					if(err){
						console.log(err);
					}
				});
				members.push(chats[i].owner);
			};
			
			//	For some reason working bad.
			//	Owners last message wasn't updated.			
			// Q.all(saves).done(function(data){
				
				// for (var i = data.length - 1; i >= 0; i--) {
					// console.log(data[i].lastMessage);
				// };
				for (var i = members.length - 1; i >= 0; i--) {
					notificationsService.updateUnreadChats(members[i]);
				};
			// });
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
		updatedAt: new Date(),
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
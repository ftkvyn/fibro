var Q = require('q');

		    
var clb = function(err){
	if(err){
		console.error(err);
	}
}

exports.processNewMessage = function (message, projectMembers){
	var cb = clb;
	var createOrUpdateUserChats = function(err, chats){
		if(err){
			console.error(err);		
			return;
		}
		if(chats.length == 1){
			console.error('Only one chat for users pair');
			console.error(message);
			return;
		}
		if(chats.length > 2){
			console.error('More than two chats for users pair');
			console.error(message);
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
		if(!projectMembers){
			console.error('Please, transmit members to the method processNewMessage.');
		}
		Chat.find({targetProject : message.toProject})
		.exec(function(err, chats){
			if(err){
				console.error(err);		
				return;
			}
			var saves = [];
			for (var i = chats.length - 1; i >= 0; i--) {
				chats[i].lastMessage = message.id;
				if((message.from || message.from.id) !== chats[i].owner){
					chats[i].unreadMessages++;
				}
				saves.push(chats[i].save());
			};
			Q.all(saves).then(cb);
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
		cb = function(){
			for (var i = projectMembers.length - 1; i >= 0; i--) {
				notificationsService.updateUnreadChats(projectMembers[i]);
			};	
		}
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
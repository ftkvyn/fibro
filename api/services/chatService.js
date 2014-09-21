var Q = require('q');

var clb = function(err){
	if(err){
		console.error(err);
	}
}

exports.processNewMessage = function (message, projectMembers){

	var createOrUpdateUserChats = function(err, chats, isMessageAuthor){
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
		for (var i = chats.length - 1; i >= 0; i--) {
			chats[i].lastMessage = message.id;
			if(chats[i].owner != message.from){
				chats[i].unreadMessages++;
			}
			chats[i].save(clb);
		};		
	}

	var createMessageChats = function(){
		Chat.create({
			owner: message.from,
			targetUser: message.toUser,
			unreadMessages: 0,
			lastMessage: message.id
		}).exec(clb);

		Chat.create({
			owner: message.toUser,
			targetUser: message.from,
			unreadMessages: 1,
			lastMessage: message.id
		}).exec(clb);
	}

	var processProjectChats = function(){
		if(!projectMembers){
			console.error('Please, transmit members to the method processNewMessage.');
		}
		Chat.find({targetProject : message.toProject})
		.exec(function(err, chats){
			if(err){
				console.error(err);		
				return;
			}
			for (var i = chats.length - 1; i >= 0; i--) {
				chats[i].lastMessage = message.id;
				if((message.from || message.from.id) !== chats[i].owner){
					chats[i].unreadMessages++;
				}
				chats[i].save(clb);
			};
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
		processProjectChats(message, projectMembers);
		return;
	}
	if(message.toUser){
		processUsersChats(message);
		return;
	}
}
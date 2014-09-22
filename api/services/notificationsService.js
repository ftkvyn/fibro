

exports.updateUnreadChats = function (userId){
	Chat.count({owner: userId, unreadMessages: { '>': 0 }})
	.exec(function(err,count){
		if(err){
			console.log(err);
		}
		var io = sails.io;
		io.sockets.in('notifications_' + userId).emit('unreadChats', count);
	});
}

exports.updateInvitations = function (userId){
	Invitation.count({user: userId, isDeclined: false})
	.exec(function(err,count){
		if(err){
			console.log(err);
		}
		var io = sails.io;
		io.sockets.in('notifications_' + userId).emit('invitations', count);
	});
}

exports.updateRequests = function (userId){
	Project.find({author: userId})
	.exec(function(err, projects){
		var io = sails.io;		
		if(err){
			console.log(err);
		}
		if(!projects.length){
			io.sockets.in('notifications_' + userId).emit('requests', 0);
			return;
		}
		var projectIds = projects.map(function(p){return p.id;});
		MembershipRequest.count({project: projectIds, isDeclined: false})
		.exec(function(err,count){
			if(err){
				console.log(err);
			}
			var io = sails.io;
			io.sockets.in('notifications_' + userId).emit('requests', count);
		});	
	});
	
}


exports.updateUnreadChats = function (userId){

	Chat.count({owner: userId, unreadMessages: { '>': 0 }})
	.exec(function(err,count){
		if(err){
			console.error(err);
		}
		var io = sails.io;
		io.sockets.in('notifications_' + userId).emit('unreadChats', count);
	});
}

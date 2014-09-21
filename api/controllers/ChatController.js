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
	}
};


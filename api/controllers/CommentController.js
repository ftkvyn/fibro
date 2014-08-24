/**
 * CommentController
 *
 * @description :: Server-side logic for managing Comments
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	subscribe: function(req, res){
		var id = req.param('id');
		var socket = req.socket;

		socket.join('post_' + id);

		return res.send(200);
	},

	create: function(req, res){
		req.body.author = req.session.user.id;

		Comment.create(req.body)
			.exec(function(err, comment){
			if(err){
				console.log(err);
				return res.badRequest('Unable create comment.');
			}

			var socket = req.socket;
		    var io = sails.io;
		    comment.author = req.session.user;
	    	io.sockets.in('post_' + comment.post).emit('comment', comment);
			return res.send(comment);
		});
	},
};


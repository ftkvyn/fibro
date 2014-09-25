/**
 * PostController
 *
 * @description :: Server-side logic for managing Posts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var Q = require('q');

module.exports = {
	
	create: function (req, res) {
		req.body.author = req.session.user.id;
		Post.create(req.body)
		.exec(function(err, post){
			if(err){
				console.log(err);
				res.send(500);
			}
			res.send(post);
		});
	},

	update: function (req, res) {
		Post.findOne(req.param('id'))
		.exec(function(err, post){
			if(err || (!post)){
				console.log(err);
				return res.badRequest('Post not found.');
			}
			post.title = req.body.title;
			post.text = req.body.text;
			post.isPublic = req.body.isPublic;
			post.save(function(err, post){
				return res.send(post);	
			});			
		});		
	},

	destroy: function(req, res){
		var id = +req.param('id');
		Post.findOne(id)
		.exec(function(err, post) {
		   if (err) {
		   	return res.serverError('Unable find post');
		   }
		   var qs = [];
		   qs.push(Post.destroy({id: post.id}));
		   qs.push(Comment.destroy({post: post.id}));

		   Q.all(qs)
		   .done(function(data){
		   		return res.send('Success');
		   }, 
		   	function(err){
		   		console.log(err);
		   		return res.badRequest('Error while deleting post');
		   	});
		});
	},

	forMain: function(req, res){
		var skip = +req.param('skip') || 0;
		var count = +req.param('count');
		Post.find({sort: 'createdAt DESC', limit: count, skip: skip, where: {isPublic: true}})
		//populate project, reduce
		.populate('project')
		.exec(function(err, posts){
			if(err){
				console.log(err);
				return res.badRequest('Unable load posts');
			}
			posts = posts.map(function(p){
				p.project = p.project.reduce();
				return p.reduce();
			});

			return res.send(posts);	
		});	
	}
};


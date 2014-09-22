/**
 * MembershipRequestController
 *
 * @description :: Server-side logic for managing Membershiprequests
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var Q = require('q');

module.exports = {
	create : function(req, res){		
		var request = req.body;
		request.user = req.session.user.id;
		MembershipRequest.create(request)
		.exec(function(err, request){
			if(err){
				console.log(err);
				return res.badRequest('Unable create request');
			}
			res.send(request);
			Project.findOne(request.project).exec(function(err, project){
				notificationsService.updateRequests(project.author);	
			});
			
		});
	},

	findForAuthor: function(req, res){	
		var projectId = req.param('id');
		var query = {
			author: req.session.user.id
		};
		if(projectId){
			query.id = projectId;
		}
		Project.find(query)
		.exec(function(err, projects){
			if(err){
				console.log(err);
				return res.badRequest('Unable load requests');
			}
			var ids = projects.map(function(project){ return project.id});
			MembershipRequest.find(
				{project: ids})
			.populate('user')
			.populate('project')
			.exec(function(err, requests){
				if(err){
					console.log(err);
					return res.badRequest('Unable load requests');
				}
				return res.send(requests);
			});
			
		});
	},

	accept : function(req, res){		
		MembershipRequest.findOne(req.body.id)
		.populate('project')
		.exec(function(err, request){
			if(err){
				console.log(err);
				return res.badRequest('Unable find request');
			}
			if(req.session && req.session.user){
				if(req.session.user.id != request.project.author){
					return res.badRequest('Unable process request');	
				}
			} else{
				return res.badRequest('Unable process request');
			}
			var projectId = request.project.id;
			var userId = request.user;

			request.project.members.add(request.user);
			var qs = [];
			qs.push(request.project.save());
			qs.push(request.destroy());
			qs.push(Invitation.destroy({user: userId, project: projectId}));

			Q.all(qs).done(
				function(){
					res.send('Success!');
					chatService.addUserToProjectChat(userId, projectId);
					Project.findOne(projectId).exec(function(err, project){
						notificationsService.updateRequests(project.author);	
					});
					
				},
				function(err){
					console.log(err);
					return res.serverError('Error processing request');
			});
		});
	},

	decline : function(req, res){		
		MembershipRequest.findOne(req.body.id)
		.populate('project')
		.exec(function(err, request){
			if(err){
				console.log(err);
				return res.badRequest('Unable find request');
			}
			var authorId = request.project.author;
			if(req.session && req.session.user){
				if(req.session.user.id != request.project.author){
					return res.badRequest('Unable process request');	
				}
			} else{
				return res.badRequest('Unable process request');
			}
			// request.isDeclined = true;
			var projectId = 
			request.destroy(function(err){
				if(err){
					console.log(err);
					return res.serverError('Unable process request');
				}
				res.send('Success!');
				notificationsService.updateRequests(authorId);	
			});
		});
	},
};


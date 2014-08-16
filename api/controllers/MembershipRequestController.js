/**
 * MembershipRequestController
 *
 * @description :: Server-side logic for managing Membershiprequests
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

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
			return res.send(request);
		});
	},

	findForAuthor: function(req, res){		
		Project.find({
			author: req.session.user.id
		})
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

			request.project.members.add(request.user);
			request.project.save(function(err){
				if(err){
					console.log(err);
					return res.serverError('Unable save project');
				}
				request.destroy(function(err){
					if(err){
						console.log(err);
						return res.serverError('Unable destroy request');
					}
					return res.send('Success!');
				})
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

			if(req.session && req.session.user){
				if(req.session.user.id != request.project.author){
					return res.badRequest('Unable process request');	
				}
			} else{
				return res.badRequest('Unable process request');
			}
			// request.isDeclined = true;
			request.destroy(function(err){
				if(err){
					console.log(err);
					return res.serverError('Unable process request');
				}
				return res.send('Success!');
			});
		});
	},
};


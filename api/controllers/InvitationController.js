/**
 * InvitationController
 *
 * @description :: Server-side logic for managing Invitations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var Q = require('q');

module.exports = {
	create : function(req, res){		
		var invite = req.body;
		invite.inviter = req.session.user.id;
		Invitation.create(invite)
		.exec(function(err, invite){
			if(err){
				console.log(err);
				return res.badRequest('Unable create invite');
			}
			return res.send(invite);
		});
	},

	forCurrentUser : function(req, res){		
		Invitation.find({user: req.session.user.id})
		.populate('project')
		.populate('inviter')
		.exec(function(err, invitations){
			if(err){
				console.log(err);
				return res.badRequest('Unable load invitations');
			}
			return res.send(invitations);
		});
	},

	accept : function(req, res){		
		Invitation.findOne(req.body.id)
		.populate('project')
		.exec(function(err, invite){
			if(err){
				console.log(err);
				return res.badRequest('Unable find invite');
			}
			if(req.session && req.session.user){
				if(req.session.user.id != invite.user){
					return res.badRequest('Unable process invite');	
				}
			} else{
				return res.badRequest('Unable process invite');
			}

			var projectId = invite.project.id;
			var userId = invite.user;

			invite.project.members.add(invite.user);
			var qs = [];
			qs.push(invite.project.save());
			qs.push(invite.destroy());
			qs.push(MembershipRequest.destroy({user: userId, project: projectId}));

			Q.all(qs).done(
				function(){
					res.send('Success!');
					chatService.addUserToProjectChat(userId, projectId);
				},
				function(err){
					console.log(err);
					return res.serverError('Error processing invitation.');
			});
		});
	},

	decline : function(req, res){		
		Invitation.findOne(req.body.id)
		.exec(function(err, invite){
			if(err){
				console.log(err);
				return res.badRequest('Unable find invite');
			}
			if(req.session && req.session.user){
				if(req.session.user.id != invite.user){
					return res.badRequest('Unable process invite');	
				}
			} else{
				return res.badRequest('Unable process invite');
			}


			// invite.isDeclined = true;
			invite.destroy(function(err){
				if(err){
					console.log(err);
					return res.serverError('Unable process invite');
				}
				return res.send('Success!');
			});
		});
	},

};


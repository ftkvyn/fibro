/**
 * InvitationController
 *
 * @description :: Server-side logic for managing Invitations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

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
		.populate('user')
		.exec(function(err, invite){
			//ToDo: check user
			if(err){
				console.log(err);
				return res.badRequest('Unable find invite');
			}
			invite.project.members.add(invite.user.id);
			invite.project.save(function(err){
				if(err){
					console.log(err);
					return res.serverError('Unable save project');
				}
				invite.destroy(function(err){
					if(err){
						console.log(err);
						return res.serverError('Unable destroy invite');
					}
					return res.send('Success!');
				})
			});
		});
	},

	decline : function(req, res){		
		Invitation.findOne(req.body.id)
		.populate('user')
		.exec(function(err, invite){
			//ToDo: check user
			if(err){
				console.log(err);
				return res.badRequest('Unable find invite');
			}
			invite.isDeclined = true;
			invite.save(function(err){
				if(err){
					console.log(err);
					return res.serverError('Unable save project');
				}
				return res.send('Success!');
			});
		});
	},

};


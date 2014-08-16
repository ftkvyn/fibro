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
		console.log(request);
		MembershipRequest.create(request)
		.exec(function(err, request){
			if(err){
				console.log(err);
				return res.badRequest('Unable create request');
			}
			return res.send(request);
		});
	},

	// findOneForProject: function(req, res){		
	// 	MembershipRequest.findOne({
	// 		user: req.session.user.id,
	// 		project: req.param('id')
	// 	})
	// 	.exec(function(err, request){
	// 		if(err){
	// 			console.log(err);
	// 			return res.badRequest('Unable load request');
	// 		}
	// 		return res.send(request);
	// 	});
	// },
};


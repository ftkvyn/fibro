/**
 * ProjectController
 *
 * @description :: Server-side logic for managing projects
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var Q = require('q');

module.exports = {
	create : function(req, res){		
		var project = req.body;
		project.author = req.session.user.id;
		project.members = [req.session.user.id];
		Project.create(project)
		.exec(function(err, project){
			if(err){
				console.log(err);
				return res.badRequest('Unable create project');
			}
			return res.send(project);
		});
	},

	update: function (req, res) {
		Project.findOne(req.param('id'))
		.exec(function(err, project){
			if(err || (!project)){
				return res.badRequest('Project not found.');
			}
			project.name = req.body.name;
			project.description = req.body.description;
			project.neededMembers = req.body.neededMembers;
			project.privateInformation = req.body.privateInformation;
			project.save(function(err, project){
				return res.send(project);	
			});			
		});		
	},

	destroy: function(req, res){
		// console.log(req);
		var id = +req.param('id');
		Project.findOne(id)
		.exec(function(err, project) {
		   if (err) {
		   	return res.serverError('Unable find project');
		   }
		   if(req.session && req.session.user){
				if(req.session.user.id != project.author){
					return res.badRequest('Unable delete project');	
				}
			} else{
				return res.badRequest('Unable delete project');
			}
		   var qs = [];
		   qs.push(Project.destroy({id: project.id}));
		   qs.push(Invitation.destroy({project: project.id}));
		   qs.push(MembershipRequest.destroy({project: project.id}));
		   qs.push(Message.destroy({toProject: project.id}));

		   Q.all(qs)
		   .done(function(data){
		   		return res.send('Success');
		   }, 
		   	function(err){
		   		console.log(err);
		   		return res.badRequest('Error while deleting project');
		   	});
		});
	},

	authoredProjects: function(req, res){		
		Project.find({author: req.session.user.id})
		.exec(function(err, projects){
			if(err){
				console.log(err);
				return res.badRequest('Unable load projects');
			}
			return res.send(projects);
		});
	},

	leave : function(req, res){		
		Project.findOne(req.body.id)
		.exec(function(err, project){
			if(err){
				console.log(err);
				return res.badRequest('Unable find project');
			}
			project.members.remove(req.session.user.id);
			project.save(function(){
				return res.send('Success!');	
			});			
		});
	},

	search: function(req,res){
		var request = { or : []};
		var rawPattern = req.body.pattern;
		var values = rawPattern
					.split(',')
					.map(function(str){
						return str.trim();
					});
		for (var i = values.length - 1; i >= 0; i--) {
			if(values[i]){
				switch (req.body.criteria) {
				  case "needed":
				  	request.or.push({neededMembers : {'contains' : values[i]}});
				    break;
				  case "name":
				  	request.or.push({name : {'contains' : values[i]}});
				    break;
				  case "description":
				    request.or.push({description : {'contains' : values[i]}});
				    break;
				  default:
				  	console.log(req.body.criteia);
				    return res.badRequest('Invalid search criteia.');
				}
			}
		};

		Project.find(request)
		.skip(req.body.skip)
		.exec(function(err, projects){
			if(err){
				return res.badRequest('Error searching projects.');
			}
			
			return res.send({items : projects, pattern: rawPattern});	
		});	
	}
};


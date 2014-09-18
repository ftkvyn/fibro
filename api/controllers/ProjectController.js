/**
 * ProjectController
 *
 * @description :: Server-side logic for managing projects
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var Q = require('q');
var cloudinary = require('cloudinary');

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
				console.log('==========');
				console.log(project);
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

		return searchService.search(res, 
			req.body.pattern, 
			req.body.criteria.replace('description', 'description_plainText'), 
			["neededMembers", "name", "description_plainText"], 
			Project,
			"project");
	},

	forMain: function(req, res){
		var skip = +req.param('skip') || 0;
		var count = +req.param('count');
		Project.find({sort: 'createdAt DESC', limit: count, skip: skip})
		.exec(function(err, projects){
			if(err){
				console.log(err);
				return res.badRequest('Unable load projects');
			}
			projects = projects.map(function(p){
				delete p.description;
				delete p.privateInformation;
				return p;
			});
			return res.send(projects);	
		});	
	},
};


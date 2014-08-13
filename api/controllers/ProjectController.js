/**
 * ProjectController
 *
 * @description :: Server-side logic for managing projects
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

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
};


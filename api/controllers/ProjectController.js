/**
 * ProjectController
 *
 * @description :: Server-side logic for managing projects
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	create : function(req, res){
		//ToDo: make a policy
		if(!req.session.user){
			return res.badRequest('Not authorized.');
		}
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
	}
};


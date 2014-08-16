fibroApp.controller('InviteController', ['$http', function($http){
	this.projects = [];
	this.users = [];
	this.invitations = [];
	this.new = {};
	this.success = false;
	var me = this;

	this.loadUsers = function(){
		//ToDo: exclude members
		$http.get('/api/user')
		.success(function(data){
			me.users = data;
		})
		.error(function(data){
			console.log(data);
			alert('Error occured while loading users.');
		});
	}

	this.loadProjects = function(){
		//ToDo: exclude members
		$http.get('/api/project/authored')
		.success(function(data){
			me.projects = data;
			if(data.length){
				me.new.project = data[0].id;
			}
		})
		.error(function(data){
			console.log(data);
			alert('Error occured while loading projects 123.');
		});
	}

	this.loadInvites = function(){
		$http.get('/api/invitation/forUser')
		.success(function(data){
			me.invitations = data;
		})
		.error(function(data){
			console.log(data);
			alert('Error occured while loading invitations.');
		});
	}

	this.accept = function(id, isReload){
		$http.post('/api/invitation/accept/', {id:id})
		.success(function(data){
			if(isReload){
				location.reload();
				return;
			}
			me.loadInvites();
		})
		.error(function(data){
			console.log(data);
			alert('Error occured while accepting invitation.');
		});
	}

	this.decline = function(id, isReload){
		$http.post('/api/invitation/decline/', {id:id})
		.success(function(data){
			if(isReload){
				location.reload();
				return;
			}
		    me.loadInvites();
		})
		.error(function(data){
			console.log(data);
			alert('Error occured while declining invitation.');
		});
	}

	this.send = function(userId, projectId){
		this.new.user = userId;
		this.new.project = projectId;
		$http.post('/api/invitation', this.new)
		.success(function(data){
			console.log('Success!');
			me.success = true;
			me.new = {};
		})
		.error(function(data){
			console.log(data);
			alert('Error occured while creating invitation.');
		});			
	}

	this.hideAlerts = function(){
		me.success = false;
	}
	
}]);
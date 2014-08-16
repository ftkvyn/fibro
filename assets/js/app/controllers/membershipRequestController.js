fibroApp.controller('MembershipRequestController', ['$http', function($http){

	this.projectId = undefined;
	// this.isRequested = false;
	this.request = {};
	this.success = false;
	this.requests = [];
	var me = this;

	this.sendRequest = function(){
		me.request.project = this.projectId; 

		$http.post('/api/membershipRequest', me.request)
		.success(function(data){
			me.request = data;
			me.success = true;
		})
		.error(function(data){
			console.log(data);
			alert('Error occured while sending request.');
		});
	}

	this.hideAlerts = function(){
		me.success = false;
	}

	this.loadRequests = function(){
		$http.get('/api/membershipRequest/forAuthor/')
		.success(function(data){
			me.requests = data;
		})
		.error(function(data){
			console.log(data);
			alert('Error occured while loading request.');
		});
	}

	this.accept = function(id){
		$http.post('/api/membershipRequest/accept/', {id:id})
		.success(function(data){
			me.loadRequests();
		})
		.error(function(data){
			console.log(data);
			alert('Error occured while processing request.');
		});
	}

	this.decline = function(id, isReload){
		$http.post('/api/membershipRequest/decline/', {id:id})
		.success(function(data){
		    me.loadRequests();
		})
		.error(function(data){
			console.log(data);
			alert('Error occured while processing request.');
		});
	}
}]);

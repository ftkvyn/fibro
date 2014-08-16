fibroApp.controller('MembershipRequestController', ['$http', function($http){

	this.projectId = undefined;
	// this.isRequested = false;
	this.request = {};
	this.success = false;
	var me = this;

	this.sendRequest = function(){
		var request = {};
		request.project = this.projectId; 

		$http.post('/api/membershipRequest', request)
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

	// this.loadRequest = function(){
	// 	$http.get('/api/membershipRequest/forProject/'+this.projectId)
	// 	.success(function(data){
	// 		me.request = data;
	// 		// me.isRequested = true;
	// 	})
	// 	.error(function(data){
	// 		console.log(data);
	// 		alert('Error occured while loading request.');
	// 	});
	// }
}]);

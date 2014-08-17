fibroApp.controller('ChatListController', ['$http', '$scope', function($http, $scope){
	$scope.chats = [];
	var me = $scope;

	$scope.loadChats = function(){
		$http.get('/api/message/chats')
		.success(function(data){
			me.chats = data;
		})
		.error(function(data){
			console.log(data);
			alert('Error occured while loading chats list.');
		});
	}
	
}]);
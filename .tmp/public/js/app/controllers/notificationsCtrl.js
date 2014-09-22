fibroApp.controller('NotificationsController', ['$http', '$scope', function($http, $scope){
	$scope.unreadChats = 0;
	$scope.invitations = 0;
	$scope.requests = 0;
	var me = $scope;

	$scope.socketMagic = function(){
		var socket = io.connect();

		socket.on('unreadChats', function(count){
				$scope.unreadChats = count;
				$scope.$apply();
			});		

		socket.on('invitations', function(count){
				$scope.invitations = count;
				$scope.$apply();
			});		

		socket.on('requests', function(count){
				$scope.requests = count;
				$scope.$apply();
			});		

		socket.get('/api/notifications/subscribe/');
	}

	me.socketMagic();
}]);
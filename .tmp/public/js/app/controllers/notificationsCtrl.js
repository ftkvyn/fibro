fibroApp.controller('NotificationsController', ['$http', '$scope', function($http, $scope){
	$scope.unreadChats = 0;
	var me = $scope;

	$scope.socketMagic = function(){
		var socket = io.connect();

		socket.on('unreadChats', function(count){
				$scope.unreadChats = count;
				console.log(count);
				$scope.$apply();
			});		

		socket.get('/api/notifications/subscribe/');
	}

	me.socketMagic();
}]);
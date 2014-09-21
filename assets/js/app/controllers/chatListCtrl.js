fibroApp.controller('ChatListController', ['$http', '$scope', function($http, $scope){
	$scope.chats = [];
	var me = $scope;

	$scope.loadChats = function(){
		// $scope.chats = [];
		var me = $scope;
		$http.get('/api/chats/0/10')
		.success(function(data){
			me.chats = data;
		})
		.error(function(data){
			console.log(data);
			alert('Error occured while loading chats list.');
		});
	}

	$scope.getRoute = function(chat){
		if(chat.targetUser){
			return 'user/' + chat.targetUser.id;
		}
		if(chat.targetProject){
			return 'project/' + chat.targetProject.id;
		}
	}

	$scope.socketMagic = function(){
		var socket = io.connect();

		socket.on('unreadChats', function(count){
				$scope.loadChats();
			});		
	}

	me.socketMagic();
	
}]);
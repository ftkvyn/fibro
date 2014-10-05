fibroApp.controller('ChatController', ['$http', '$scope', function($http, $scope){
	$scope.messages = [];
	$scope.type = undefined;
	$scope.id = undefined;
	$scope.currentUserId = undefined;
	$scope.text = '';
	$scope.isSending = false;
	$scope.users = [];
	var me = $scope;

	$scope.init = function(type, id, currentUserId){
		me.type = type;
		me.id = id;
		me.socketMagic();
		me.currentUserId = currentUserId;
		me.loadMessages();
		me.loadUsers();
		
	}	

	$scope.keyPressed = function(){
         if(event.which === 13) {
        	if(event.shiftKey)
        	{
        		return;
        	}
        	$scope.send();

        	event.preventDefault();
        }
	}	

	$scope.send = function(){
		if($scope.isSending){
			return;
		}
		$scope.isSending = true;
		var message = {
			text: $scope.text
		}
		if($scope.type === 'project'){
			message.toProject = $scope.id;
		} else if($scope.type === 'user'){
			message.toUser = $scope.id;
		}
		$http.post('/api/message/', message)
		.success(function(data){
			// In project chat message goes through 
			// socket to every project member, so
			// there is no need to add message here.
			if(me.type !== 'project'){
				me.messages.unshift(data);
			}
			me.text = '';
			me.isSending = false;
		})
		.error(function(data){
			console.log(data);
			console.log('Error occured while sending message.');
			me.isSending = false;
		});
	}

	$scope.loadMessages = function(){
		$http.get('/api/message/' + $scope.type + '/' + $scope.id)
		.success(function(data){
			me.messages = data;
		})
		.error(function(data){
			console.log(data);
			console.log('Error occured while loading messages.');
		});
	}

	$scope.loadUsers = function(){
		$http.get('/api/chat/users/' + $scope.type + '/' + $scope.id)
		.success(function(data){
			for (var i = data.length - 1; i >= 0; i--) {
				me.users[data[i].id] = data[i];
			};
		})
		.error(function(data){
			console.log(data);
			console.log('Error occured while loading messages.');
		});
	}
	$scope.getUserName = function(id){
		if($scope.users[id]){
			return $scope.users[id].name;
		}
		$http.get('/api/user/reduced/'+ id)
		.success(function(data){
			$scope.users[data.id] = data;
			// $scope.$apply();
		});
		return "";
	}

	$scope.socketMagic = function(){
		var socket = io.connect();

		socket.on('connect', function(){
			console.log('connected');
		});

		socket.on('message', function(msg){
				me.messages.unshift(msg);
				$scope.$apply();
				if($scope.currentUserId != msg.from){
					$scope.markChatRead();
				}
			});		

		socket.get('/api/message/subscribe/'+ $scope.type + '/' + $scope.id);
	}

	$scope.markChatRead = function(){
			
		$http.post('/api/chat/markAsRead/' + me.type + '/' + me.id)
		.success(function(data){
			//	Do nothing;
		})
		.error(function(data){
			console.log(data);
			// console.log('Error occured while updating chat.');
		});
		
	}
	setTimeout(function(){
		$scope.markChatRead();
	}, 2000);	
}]);
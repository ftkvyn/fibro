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
			alert('Error occured while sending message.');
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
			alert('Error occured while loading messages.');
		});
	}

	$scope.loadUsers = function(){
		$http.get('/api/message/users/' + $scope.type + '/' + $scope.id)
		.success(function(data){
			for (var i = data.length - 1; i >= 0; i--) {
				me.users[data[i].id] = data[i];
			};
		})
		.error(function(data){
			console.log(data);
			alert('Error occured while loading messages.');
		});
	}

	$scope.socketMagic = function(){
		var socket = io.connect();

		socket.on('connect', function(){
			console.log('connected');
		});

		socket.on('message', function(msg){
				// console.log('message');
				// console.log(msg);
				me.messages.unshift(msg);
				$scope.$apply();
			});		

		socket.get('/api/message/subscribe/'+ $scope.type + '/' + $scope.id);
	}
}]);
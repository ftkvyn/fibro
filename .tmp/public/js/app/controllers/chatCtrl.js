fibroApp.controller('ChatController', ['$http', '$scope', function($http, $scope){
	$scope.messages = [];
	$scope.type = undefined;
	$scope.id = undefined;
	$scope.currentUserId = undefined;
	$scope.text = '';
	$scope.isSending = false;
	var me = $scope;

	$scope.init = function(type, id, currentUserId){
		me.type = type;
		me.id = id;
		me.currentUserId = currentUserId;
		me.loadMessages();
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
		console.log(message);
		$http.post('/api/message/', message)
		.success(function(data){
			me.messages.push(data);
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
	
}]);
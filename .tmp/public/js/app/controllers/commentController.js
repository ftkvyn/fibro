fibroApp.controller('CommentController', ['$http','$scope', function($http, $scope){
	$scope.items = [];
	$scope.text = undefined;
	$scope.postId = undefined;
	$scope.isSending = false;
	var me = $scope;

	$scope.load = function(postId){
		$scope.postId = postId;
		$scope.socketMagic();		
	}

	$scope.socketMagic = function(){
		var socket = io.connect();

		socket.on('connect', function(){
			console.log('connected');
		});

		socket.on('comment', function(comment){
				$scope.items.push(comment);
				$scope.$apply();
			});		

		socket.get('/api/comment/subscribe/' + $scope.postId);
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
		var comment = {
			text: $scope.text,
			post: $scope.postId
		}
		$http.post('/api/comment/', comment)
		.success(function(data){
			me.text = '';
			me.isSending = false;
		})
		.error(function(data){
			console.log(data);
			alert('Error occured while creating comment.');
			me.isSending = false;
		});
	}

}]);
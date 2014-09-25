fibroApp.controller('NotificationsController', ['$http', '$scope', function($http, $scope){
	$scope.unreadChats = 0;
	$scope.invitations = 0;
	$scope.requests = 0;
	$scope.notificationTimer = {};
	$scope.originalTitle = document.title;
	$scope.isWindowActive = true;
	var me = $scope;

	$scope.socketMagic = function(){
		var socket = io.connect();

		socket.on('unreadChats', function(count){
				$scope.setTimer($scope.unreadChats, count, 'chat');
				$scope.unreadChats = count;				
				$scope.$apply();
			});		

		socket.on('invitations', function(count){
				$scope.setTimer($scope.invitations, count, 'invitation');
				$scope.invitations = count;
				$scope.$apply();
			});		

		socket.on('requests', function(count){
				$scope.setTimer($scope.requests, count, 'request');
				$scope.requests = count;
				$scope.$apply();
			});		

		socket.get('/api/notifications/subscribe/');
	}

	$scope.setTimer = function(oldValue, newValue, eventName){
		//clearInterval();
		if(newValue <= oldValue){
			return;			
		}
		clearInterval($scope.notificationTimer);
		var val = newValue - oldValue;
		var newTitle = val + ' new ' + eventName;
		if(val > 1){
			newTitle += 's';
		}

		if(!$scope.isWindowActive){
			$scope.notificationTimer = setInterval(function(){
				if (document.title === $scope.originalTitle) {
					document.title = newTitle;
				}else{
					document.title = $scope.originalTitle;
				}

			}, 800);
		}
	}

	window.onfocus = function () { 
	  $scope.isWindowActive = true; 
	  document.title = $scope.originalTitle;
	  clearInterval($scope.notificationTimer);
	}; 

	window.onblur = function () { 
	  $scope.isWindowActive = false; 
	}; 

	me.socketMagic();
}]);
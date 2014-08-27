fibroApp.controller('ProfileController', ['$http', '$scope', function($http, $scope){
		$scope.user = {};
		var me = $scope;

		$scope.save = function(){
			if($scope.user.name){
				$http.put('/api/user/'+$scope.user.id, $scope.user)
				.success(function(data){
					console.log('Success!');
					window.location = '/profile/' + data.id;
				})
				.error(function(data){
					console.log(data);
					alert('Error occured while updating profile.');
				});			
			}
		}

		$scope.saveImage = function(){
			console.log($scope.$flow.files[0]);
			$http.get('/api/user/image', $scope.$flow.files[0])
			.success(function(data){
				console.log('Success!');
				
			})
			.error(function(data){
				console.log(data);
				alert('Error occured while uploading picture.');
			});
		}

		$scope.load = function(id){
			$http.get('/api/user/'+id)
			.success(function(data){
				console.log('Success!');
				if(data.birthDate){
					data.birthDate = new Date(data.birthDate);
				}
				me.user = data;
			})
			.error(function(data){
				console.log(data);
				alert('Error occured while loading profile.');
			});
		}

	}]);
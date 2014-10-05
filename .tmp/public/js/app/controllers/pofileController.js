fibroApp.controller('ProfileController', ['$http', '$scope', 'nicService', function($http, $scope,nicService){
		$scope.user = {};
		var me = $scope;
		me.count = 5;
		me.users = [];
		me.isLoading = false;

		if(document.getElementById('about')){
				nicService.create('about');
		}

		$scope.save = function(){
			if($scope.user.name){
				me.user.about = nicEditors.findEditor('about').getContent();
				$http.put('/api/user/'+$scope.user.id, $scope.user)
				.success(function(data){
					console.log('Success!');
					window.location = '/profile/' + data.id;
				})
				.error(function(data){
					console.log(data);
					console.log('Error occured while updating profile.');
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
				console.log('Error occured while uploading picture.');
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
				nicEditors.findEditor('about').setContent(data.about);
			})
			.error(function(data){
				console.log(data);
				console.log('Error occured while loading profile.');
			});
		}

		$scope.loadOnMain = function(){
			me.isLoading = true;
			$http.get('/api/user/forMain/'+me.count)
			.success(function(data){
				me.users = data;
				me.isLoading = false;
			})
			.error(function(data){
				console.log(data);
				console.log('Error occured while loading users.');
			});	
		}

	}]);
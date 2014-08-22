fibroApp.controller('SearchController', ['$http', '$scope', function($http, $scope){
		$scope.pattern = undefined;
		$scope.criteria = 'skills';
		$scope.skip = 0;
		$scope.users = [];
		var me = $scope;

		$scope.search = function(){
			if(me.pattern){
				$http.post('/api/user/search', 
					{
						criteria : me.criteria, 
						pattern: me.pattern,
						skip: me.skip
					})
				.success(function(data){	
					if(me.pattern === data.pattern){			
						me.users = data.items;
					}
				})
				.error(function(data){
					console.log(data);
					alert('Error occured while loading users.');
				});
			}
			else{
				me.users = [];
			}
		}

	}]);
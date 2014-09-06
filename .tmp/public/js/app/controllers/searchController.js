fibroApp.controller('SearchController', ['$http', '$scope', function($http, $scope){
		$scope.pattern = undefined;
		$scope.criteria = undefined;
		$scope.skip = 0;
		$scope.items = [];
		$scope.isSearching = false;
		var me = $scope;

		$scope.initUsers = function(){
			$scope.criteria = 'skills';
			$scope.entity = 'user';
		}

		$scope.initProjects = function(){
			$scope.criteria = 'neededMembers';
			$scope.entity = 'project';
		}

		$scope.search = function(){
			if(me.pattern){
				me.isSearching = true;
				$http.post('/api/' + $scope.entity + '/search', 
					{
						criteria : me.criteria, 
						pattern: me.pattern,
						skip: me.skip
					})
				.success(function(data){	
					if(me.pattern === data.pattern){			
						me.items = data.items;
						me.isSearching = false;
					}
				})
				.error(function(data){
					console.log(data);
					alert('Error occured while searching.');
				});
			}
			else{
				me.items = [];
				me.isSearching = false;
			}
		}

	}]);
fibroApp.controller('SearchController', ['$http', '$scope', function($http, $scope){
		$scope.pattern = undefined;
		$scope.criteria = undefined;
		$scope.skip = 0;
		$scope.items = [];
		$scope.isSearching = false;
		$scope.initialCount = 4;
		var me = $scope;

		$scope.initUsers = function(){
			$scope.criteria = 'skills';
			$scope.entity = 'user';
			$scope.loadInitialItems();
		}

		$scope.initProjects = function(){
			$scope.criteria = 'neededMembers';
			$scope.entity = 'project';
			$scope.loadInitialItems();
		}

		$scope.loadInitialItems = function(){
			$http.get('/api/' + $scope.entity + '/some/' + $scope.initialCount )
			.success(function(data){	
				me.items = data;
			})
			.error(function(data){
				console.log(data);
				console.log('Error occured while loading.');
			});
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
					console.log('Error occured while searching.');
				});
			}
			else{
				me.items = [];
				me.isSearching = false;
			}
		}

	}]);
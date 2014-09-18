fibroApp.controller('PostController', ['$http','$scope', function($http, $scope){
		$scope.model = {};
		var me = $scope;
		me.posts = [];
		me.isSaving = false;
		me.isLoading = false;
		me.isNew = undefined;
		me.count = 4;
		if(document.getElementById('text')){
				new nicEditor().panelInstance('text');
		}
		
		$scope.save = function(){
			if(!me.isSaving){
				me.isSaving = true;
				me.model.text = nicEditors.findEditor('text').getContent();
				var query;
				if(me.isNew){
					query = $http.post('/api/post', $scope.model);	
				} else{
					query = $http.put('/api/post/'+$scope.model.id, $scope.model);
				}
				console.log($scope.model);
				//return;
				query
				.success(function(data){
					console.log('Success!');
					me.isSaving = false;
					window.location = '/post/' + data.id;
				})
				.error(function(data){
					console.log(data);
					me.isSaving = false;
					alert('Error occured while saving post.');
				});			
			}
		}

		$scope.load = function(isNew, projectId, postId){
			me.isNew = isNew;			
			if(!isNew){
				$http.get('/api/post/'+postId)
				.success(function(data){
					me.model = data;
					nicEditors.findEditor('text').setContent(data.text);
				})
				.error(function(data){
					console.log(data);
					alert('Error occured while loading post.');
				});	
			}else{
				me.model.project = projectId;
			}
		}

		$scope.delete = function(id){
			$http.delete('/api/post/'+id)
			.success(function(data){
				console.log('Success!');
				window.location = '/';
			})
			.error(function(data){
				console.log(data);
				alert('Error occured while deleting post.');
			});
		},

		$scope.loadOnMain = function(){
			return;
			me.isLoading = true;
			$http.get('/api/project/forMain/'+me.count)
			.success(function(data){
				me.projects = data;
				me.isLoading = false;
			})
			.error(function(data){
				console.log(data);
				alert('Error occured while loading projects.');
			});	
		}
	}]);
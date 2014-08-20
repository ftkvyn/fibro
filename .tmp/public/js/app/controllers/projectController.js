fibroApp.controller('ProjectController', ['$http', function($http){
		this.model = {};
		var me = this;
		me.isSaving = false;
		me.isNew = undefined;

		this.save = function(){
			if(!me.isSaving){
				me.isSaving = true;
				var query;
				if(me.isNew){
					query = $http.post('/api/project', this.model);	
				} else{
					query = $http.put('/api/project/'+this.model.id, this.model);
				}
				query
				.success(function(data){
					console.log('Success!');
					me.isSaving = false;
					window.location = '/project/' + data.id;
				})
				.error(function(data){
					console.log(data);
					me.isSaving = false;
					alert('Error occured while saving project.');
				});			
			}
		}

		this.load = function(isNew, projectId){
			me.isNew = isNew;
			if(!isNew){
				$http.get('/api/project/'+projectId)
				.success(function(data){
					me.model = data;
				})
				.error(function(data){
					console.log(data);
					alert('Error occured while loading project.');
				});	
			}
		}

		this.delete = function(id){
			$http.delete('/api/project/'+id)
			.success(function(data){
				console.log('Success!');
				window.location = '/';
			})
			.error(function(data){
				console.log(data);
				alert('Error occured while deleting project.');
			});
		}

		this.leave = function(id){
			$http.post('/api/project/leave/',{id:id})
			.success(function(data){
				console.log('Success!');
				window.location.reload();
			})
			.error(function(data){
				console.log(data);
				alert('Error occured while leaving project.');
			});
		}
	}]);
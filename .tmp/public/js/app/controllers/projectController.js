fibroApp.controller('ProjectController', ['$http', function($http){
		this.new = {};
		var me = this;
		me.isCreating = false;

		this.create = function(){
			if(!me.isCreating){
				me.isCreating = true;
				$http.post('/api/project', this.new)
				.success(function(data){
					console.log('Success!');
					me.isCreating = false;
					window.location = '/project/' + data.id;
				})
				.error(function(data){
					console.log(data);
					me.isCreating = false;
					alert('Error occured while creating project.');
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
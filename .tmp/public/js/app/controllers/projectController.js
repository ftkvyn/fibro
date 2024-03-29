fibroApp.controller('ProjectController', ['$http', 'nicService', function($http, nicService){
		this.model = {};
		var me = this;
		me.isSaving = false;
		me.isNew = undefined;
		me.projects = [];
		me.allLoaded = false;
		me.isLoading = false;
		me.deleteDialogVisible = false;
		me.nameConfirm = '';
		me.skip = 0;
		me.count = 6;
		if(document.getElementById('info')){
			nicService.create('description');
			nicService.create('info');
		}

		this.save = function(){
			if(!me.isSaving){
				me.isSaving = true;
				me.model.description = nicEditors.findEditor('description').getContent();
				me.model.privateInformation = nicEditors.findEditor('info').getContent();
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
					console.log('Error occured while saving project.');
				});			
			}
		}

		this.load = function(isNew, projectId){
			me.isNew = isNew;
			if(!isNew){
				$http.get('/api/project/'+projectId)
				.success(function(data){
					me.model = data;
					nicEditors.findEditor('description').setContent(data.description);
					nicEditors.findEditor('info').setContent(data.privateInformation);
				})
				.error(function(data){
					console.log(data);
					console.log('Error occured while loading project.');
				});	
			}
		}

		this.loadOnMain = function(){
			me.isLoading = true;
			$http.get('/api/project/forMain/'+me.skip+'/'+me.count)
			.success(function(data){
				me.skip += data.length;
				me.projects = me.projects.concat(data);
				me.isLoading = false;
				if(!data.length){
					me.allLoaded = true;
				}
			})
			.error(function(data){
				console.log(data);
				console.log('Error occured while loading projects.');
			});	
		}

		this.loadMore = function(){
			this.loadOnMain();
		}

		this.toggleDialog = function(val){
			me.deleteDialogVisible = val;
		}

		this.notConfirmed = function(){
			return me.model.name != me.nameConfirm;
		}

		this.delete = function(id){
			$http.delete('/api/project/'+id)
			.success(function(data){
				console.log('Success!');
				window.location = '/';
			})
			.error(function(data){
				console.log(data);
				console.log('Error occured while deleting project.');
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
				console.log('Error occured while leaving project.');
			});
		}
	}]);
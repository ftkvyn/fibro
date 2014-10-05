fibroApp.controller('AuthController', ['$http', '$scope', 
	function($http, $scope){
		this.loginPopup = false;
		this.registerPopup = false;
		var me = this;
		me.model = {};
		me.message = undefined;

		me.login = function(){
			me.message = undefined;
			$http.post('/auth/email', me.model)
			.success(function(data){	
				if(!data.success){
					me.message = data.message;
				}else{
					location = '/';					
				}
			})
			.error(function(data){
				console.log(data);
				console.log('Error occured while logging in.');
			});
		}

		me.register = function(){
			me.message = '';
			if(me.model.password.length < 6){
				me.message = 'Password should be at least 6 characters long.'
			}
			if(!me.model.name){
				me.message += ' Name is required.'
			}
			if(!me.model.email){
				me.message += ' Email is required.'
			}
			if(me.message){
				return;
			}
			$http.post('/auth/email/register', me.model)
			.success(function(data){	
				if(!data.success){
					me.message = data.message;
				}else{
					me.registerPopup = false;
					location = '/profile/edit';					
				}
			})
			.error(function(data){
				console.log(data);
				console.log('Error occured while registering.');
			});
		}

		me.requestResetPassword = function(){
			me.message = '';
			if(!me.model.email){
				me.message += 'Please, provide email.'
				return;
			}
			$http.post('/auth/recoverPasswordRequest', me.model)
			.success(function(data){	
				me.message = data.message;
			})
			.error(function(data){
				console.log(data);
				console.log('Error occured while reseting password.');
			});	
		}

		me.resetPassword = function(){
			if(me.model.password.length < 6){
				me.message = 'Password should be at least 6 characters long.'
			}
			$http.post('/auth/resetPassword', me.model)
			.success(function(data){	
				me.message = data.message;
			})
			.error(function(data){
				console.log(data);
				console.log('Error occured while resetting password.');
			});

		}


	}
]);
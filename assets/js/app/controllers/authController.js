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
				alert('Error occured while logging in.');
			});
		}

		me.register = function(){
			if(me.model.password.length < 6){
				me.message = 'Password should be at least 6 characters long.'
				return;
			}
			$http.post('/auth/email/register', me.model)
			.success(function(data){	
				if(!data.success){
					me.message = data.message;
				}else{
					me.registerPopup = false;
					location = '/profile/' + data.userId + '/edit';					
				}
			})
			.error(function(data){
				console.log(data);
				alert('Error occured while registering.');
			});
		}

		me.resetPassword = function(){
			me.message = 'Instructions about recovering password were sent to ' + me.model.email;
		}


	}
]);
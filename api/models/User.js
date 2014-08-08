/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	email: {
	    type: 'email',
	    unique: true
	},
	password: {
	    type: 'string'	    
	},
	name: {
	    type: 'string'	    
	},
	fb_token: {
	    type: 'string',
	},
	fb_id: {
	    type: 'string',
      	required: true,
      	unique: true
	}
  }
};

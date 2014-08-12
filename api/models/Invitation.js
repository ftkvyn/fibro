/**
* Invitation.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  		message: {
  			type: 'string'
  		},
  		responce: {
  			type: 'string'
  		},
  		isDeclined: {
  			type: 'boolean',
  			defaultsTo: false
  		}, 
  		user: {
			model:'user',
			required: true
		},
		inviter: {
			model:'user',
			required: true
		},
		project: {
			model: 'project',
			required: true
		}
  }
};


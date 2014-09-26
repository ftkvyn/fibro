/**
* Message.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  		from: {
  			model: 'user',
			  required:false
  		},

  		toUser: {
  			model: 'user'
  		},

  		toProject: {
  			model: 'project'
  		},

  		text: {
  			type: 'text',
  			required: true
  		},

      isRead: {
        type: 'boolean',
        defaultsTo: false
      },

      isSystem: {
        type: 'boolean',
        defaultsTo: false
      }
  }
};


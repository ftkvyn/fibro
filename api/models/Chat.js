/**
* Chat.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
		owner: {
			model: 'user',
			required: true,
		},
		targetUser: {
			model: 'user',
		},
		targetProject:{
			model: 'project'
		},
		lastMessage: {
			model:'message',
		},		
		unreadMessages: {
			type: 'integer',
			required: true,
			defaultsTo: 0,
		},

  }
};


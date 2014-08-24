/**
* Post.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  		title:{
  			type: 'string',
  			required: true
  		},

  		text: {
  			type: 'text',
  			required: true
  		},

  		isPublic: {
  			type: 'boolean',
  			required: true,
  			defaultsTo: true
  		},

  		author:{
  			model:'user',
  			required:true
  		},

  		project: {
  			model:'project',
  			required: true
  		},

  		comments:{
			  collection: 'comment',
	      via: 'post'
		},
  }
};


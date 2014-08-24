/**
* Comment.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  		text: {
  			type: 'text',
  			required: true
  		},

  		author:{
			model:'user',
			required:true
		},

		post: {
  			model:'post',
  			required: true
  		},
  }
};


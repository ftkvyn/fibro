/**
* Project.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  	name: {
	    type: 'string',
	    required:true	    
	},
	friendlyId:{
		type:'string',
		unique:true
	},
	neededMembers:{
		type:'string'
	},
	isActive:{
		type:'boolean',
		defaultsTo:true
	},
	description:{
		type:'text',
		required:true
	},
	description_plainText:{
		type:'text',
		required:true
	},
	privateInformation:{
		type:'text',
	},
	members:{
		collection: 'user',
        via: 'projects',
        dominant:true
	},
	author:{
		model:'user',
		required:true
	},
	posts:{
		collection: 'post',
        via: 'project'
	},
  },

  beforeCreate: function (values, cb) {
  	values.description_plainText = htmlToTextService.convert(values.description);
    cb();
  },

  beforeUpdate: function(values, cb){
  	values.description_plainText = htmlToTextService.convert(values.description);
    cb();
  }
};


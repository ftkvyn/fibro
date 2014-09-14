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
	friendlyId:{
		type:'string',
		unique:true
	},
	birthDate:{
		type:'date',
	},
	skills:{
		type:'string'
	},
	about:{
		type:'text'
	},
	about_plainText:{
		type:'text'
	},
	location:{
		type:'string'
	},



	projects:{
		collection: 'project',
        via: 'members',
        dominant:false
	},
	createdProjects: {
		collection:'project',
		via:'author'
	},
	invitations: {
		collection:'invitation',
		via:'user'
	},
	fb_token: {
	    type: 'string',
	},
	fb_id: {
	    type: 'string',
      	required: true,
      	unique: true
	}
  },

  beforeCreate: function (values, cb) {
  	values.about_plainText = htmlToTextService.convert(values.about);
    cb();
  },

  beforeUpdate: function(values, cb){
  	values.about_plainText = htmlToTextService.convert(values.about);
    cb();
  }
};


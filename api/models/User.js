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
	profilePic: {
		type: 'string'
	},
	profilePicLarge: {
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
      	// required: true,
      	unique: true
	},

	toJSON: function() {
      var obj = this.toObject();
      delete obj.fb_token;
      delete obj.fb_id;
      delete obj.password;
      delete obj.email;
      return obj;
    },

	reduce: function(leavePlainText){
		delete this.about;		
		delete this.email;
		delete this.password;		
		if(!leavePlainText){
			delete this.about_plainText;
		}
		return this;
	},

  },

  beforeCreate: function (values, cb) {
  	values.about_plainText = htmlToTextService.convert(values.about);
  	if(values.about)
  	{
  		values.about = escapeService.escapeScript(values.about);
  	}
    cb();
  },

  beforeUpdate: function(values, cb){
  	values.about_plainText = htmlToTextService.convert(values.about);
  	if(values.about)
  	{
  		values.about = escapeService.escapeScript(values.about);
  	}
    cb();
  }
};


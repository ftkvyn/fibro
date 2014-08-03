/**
* Dummy.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  		name:{
  			type:'string',
  			unique: true,
      	required: true
  		},
  		floatValue: {
  			type: 'float',
        required: false
  		},
	    intValue: {
	    	type: 'integer',
      	required: true
	    }
  }
};


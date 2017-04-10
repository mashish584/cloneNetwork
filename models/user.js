var mongoose = require('mongoose');
var Schema   = mongoose.Schema,
	objectId = Schema.objectID;
var bcrypt   = require('bcrypt');


var userSchema = new Schema({

	fullname 	 : {type:String,required:true,unique:false,trim:true},
	username 	 : {type:String,unique:true,trim:true},
	email    	 : {type:String,required:true,unique:true,trim:true},
	password 	 : {type:String,trim:false},
	image        : {type:String,default:"https://unsplash.it/40/40"},
	status   	 : {type:String,default:0},
	accountToken : {type:String},
	resetToken   : {type:String},
	expireToken  : {type:Date},
	facebookID   : {type:String},
	fbToken      : Array ,
	googleID     : {type:String},
	googleToken  : Array   

});


var User = mongoose.model('User',userSchema);

module.exports = User;

/*
followers : [{type:objectId,default:"",unique:true}]
*/
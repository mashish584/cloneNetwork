var mongoose = require('mongoose');
var Schema   = mongoose.Schema,
	objectId = Schema.objectID;
var bcrypt   = require('bcrypt');


var userSchema = new Schema({

	fullname 	 : {type:String,required:true,unique:false,trim:true},
	username 	 : {type:String,required:true,unique:true,trim:true},
	email    	 : {type:String,required:true,unique:true,trim:true},
	password 	 : {type:String,required:true,unique:false,trim:false},
	status   	 : {type:String,default:0},
	accountToken : {type:String,default:""},
	resetToken   : {type:String,default:""},
	expireToken  : {type:Date,default:Date.now}

});

userSchema.pre('save',function(next){

	var data = this;

	bcrypt.hash(data.password, 10, function(err, hash) {
  			// Store hash in your password DB. 
  			if(err) throw err;

  			data.password = hash;
  			next();
	});

});

var User = mongoose.model('User',userSchema);

module.exports = User;

/*
followers : [{type:objectId,default:"",unique:true}]
*/
var mongoose = require('mongoose');
var Schema   = mongoose.Schema,
	objectId = Schema.objectID;


var userSchema = new Schema({

	fullname : {type:String,required:true,unique:false,trim:true},
	username : {type:String,required:true,unique:true,trim:true},
	email    : {type:String,required:true,unique:true,trim:true},
	password : {type:String,required:true,unique:false,trim:false},

});

var User = mongoose.model('User',userSchema);

module.exports = User;

/*
followers : [{type:objectId,default:"",unique:true}]
*/
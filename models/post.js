var mongoose = require('mongoose');
var Schema  = mongoose.Schema;

var postSchema = new Schema({
	body  : {type:String,trim:true},
	image : {type:String,trim:true},
	likes : Array,
	comments : [{
				 user : { 
				 			userID : String,
				 			fullname : String,
				 			username : String
				 		},
				 comment : String
			   }]	
});

var Post = mongoose.model('Post',postSchema);
module.exports = Post;
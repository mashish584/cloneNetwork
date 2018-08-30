var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chatSchema = new Schema({
	message : {type:String,trim:true},
	receiver : String,
	sender : String,
	createdAt : {type:Date,default:Date.now()}
});

var Chat = mongoose.model('Chat',chatSchema);
module.exports = Chat;
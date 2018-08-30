var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var notificationSchema = new Schema({
	showTo : String,
	taskBy : String,
	taskByImg : String,
	taskByName: String,
	taskType : String,
	taskImg : String,
	taskID : String
});

var Notification = mongoose.model('Notification',notificationSchema);

module.exports = Notification;
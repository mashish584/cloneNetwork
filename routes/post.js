var express = require('express');
var router = express.Router();
var async = require('async');
var path = require('path');
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname,'../public/images/posts'))
  },
  filename: function (req, file, cb) {
    cb(null, req.user.fullname + '-' + Date.now() + path.extname(file.originalname))
  }
});

var upload = multer({ 
		storage: storage, 
		fileFilter: function (req, file, cb) {
				var types = ['image/jpeg','image/png'];
		            type  = types.find(type => type == file.mimetype);
		          	
		          	if(!type){
		          		return cb(null,false);
		          	}

		          	return cb(null,true);
		      
    	}
});

//importing models
var User = require('../models/user');
var Post = require('../models/post');
var db   = require('../secure/db');



/*GET post*/
router.get('/post/:id',function(req,res,next){
  	db.findData(Post,{_id:req.params.id})
  	  .then(function(data){
  	  		res.render('post',{title:"Community Network",header:true,navbar:true,posts:[data],single:false});
  	  })
  	  .catch(function(err){
  	  	  next(err);
  	  });
});

/* POST save */
router.post('/savepost',upload.single('upload'),function(req,res,next){
	var body = req.body.body;
	var file = req.file;


	var userdata = { userID : req.user._id,fullname : req.user.fullname,image : req.user.image};
	if(!file){
		return res.send({msg:"Please upload image with post." ,success:false});
	}

	async.waterfall([
		function(callback){
			var newPost = new Post();
				newPost.body = body.trim();
				newPost.image = file.filename;
				newPost.owner = userdata;
				newPost.save((err,data) => {
					if(err)  res.send({msg:"Something went wrong" ,success:false});
					if(data) callback(null,data);
				});
		},
		function(data,callback){
			User.findOneAndUpdate(
				{_id:req.user._id},
				{$push:
					{ 
						posts: {
							post  : data._id,
							body  : data.body,
							image : data.image
						} 
					}
				},
				(err,user) => {
					if(err) res.send({msg:"Something went wrong" ,success:false});
					if(user) res.send({msg:"Data Saved",post:data,success:true});
				}
			);
		}
	]);

});	


// Like Toggle

router.post('/toggleLike',function(req,res,next){
	
	var postID = req.body.id

	db.findData(Post,{_id:postID})
		.then(function(data){
		   var index = data.likes.indexOf(req.user._id);
		   if(index == -1){
		   		//find post owner and update likes
				db.findData(User,{_id:data.owner.userID})
			   		  .then(function(user){
			   		  		user.likes = user.likes + 1;
			   		  		user.save((err,user) => {
			   		  			if(err) res.send({success:false});
			   		  			if(user){
			   		  				//update posts data
							   		 data.likes.push(req.user._id);
							   		 data.save((err,data) => {
							   		 	if(err) res.send({success:false})
							   			if(data) res.send({like:true,success:true});
							  		 });
			   		  			}
			   		  		});
			   		  })
			   		  .catch(function(err){
			   		  	next(err);
			   		  });
		   }else{

		   		//find post owner and update likes
				db.findData(User,{_id:data.owner.userID})
			   		  .then(function(user){
			   		  		user.likes = user.likes - 1;
			   		  		user.save((err,user) => {
			   		  			if(err) res.send({success:false});
			   		  			if(user){
			   		  				//update posts data
							   		 data.likes = data.likes.find(like => like != req.user._id);
							   		 data.save((err,data) => {
							   		 	if(err) res.send({success:false})
							   			if(data) res.send({like:false,success:true});
							  		 });
			   		  			}
			   		  		});
			   		  })
			   		  .catch(function(err){
			   		  	next(err);
			   		  });
		   }

		})
		.catch(function(err){
			next(err);
		});

});

router.post('/saveComment',function(req,res,next){

	if(!req.body.text) {
		return res.send({msg:"No comment",success:false});
	}

	db.findData(Post,{_id:req.body.id})
	  .then(function(data){
	  	 data.comments.push({user:req.user._id,fullname:req.user.fullname,username:req.user.username,comment:req.body.text});
	  	 data.save((err) => {
	  	 	if(err) res.send({success:false});
	  	 	res.send({success:true,fullname:req.user.fullname,_id:req.user._id});
	  	 });
	  })
	  .catch(function(err){
	  	next(err);
	  })

});

module.exports = router;
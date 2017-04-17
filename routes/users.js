var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var async = require('async');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname,'../public/images/profile'))
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
		          		return cb(null,false)
		          	}

		          	return cb(null,true);
		      
    	}
});

var User = require('../models/user');
var Post = require('../models/post');
var db  = require('../secure/db');
var middleware = require('../middlewares/middleware');



/* GET users homepage. */
router.get('/home',middleware.isAllowed,function(req, res, next) {
  Post.find((err,post)=>{
  	  if(err) next(err);
  	  res.render('home',{title:"Community Network",header:true,navbar:true,user:req.user,isImage:req.user.image.includes("http"),posts:post,single:true});
  }).sort({'date': -1});
});

/* GET user profilepage. */
router.get('/profile/:id',middleware.isAllowed,function(req,res,next){
	db.findData(User,{_id:req.params.id})
	  .then(function(data){
	  	  res.render('profile',{title:"Community Network",header:true,navbar:true,user:data,allow: (req.user._id == data._id),isFollow:data.followers.find(user => user == req.user._id )});
	  }).catch(function(err){
	  	next(err);
	  });
});

/* GET user update. */
router.get('/update',middleware.isAllowed,function(req,res,next){

	db.findData(User,{_id:req.user._id})
	  .then(function(data){
	  	 res.render('settings',{title:"Community Network",header:true,navbar:true,user:data,isImage:req.user.image.includes("http")});
	  }).catch(function(err){
	  	next(err);
	  });
	
});


/* POST update photo */

router.post('/upload',upload.single('upload'),function(req,res,next){

	if(req.file){
		User.findOneAndUpdate({_id:req.user._id},{$set:{image:req.file.filename}},(err,user) => {
			if(err) res.send({msg:"Something went wrong",success:false});
			if(user) {
				req.user.image = req.file.filename;
				req.session.save();
				res.send({msg:"Photo Updated",success:true,image:req.file.filename});
			};
		});
	}else{
		res.send({msg:"Oops! make sure image should be in .jpeg or .png format.",success:false});
	}
});

/* POST user update */

router.post('/update',middleware.update_Valid,function(req,res,nex){



	User.findOneAndUpdate({_id:req.user._id},{$set:{fullname:req.body.fullname,username:req.body.username,bio:req.body.bio}},(err,user) => {
		if(err) res.send({msg:"Something went wrong",success:false});
		if(user){
			 	req.user.fullname = req.body.fullname;
			 	req.user.username = req.body.username;
			 	req.user.bio = req.body.bio;
				req.session.save();
				res.send({msg:"Information Updated",success:true});
		}
	});


});

/* POST change password */

router.post('/change_password/:id',middleware.change_valid,function(req,res,next){

	var hash = bcrypt.hashSync(req.body.newPassword,10);
	
	User.findOneAndUpdate({_id:req.params.id},{$set:{password:hash}},(err,user) => {
		if(err) res.send({msg:"Something went wrong",success:false});
		if(user) {
			req.user.password = hash;
			req.session.save();
			res.send({msg:"Password changed",success:true});
		}
	});

});


/* GET Follow  */


router.post('/follow',middleware.isFollowing,function(req,res,next){

	var to = req.body.id;
	var from = req.user._id;

	async.parallel([
		function(callback){
			User.findOneAndUpdate(
				{_id:to},
				{$push:{followers :from}},
				(err,user) => {
					if(user) callback(null,user);
					if(err)  callback(null,err);
				}
			)
				
		},
		function(callback){
			User.findOneAndUpdate(
				{_id:from},
				{$push:{following : to}},
				(err,user) => {
					if(user) callback(null,user);
					if(err)  callback(null,err);
				}
			)
				
		}
	],function(err,results){
		if(err) res.send({msg:'Denied',success:false});
		if(results) {
			req.user.following.push(to);
			req.session.save();
			return res.send({msg:'Follow',success:true});
		}
	});


});

router.post('/unfollow',middleware.notFollowing,function(req,res,next){

	var to = req.body.id;
	var from = req.user._id;

	async.parallel([
		function(callback){
			User.findOneAndUpdate(
				{_id:to},
				{$pull:{followers :from}},
				(err,user) => {
					if(user) callback(null,user);
					if(err)  callback(null,err);
				}
			)
				
		},
		function(callback){
			User.findOneAndUpdate(
				{_id:from},
				{$pull:{following : to}},
				(err,user) => {
					if(user) callback(null,user);
					if(err)  callback(null,err);
				}
			)
				
		}
	],function(err,results){
		if(err) res.send({msg:'Denied',success:false});
		if(results) {
			req.user.following = req.user.following.filter(following => following !== to);
			req.session.save();
			return res.send({msg:'Unfollow',success:true});
		}
	});


});

module.exports = router;

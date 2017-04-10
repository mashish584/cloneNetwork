var express = require('express');
var router = express.Router();

var User = require('../models/user');
var db  = require('../secure/db');
var middleware = require('../middlewares/middleware');

/* GET users homepage. */
router.get('/home',middleware.isAllowed,function(req, res, next) {
  res.render('home',{title:"Community Network",header:true,navbar:true,user:req.user});
});

/* GET user profilepage. */
router.get('/profile/:id',function(req,res,next){
	db.findData(res,User,{_id:req.params.id})
	  .then(function(data){
	  	  res.render('profile',{title:"Community Network",header:true,navbar:true,user:data});
	  }).catch(function(err){
	  	next(err);
	  });
});

/* GET user update. */
router.get('/update/:id',function(req,res,next){
	db.findData(res,User,{_id:req.params.id})
	  .then(function(data){
	  	 res.render('settings',{title:"Community Network",header:true,navbar:true,user:data});
	  }).catch(function(err){
	  	next(err);
	  });
	
});

module.exports = router;

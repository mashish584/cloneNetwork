
var express = require('express');
var async   = require('async');
var router = express.Router();
var User   = require('../models/user');


router.get('/activate/:user/:token',function(req,res,next){
	
		User.findOneAndUpdate(
			{$and : [{username:req.params.user},{accountToken:req.params.token}]},
			{$set:{status: "1",accountToken: ""}},
			(err,user) => {
				if(err) throw err;
				if(!user) req.flash('error','Token not valid.');
				if(user) req.flash('success','Account activated successfully.');
				res.redirect('/');

			});

});

router.get('/reset/:user/:token',function(req,res,next){
	
		User.findOne(
			{$and : [{email:req.params.user},{resetToken:req.params.token},{expireToken:{$gt:Date.now()}}]},
			(err,user) => {
				if(err) throw err;
				if(!user) {
					req.flash('error','Invalid or expire token.');
					res.redirect('/');
				};
				if(user) res.render('reset',{title:"Reset your password",header:false,navbar:false});

			});

});

module.exports = router;
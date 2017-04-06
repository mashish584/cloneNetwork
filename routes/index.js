var express = require('express');
var router = express.Router();
var middleware = require('../middlewares/middleware');
var crypto = require('crypto'); 
var User   = require('../models/user');

/* GET login */
router.get('/', function(req, res, next) {
  res.render('index',{title:"Community Network | Login",header:false,navbar:false});
});



/* GET signup */

router.get('/signup',function(req,res,next){
	res.render('signup',{title:"Community Network | Sign Up",header:false,navbar:false});
});

router.post('/register',middleware.validation,function(req,res,next){
	
	var secret = req.body.email.split("@");
	 	secret = secret[0];

	var hash = crypto.createHmac('sha256', secret)
                   .update(secret[1])
                   .digest('hex');

    	hash = hash.substr(20,40);

    var userData = {
    		fullname  	 : req.body.fullname,
    		username  	 : req.body.username,
    		email 	  	 : req.body.email,
    		password  	 : req.body.password,
    		accountToken : hash

    };

    var newUser = new User(userData);
    	newUser.save((err) => {
    		if(err) throw err;
    		console.log("Registered Success");
    	});

});


module.exports = router;

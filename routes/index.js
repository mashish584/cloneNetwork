var express = require('express');
var router = express.Router();

/* GET login */
router.get('/', function(req, res, next) {
  res.render('index',{title:"Community Network | Login",header:false,navbar:false});
});



/* GET signup */

router.get('/signup',function(req,res,next){
	res.render('signup',{title:"Community Network | Sign Up",header:false,navbar:false});
});

router.post('/register',function(req,res,next){
	console.log('trigger');
	res.send("Y");
});

module.exports = router;

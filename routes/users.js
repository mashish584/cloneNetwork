var express = require('express');
var router = express.Router();

/* GET users homepage. */
router.get('/home', function(req, res, next) {
  res.render('home',{title:"Community Network",header:true,navbar:true});
});

/* GET user profilepage. */
router.get('/profile/:id',function(req,res,next){
	res.render('profile',{title:"Community Network",header:true,navbar:true});
});

/* GET user update. */
router.get('/update/:id',function(req,res,next){
	res.render('settings',{title:"Community Network",header:true,navbar:true});
});

module.exports = router;

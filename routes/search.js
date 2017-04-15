var express = require('express');
var router = express.Router();

var middleware = require('../middlewares/middleware');
var User = require('../models/user');

router.get('/search',middleware.isAllowed,function(req,res,next){
	res.render('search',{title:'Community Network | Search',header:false,navbar:true});
});

router.get('/findUser',function(req,res,next){

	var term = req.query.term;

	User.find({$or:[{fullname:{'$regex' : '^'+term, '$options' : 'i'}},{username:{'$regex' : '^'+term, '$options' : 'i'}}]}, function(err,users) {
  		users.map(user => {
  			user.password = "";
  		});

  		if(term){
  			 res.send(users);
  		}else{
  			res.send([]);
  		}

	});



});

module.exports = router;
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var facebookStrategy = require('passport-facebook').Strategy;
var googleStrategy = require('passport-google-oauth20').Strategy;
var bcrypt = require('bcrypt');

var User = require('../models/user');
var get  = require('./smtp-cred');
var db   = require('./db');
var methods = require('../secure/methods');


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
 	done(null, user);
});

// local strategy for login

passport.use('local.login',new localStrategy({
	usernameField : "email",
	passwordField : "password",
	passReqToCallback : true
},(req,email,password,done) => {

	db.findData(User,{email:email})
	  .then(function(data){
	  	if(bcrypt.compareSync(password,data.password)){
			return done(null,data);
		} else{
		   return done(null,false,req.flash('error','Credentials not matched.'));
		}
	  }).catch(function(err){
	  	return done(null,false,req.flash('error','Something went wrong.'));
	  });


}));


/*************************************
*   Facebook Local Startegy          *
*************************************/

passport.use(new facebookStrategy({
  clientID: get.fbID,
  clientSecret: get.fbSecret,
  callbackURL: "http://localhost:3000/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'email','picture.type(large)'],
  passReqToCallback : true
},(req,accessToken,refreshToken,profile,done) => {


	db.findData(User,{$or:[{facebookID:profile.id},{email:profile.emails[0].value}]})
	  .then(function(data){
	  	if(data) {
			return done(null,data);
		}else{

			var newUser = new User();
				newUser = methods.saveUser(profile,newUser);
				newUser.facebookID = profile.id;
				newUser.fbToken.push({token:accessToken});
				newUser.save((err) => {
					if(err) throw err;
					return done(null,newUser);
				});
		}
	  })
	  .catch(function(err){
	  		return done(null,false,req.flash('error','Something went wrong.'));
	  });

  	}
));



/*************************************
*       Google Local Startegy            
*************************************/

passport.use(new googleStrategy({
    clientID: get.gID,
    clientSecret: get.gSecret,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(req,accessToken, refreshToken, profile, done) {
	db.findData(User,{$or:[{googleID:profile.id},{email:profile.emails[0].value}]})
	  .then(function(data){
	  	if(data) {
			return done(null,data);
		}else{
			var newUser = new User();
				newUser = methods.saveUser(profile,newUser);
				newUser.image = newUser.image.split("?")[0];
				newUser.googleID = profile.id;
				newUser.googleToken.push({token:accessToken});
				
				newUser.save((err) => {
					if(err) throw err;
					return done(null,newUser);
				});
		}
	  })
	  .catch(function(err){
	  		return done(null,false,req.flash('error','Something went wrong.'));
	  });   
  }
));
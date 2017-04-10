var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var facebookStrategy = require('passport-facebook').Strategy;
var googleStrategy = require('passport-google-oauth20').Strategy;
var bcrypt = require('bcrypt');

var User = require('../models/user');
var get  = require('./smtp-cred');
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

	User.findOne({email:email},function(err,user){
		if(err) done(null,false,req.flash('error','Something went wrong.'));
		if(!user) done(null,false,req.flash('error','Credentials not matched.'));
		if(bcrypt.compareSync(password,user.password)){
			return done(null,user);
		} else{
		   return done(null,false,req.flash('error','Credentials not matched.'));
		}
	});

}));


/*************************************
*   Facebook Local Startegy          *
*************************************/

passport.use(new facebookStrategy({
  clientID: get.fbID,
  clientSecret: get.fbSecret,
  callbackURL: "http://localhost:3000/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'photos', 'email'],
  passReqToCallback : true
},(accessToken,refreshToken,profile,done) => {


	User.findOne({$or:[{facebookID:profile.id},{email:profile.emails[0].value}]},(err,user) => {
		if(err) done(null,false,req.flash('error','Something went wrong.'));
		if(user) {
			return done(null,user);
		}else{

			var hash = methods.token(profile.emails[0].value);
			var newUser = new User();
				newUser = methods.saveUser(profile,newUser,hash);
				newUser.facebookID = profile.id;
				newUser.fbToken.push({token:accessToken});
				
				newUser.save((err) => {
					if(err) done(null,false,req.flash('error','Something went wrong.'));
					return done(null,newUser);
				});
		}
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
  function(accessToken, refreshToken, profile, done) {

  	User.findOne({$or:[{googleID:profile.id},{email:profile.emails[0].value}]},(err,user) => {
		if(err) done(null,false,req.flash('error','Something went wrong.'));
		if(user) {
			return done(null,user);
		}else{




			var hash = methods.token(profile.emails[0].value);
			var newUser = new User();
				newUser = methods.saveUser(profile,newUser,hash);
				newUser.googleID = profile.id;
				newUser.googleToken.push({token:accessToken});
				
				newUser.save((err) => {
					if(err) done(null,false,req.flash('error','Something went wrong.'));
					return done(null,newUser);
				});
		}
	});
     
  }
));
var express = require('express');
var router = express.Router();
var middleware = require('../middlewares/middleware');
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt');

var User   = require('../models/user');
var get    = require('../secure/smtp-cred');
var methods = require('../secure/methods');

/* GET login */
router.get('/', function(req, res, next) {
  res.render('index',{title:"Community Network | Login",header:false,navbar:false});
});



/* GET signup */

router.get('/signup',function(req,res,next){
	res.render('signup',{title:"Community Network | Sign Up",header:false,navbar:false});
});


/* POST send token */

router.post('/sendToken',function(req,res,next){

    var data;

    if(req.body.email == ""){
         data = {msg:"Email address required.",param:"",success:false};
         res.send(data);
    }else{
    
        req.checkBody('email','Email already exist').isExist_email();

        req.getValidationResult()
           .then(function(result){

              var error = result.array();
              var data;

              if(error.length == 0){
                data = {msg:"Email address not found.",success:false};
                res.send(data);
              }else{

                /*
                * Send reset token to user - Nodemailer START
                */

                    // Generating Token
                  
                     var hash = methods.token(req.body.email);

                      var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: get.username,
                                pass: get.password
                            },
                            tls: {
                                rejectUnauthorized : false
                            }
                        });

                        var mailOptions = {
                            from     : 'Community Network',
                            to       :  req.body.email, 
                            subject  : 'PASSWORD RESET', 
                            html     : `<h1>RESET PASSWORD</h1>
                                        <p>Your request for password reset is approved.Click <a href="http://localhost:3000/reset/${req.body.email}/${hash}">here</a> to activate.Valid for 5 minutes only.</p>
                                        `
                        };


                        transporter.sendMail(mailOptions, (error, info) => {

                            if (error) throw err;
                            
                            // save user to db

                            User.findOneAndUpdate(
                                    {email:req.body.email},
                                    {$set: {resetToken:hash,expireToken:Date.now() + 60*30*1000}},
                                    (err,user)=>{
                                        
                                        if(err) data = {msg:"Something went wrong.",success:false};

                                        if(user) data = {msg:"Check your email for the reset link.",success:true};
                                            
                                        res.send(data);
                                    });
                                 
                        });
                  
                    /**
                    * Send reset token to user - Nodemailer END
                    **/

          }


       });

    }


});

/* POST Register User */

router.post('/register',middleware.validation,function(req,res,next){
	
	var hash = methods.token(req.body.email);

    var userData = {
    		fullname  	 : req.body.fullname,
    		username  	 : req.body.username,
    		email 	  	 : req.body.email,
    		password  	 : req.body.password,
    		accountToken : hash

    };

    /**  
    *  Sending activation tokento user for account activation. - START
    **/

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: get.username,
                pass: get.password
            },
            tls: {
                rejectUnauthorized : false
            }
        });

        var mailOptions = {
            from     : 'Community Network',
            to       :  userData.email, 
            subject  : 'Account Acivation', 
            html     : `<h1>Account Activation</h1>
                        <p>Hello <b>${userData.fullname}</b>.<br>Your account has been successfully created and to make 
                        a use of it you have to activate your account by clicking <a href="http://localhost:3000/activate/${userData.username}/${userData.accountToken}">here</a>.</p>
                        `
        };


        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            // console.log('Message %s sent: %s', info.messageId, info.response);
            // save user to db
             var newUser = new User(userData);
                 newUser.save((err) => {
                    if(err) throw err;
                    var data = {msg:"Account created successfully.Check your email for activation.",param:"",success:true};
                    res.send(data);
                 });
        });


    /**  
    *  Sending activation tokento user for account activation. - END
    **/


});


/*POST Rest Password*/

router.post('/reset/:user/:token',function(req,res,next){
    
    req.checkBody('newPassword','All fields are mandatory.').notEmpty();
    req.checkBody('confirmPassword','All fields are mandatory.').notEmpty();
    req.checkBody('newPassword','Password must be greater than 7 characters.').len(8);
    req.assert('confirmPassword','Password not matched').equals(req.body.newPassword); 

    req.getValidationResult().then(function(result) {
       var error = result.array();
       if(error.length > 0){
         req.flash('error',error[0].msg);
         res.redirect('/reset/'+req.params.user+'/'+req.params.token);
       }else{
             User.findOneAndUpdate(
                {$and : [{email:req.params.user},{resetToken:req.params.token}]},
                {$set:{expireToken: Date.now(),resetToken: "",password:bcrypt.hashSync(req.body.newPassword, 10)}},
                (err,user) => {
                    if(err) throw err;
                    if(!user) req.flash('error','Something went wrong.');
                    if(user) req.flash('success','Password reset successfully.');
                    res.redirect('/');

            });
       }
    });

});


module.exports = router;

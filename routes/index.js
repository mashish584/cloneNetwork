var express = require('express');
var router = express.Router();
var middleware = require('../middlewares/middleware');
var crypto = require('crypto'); 
var nodemailer = require('nodemailer');

var User   = require('../models/user');
var get    = require('../secure/smtp-cred');

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


module.exports = router;

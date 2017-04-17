
var bcrypt = require('bcrypt');

// Express Validator middleware

function reg_valid(req,res,next){

	req.sanitize("fullname").trim();
	req.sanitize("username").trim();
	req.sanitize("email").trim();

	req.checkBody({

		'fullname' : { 
						notEmpty : true, 
						isLength : {
							options : [{ min:5 , max : 25 }],
							errorMessage : "Fullname must be between 5 to 25 characters"
						},
						errorMessage: 'Fullname is required' 
					 },

		'username' : { 
						notEmpty : true, 
						isLength : {
							options : [{ min:5 , max : 12 }],
							errorMessage : "Username must be between 5 to 12 characters"
						},
						errorMessage: 'Username is required' 
					 },

		'email'    : { 
						notEmpty:true,
						isEmail : {
							errorMessage : 'Invalid Email Address'
						},
						errorMessage:'Email is required'  
					 },
		'password' : { 
						notEmpty : true, 
						isLength : {
							options : [{min:8}],
							errorMessage : "Password must be greater than 7 characters"
						},
						errorMessage: 'Password is required' 
					 },

		'confirm' : { 
						notEmpty : true, 
						errorMessage: 'Confirm Password is required' 
					 }
	});

	req.checkBody('email','Email already exist').isExist_email();
	req.assert('confirm','Password not matced').equals(req.body.password); 

	req.asyncValidationErrors().then(function(){
			next();
	},function(errors){
		if(errors){
			res.send(errors[0]);
		}
	});

}

function login_valid(req,res,next){

    if(req.body.email == "" || req.body.password == ""){
         req.flash('error','All fields are mandatory.');
	     res.redirect('/');
    }else{
    
        req.checkBody('email','Email already exist').isExist_email();

        req.getValidationResult()
           .then(function(result){

              var error = result.array();

	              if(error.length == 0){
	                req.flash('error','Credentials not matched.');
	                res.redirect('/');
	              }else{
	              	next();
	              }
            });
      }
}


function update_Valid(req,res,next){

	req.sanitize("fullname").trim();
	req.sanitize("username").trim();
	req.sanitize("bio").trim();

	req.checkBody({

		'fullname' : { 
						notEmpty : true, 
						isLength : {
							options : [{ min:5 , max : 25 }],
							errorMessage : "Fullname must be between 5 to 25 characters"
						},
						errorMessage: 'Fullname is required' 
					 },

		'username' : { 
						notEmpty : true, 
						isLength : {
							options : [{ min:5 , max : 12 }],
							errorMessage : "Username must be between 5 to 12 characters"
						},
						errorMessage: 'Username is required' 
					 },

		'bio'      : {
						notEmpty : true, 
						isLength : {
							options : [{ min:25,max:120}],
							errorMessage : "Bio should be between 25-120 characters"
						},
						errorMessage: 'Bio is required'

					 }

	});

	req.getValidationResult()
           .then(function(result){

              var errors = result.array();

	              if(errors.length == 0){
	               	next();
	              }else{
	              	res.send(errors[0]);
	              }
            });

}



function change_valid(req,res,next){


	var userPassword  = req.user.password;
	var oldPassword = req.body.oldPassword;
	var newPassword = req.body.newPassword;
	var confirm = req.body.confirm;


	if(userPassword == ""){
		if(newPassword == "" || confirm == ""){
			return res.send({msg:"All fields are mandatory.",success:false});
		}
		
	}else{

		if(oldPassword == "" || newPassword == "" || confirm == ""){
			return res.send({msg:"All fields are mandatory.",success:false});
		}

		if(!bcrypt.compareSync(oldPassword,userPassword)){
			return res.send({msg:"Old password is incorrect.",success:false});
		}

		if(bcrypt.compareSync(newPassword,userPassword)){
			return res.send({msg:"Old and new Password can't be same.",success:false});
		}
	}

		
		if(newPassword.length < 7){
			return res.send({msg:"Password must be more than 7 characters.",success:false});
		}

		if(newPassword !== confirm){
			return res.send({msg:"Password not matched",success:false});
		}



		next();

	}



/*
*	PROTECTING PAGES - SESSION USER
*/

function isAllowed(req,res,next){

	if(req.user){

		if(req.user.status == 0){
			return res.redirect('/logout');
		}

		next();

	}else{
		res.redirect('/');
	}
	
}

function notAllowed(req,res,next){
	
	return  (!req.user) ? next():res.redirect('/home');
}


/*
	Protecting follow
*/

function isFollowing(req,res,next){

    var isUser = req.user.following.find(following => following == req.body.id);

	if(isUser){
		 return res.send({msg:'Denied',success:false});
	}


	next();

}

/*
	Protecting unfollow
*/

function notFollowing(req,res,next){

    var isUser = req.user.following.find(following => following == req.body.id);

	if(!isUser){
		 return res.send({msg:'Denied',success:false});
	}


	next();

}



/*
* Exporting all the modules
*/

module.exports.reg_valid = reg_valid;
module.exports.login_valid = login_valid;
module.exports.isAllowed = isAllowed;
module.exports.notAllowed = notAllowed;
module.exports.update_Valid = update_Valid;
module.exports.change_valid = change_valid;
module.exports.isFollowing = isFollowing;
module.exports.notFollowing = notFollowing;


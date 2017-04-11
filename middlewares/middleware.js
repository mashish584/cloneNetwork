

// Express Validator middleware

function reg_valid(req,res,next){

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

	req.assert('confirm','Password not matced').equals(req.body.password); 
	req.checkBody('email','Email already exist').isExist_email();

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





/*
*	PROTECTING PAGES - SESSION USER
*/

function isAllowed(req,res,next){

	if(req.user){
		
		if(req.user.status == 0){
  			res.redirect('/logout');
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
* Exporting all the modules
*/

module.exports.reg_valid = reg_valid;
module.exports.login_valid = login_valid;
module.exports.isAllowed = isAllowed;
module.exports.notAllowed = notAllowed;
module.exports.update_Valid = update_Valid;



// Express Validator middleware

function validation(req,res,next){

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
							errorMessage : "Password must be greater than 8 characters"
						},
						errorMessage: 'Password is required' 
					 },

		'confirm' : { 
						notEmpty : true, 
						errorMessage: 'Confirm Password is required' 
					 }
	});

	req.assert('confirm','Password not matced').equals(req.body.password); 
	req.checkBody('username','Username already exist').isExist_username();
	req.checkBody('email','Email already exist').isExist_email();

	req.asyncValidationErrors().then(function(){
			next();
	},function(errors){
		if(errors){
			res.send(errors[0]);
		}
	});

}


/*
* Exporting all the modules
*/

module.exports.validation = validation;
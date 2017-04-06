
'use-strict';

// declaration

const signup = document.querySelector('#signup');


// formHandling functions

function register_user(e){

	// stop default action
	e.preventDefault();

}


// assigning events

if(signup) signup.addEventListener('submit',register_user);

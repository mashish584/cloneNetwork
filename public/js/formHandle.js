
'use-strict';

// declaration

const signup = document.querySelector('#signup');


// formHandling functions

function register_user(e){

	// stop default action
	e.preventDefault();

	const  button = this.children[this.children.length-1];

	//Form Handling with ajax

	$.ajax({

		url      : '/register',
		method 	 : 'POST',
		data   	 :  $(this).serialize(),
		dataType :  'json',

		beforeSend : function(http){
			button.style.opacity = '0.8';
			button.setAttribute("disabled", "true");
		},
		success    : function(response,status,http){
			let message = response.msg,
				element = response.param,
				flashModal = document.querySelector('#flashModal .modal-body');

			document.querySelector(`[name=${element}]`).value = "" ;
			
			flashModal.innerHTML = `<div id="error" class="flash">
                        			  <i class="fa fa-times-circle"></i>
                          			  <p class="lead">${message}</p>
                      				</div>`;

            //show flashModal
            $('#flashModal').modal('show');

            // set as default
            button.style.opacity = '1';
			button.removeAttribute("disabled");

		},
		error  : function(http,status,error){

		}

	});

}


// assigning events

if(signup) signup.addEventListener('submit',register_user);

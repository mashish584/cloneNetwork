
'use-strict';

// declaration

const signup = document.querySelector('#signup');
const resetToken  = document.querySelector('#reset'); 
const signIn = document.querySelector('#signIn'); 


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
				success = response.success,
				id      = "error",
				icon   = "fa-times-circle",
				flashModal = document.querySelector('#flashModal .modal-body');

			if(element)  document.querySelector(`[name=${element}]`).value = "" ;

			if(success) {
				id = "success";
				icon = "fa-check-square";
			    document.querySelector("form").reset();
			} 
			
			flashModal.innerHTML = `<div id="${id}" class="flash">
                        			  <i class="fa ${icon}"></i>
                          			  <p class="lead" style="color:#a9a9a9">${message}</p>
                      				</div>`;

            //show flashModal
            $('#flashModal').modal('show');

           if(success){
           		 window.addEventListener("click", function(){
           		 	window.location.href = "/";
            	 });
           }
            	

            // set as default
            button.style.opacity = '1';
			button.removeAttribute("disabled");
  

		},

		error  : function(http,status,error){
				flashModal.innerHTML = `<div id="error" class="flash">
                        			 		 <i class="fa fa-times-circle"></i>
                          			  		<p class="lead" style="color:#a9a9a9">Something went wrong.</p>
                      					</div>`;
                // set as default
	            button.style.opacity = '1';
				button.removeAttribute("disabled");
		}

	});

}


function send_Token(e){
	//stop default action
	e.preventDefault();

	const  button = this.children[this.children.length-1];


	//send token request to post route

	$.ajax({
		url : '/sendToken',
		method : 'POST',
		data : $(this).serialize(),
		dataType : 'json',

		beforeSend : function(http){
			button.style.opacity = "0.4";
			button.setAttribute("disabled", "true");
			button.textContent = "Sending";
		},

		success : function(response,status,http){
			let message = response.msg,
				success = response.success;

			if(success) {
				document.querySelector('#flash').innerHTML = `<p class="lead" style="color:#8bc34a;font-size:1em;font-weight:500;">${message}</p>`;
				resetToken.reset();
			}else{
				document.querySelector('#flash').innerHTML = `<p class="lead" style="color:#f44336;font-size:1em;font-weight:500;">${message}</p>`;
				resetToken.reset();
			}

			//set default
			button.style.opacity = "1";
			button.removeAttribute("disabled");
			button.textContent = "Reset";

		},

		error : function(http,status,error){
			document.querySelector('#flash').innerHTML = `<p class="lead" style="color:#f44336;font-size:1em;font-weight:500;">Something wents wrong.</p>`;
			resetToken.reset();
		}
	});
	
}


// assigning events

if(signup) signup.addEventListener('submit',register_user);
if(resetToken) resetToken.addEventListener('submit',send_Token);


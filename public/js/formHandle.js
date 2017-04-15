
'use-strict';

// declaration

const signup = document.querySelector('#signup');
const resetToken  = document.querySelector('#reset'); 
const signIn = document.querySelector('#signIn'); 
const updateBtn = document.querySelector('.btn-save');
const searchBtn = document.querySelector('.searchUser');
const flwParent = document.querySelector('#flw-delg');
const followers = document.querySelector('.followers');
const postForm = document.querySelector('#post-form');



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



function update_user(){


  let fullname = document.querySelector('[name="fullname"]');
  let username =  document.querySelector('[name="username"]');
  let bio =  document.querySelector('[name="bio"]');

  let data = {fullname:fullname.value,username:username.value,bio:bio.value};

  $.ajax({
  	 method : 'POST',
  	 data :   data,
  	 dataType : 'json',
  	 
  	 beforeSend : function(){
  	 	document.querySelector('.btn-save').style.opacity = "0.7";
  	 },

  	 success : function(response){
  	 	
  	 	let message = response.msg,
  	 	    success = response.success,
  	 	    html;

  	 	if(success) {

  	 	    html =  `<div class="alert alert-success " role="alert">
                      ${message}
                    </div>`;
          document.querySelector("#updateForm .lead").textContent = bio.value;
          document.querySelector("#updateForm b").textContent = username.value;
          document.querySelector("#updateForm span").textContent = fullname.value;

  	 	}else{
  	 		 html =  `<div class="alert alert-danger " role="alert">
                    	  ${message}
                      </div>`;
  	 	}

  	 	document.querySelector('#flash').innerHTML = html;
  	 	document.querySelector('.btn-save').style.opacity = "1";

  	 },
  	 error: function(){
  	 	var html =  `<div class="alert alert-danger" role="alert">
                      Something went wrong.
                    </div>`;

            document.querySelector('#flash').innerHTML = html;

  	 }
  });


}

function change_password(id){

  let oldPassword = document.querySelector('[name="oldPassword"]');
  let newPassword =  document.querySelector('[name="newPassword"]');
  let confirm =  document.querySelector('[name="confirmPassword"]');


  let data = {oldPassword:oldPassword.value,newPassword:newPassword.value,confirm:confirm.value};

  $.ajax({
  	 url : '/change_password/'+id,
  	 method : 'POST',
  	 data :   data,
  	 dataType : 'json',
  	 
  	 beforeSend : function(){
  	 	document.querySelector('.btn-change').style.opacity = "0.7";
  	 },

  	 success : function(response){
  	 	
  	 	let message = response.msg,
  	 	    success = response.success,
  	 	    html;

  	 	if(success) {

  	 	    html =  `<div class="alert alert-success " role="alert">
                      ${message}
                    </div>`;

  	 	}else{
  	 		 html =  `<div class="alert alert-danger " role="alert">
                    	  ${message}
                      </div>`;
  	 	}

  	 	document.querySelector('#flash').innerHTML = html;
  	 	document.querySelector('#updateForm').reset();
  	 	document.querySelector('.btn-change').style.opacity = "1";

  	 },
  	 error: function(){
  	 		var html =  `<div class="alert alert-danger " role="alert">
                      Something went wrong.
                    </div>`;

        document.querySelector('#flash').innerHTML = html;
  	 }
  });

}

function updatePhoto(){
  
  var formData = new FormData();
      formData.append('upload',imgDialog.files[0]);
      
      $.ajax({
        url:'/upload',
        type: 'POST',
        data : formData,
        processData : false,
        contentType : false,
        beforeSend : function(){
          document.querySelector('.bio img').style.opacity  = '0.5';
        },
        success:function(response){
            let message = response.msg,
                success = response.success,
                image   = response.image;

            if(success) {

              window.alert(message);
              document.querySelector('.bio img').setAttribute('src',`../images/profile/${image}`);

            }else{

              window.alert(message);
            
            }

            document.querySelector('.bio img').style.opacity  = '1';
        }  
      });

}


function findUser(){

  let userId = document.querySelector('[type="hidden"]').value;


  $.ajax({
      url: '/findUser',
      type : 'GET',
      data : {term : this.value},
      dataType : 'json',
      success : function(response){


        let users = response;
        let data = users.map(user => {
           let html  = `<li>
                        <a href="/profile/${user._id}">`;
            if(user.image.includes("http")){
              html += `<img src="${user.image}" alt="" class="mr-3 mt-2">`;
            }else{
              html += `<img src="../images/profile/${user.image}" alt="" class="mr-3 mt-2">`
            }
              html += `<b>${user.fullname}</b>`;
              if(userId == user._id){
                html += `<i class="mr-3">(you)</i>`;
              }
              html +=  `<span>${user.username}</span>
                        <span class="sm-msg">Followed by ${user.followers.length} persons.</span>
                      </a>
                  </li>`;

              if(window.innerWidth < 768){
                html = `<li class="px-2 py-4">
                          <a href="/profile/${user._id}" style="position:relative;">`;

            if(user.image.includes("http")){

                html += `<img src="${user.image}" alt="" class="mr-3" style="width:70px;height:70px">`;
            
            }else{

                html += `<img src="../images/profile/${user.image}" alt="" class="mr-3" style="width:70px;height:70px">`;
            
            }

                 html  +=  `<b style="position:absolute;top:2%;color:#222">${user.fullname}</b>
                            <span class="mt-2">${user.username}</span>`;

            if(userId != user._id){
              isFollow = user.followers.find(user => user == userId );
              if(!isFollow){
                 html +=    `<button id="follow" data-user='{"id":"${user._id}"}' name="button" class="btn btn-info btn-sm" style="text-transform:uppercase;letter-spacing:1px;position: absolute;top: 17%;right:5%;">Follow</button>`;
              }else{
                   html +=    `<button id="unfollow" data-user='{"id":"${user._id}"}' name="button" class="btn btn-danger btn-sm" style="text-transform:uppercase;letter-spacing:1px;position: absolute;top: 17%;right:5%;">Unfollow</button>`;
              }
            }

                 html  +=  `</a>
                            </li>`;
              }

            return html;
        }).join("");

        document.querySelector('.sub-search').style.display = 'block';
        if(response.length>0){
            document.querySelector('.sub-search').innerHTML = (window.innerWidth>768) ? `<ul>${data}</ul>`: data;
        }else{
          data = `<p class="lead py-2 px-3" style="text-align:center;color:#a9a9a9;"><i class="fa fa-search mr-3"></i>No result found.</p>`;
          document.querySelector('.sub-search').innerHTML = data;
        }
      }
  });

}

function add_follow(e){

  let data = JSON.parse(e.target.dataset.user);

  
  $.ajax({
    url: '/follow',
    method : 'POST',
    data : data,
    dataType : 'json',
    success : function(response){
      if(response.success){
        if(flwParent){
           flwParent.innerHTML = `<button id="unfollow" class="btn-follow" data-user='{"id":"${data.id}"}'><i class="fa fa-user-times"></i> Unfollow</button>`;
           followers.innerHTML = `<b>${parseInt(followers.textContent+1)}</b>`;
         }
        if(subSearch){
          var button = e.target;
          button.setAttribute('id', 'unfollow');
          button.classList.remove('btn-info');
          button.classList.add('btn-danger');
          button.textContent = "unfollow";
        }
      }
    }
  });

}

function delete_follow(e){
  let data = JSON.parse(e.target.dataset.user);
  
  $.ajax({
    url: '/unfollow',
    method : 'POST',
    data : data,
    dataType : 'json',
    success : function(response){
      if(response.success){
        if(flwParent){
          flwParent.innerHTML = `<button id="follow" class="btn-follow" data-user='{"id":"${data.id}"}'><i class="fa fa-user-plus"></i> Follow</button>`;
          followers.innerHTML = `<b>${parseInt(followers.textContent-1)}</b>`;
        }
        if(subSearch){
          var button = e.target;
          button.setAttribute('id', 'follow');
          button.classList.remove('btn-danger');
          button.classList.add('btn-info');
          button.textContent = "follow";
        }

      }
    }
  });

}

function savePost(e){
  
  e.preventDefault();

  // $.ajax({
  //   url: '/savepost',
  //   type : 'post',
  //   data : new FormData(this),
  //   processData : false,
  //   contentType : false,
  //   dataType : 'json',
  //   success : function(response){
  //     console.log(response);
  //   }
  // });

}


// assigning events

if(signup) signup.addEventListener('submit',register_user);
if(resetToken) resetToken.addEventListener('submit',send_Token);
if(cameraBtn) imgDialog.addEventListener('change', updatePhoto);
if(searchBtn) {
  searchBtn.addEventListener('keyup', findUser);
  searchBtn.addEventListener('click',() => {
      document.querySelector('.sub-search').style.display = 'block';
  });
}


function triggerFollow(e){
    
    if(e.target.id == 'follow') {
          e.preventDefault();
          add_follow(e);
    }

   if(e.target.id == 'unfollow') {
      e.preventDefault();
      delete_follow(e);
   }

}


if(subSearch) subSearch.addEventListener('click', e => triggerFollow(e));
if(flwParent)  flwParent.addEventListener('click',e => triggerFollow(e));


// post form

if(postForm) postForm.addEventListener('submit', savePost);





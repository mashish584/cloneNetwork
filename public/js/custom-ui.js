



const bell = document.querySelector('.btn-notification'),
 setting = document.querySelector('.btn-settings'),
 panel_not = document.querySelector('#panel-notification'),
 panel_set = document.querySelector('#panel-settings'),
 parent_panels = document.querySelectorAll('#sub-menu'),
 child_panels = document.querySelectorAll('.sub-panel'),
 container = document.querySelector('.container'),
 swipe_btn = document.querySelector('#swipe'),
 search_btn = document.querySelector('.search'),
 swipe_panel = document.querySelector('#menu-panel'),
 swipeForm = document.querySelector('#updateForm'),
 loadPassForm = document.querySelectorAll('#loadForm'),
 alert        = document.querySelector('.alert'),
 fb  = document.querySelector('#fb'),
 google = document.querySelector('#google');

let panel_on = false;
let set_on = false;

let showPanel = () => {
  if(!panel_on){
    panel_not.style.transform = "translateX(0)";
    panel_on = !panel_on;
  }else{
    panel_not.style.transform = "translateX(100%)";
    panel_on = !panel_on;
  }

};

let showSettings = (e) => {
  e.preventDefault();
  if(!set_on){
    panel_set.style.transform = "scale(1)";
    if(bell) bell.style.display = "none";
    set_on = !set_on;
  }else{
    panel_set.style.transform = "scale(0)";
    if(bell) bell.style.display = "block";
    set_on = !set_on;
  }
};

function toggleSubMenu(){
  const sub = this.querySelector('.sub-panel');
  //remove sh-panel from other panels
  child_panels.forEach(childPanel => {
      if(sub !== childPanel){
        if(childPanel.classList.contains('sh-panel')){
          childPanel.classList.remove('sh-panel');
        }
      }
  });

  sub.classList.toggle('sh-panel');
}


if(bell) bell.addEventListener('click',showPanel);
if(setting) setting.addEventListener('click',showSettings);
if(parent_panels) parent_panels.forEach(parent_panel => parent_panel.addEventListener('click',toggleSubMenu));

if(container){

    container.addEventListener('click',() => {
      child_panels.forEach(childPanel => {
          if(childPanel.classList.contains('sh-panel')){
            childPanel.classList.remove('sh-panel');
          }else{
            return;
          }
      });
    });

}

if(swipe_btn){

  swipeForm.addEventListener('click',(e)=>{
      e.preventDefault();
      if(!e.target.classList.contains('swipe_btn')) return;
      swipeForm.classList.toggle('swipe');
      swipe_panel.classList.toggle('index');
  });

}


// loading html with ajax

function loadHTML(e){
  e.preventDefault();

  $.ajax({
      url  : "/request/html/"+e.target.dataset.get+".html",
      type : "GET",
      dataType : "html",
      beforeSend : function(){

      },
      success : function(response){
        swipeForm.innerHTML = response;
      }
  });
}

if(loadPassForm) loadPassForm.forEach(loadBtn => loadBtn.addEventListener('click',loadHTML));
if(fb) fb.addEventListener('click',() => {
  window.location.href = "/auth/facebook";
});

if(google) google.addEventListener('click',() => {
  window.location.href = "/auth/google";
});
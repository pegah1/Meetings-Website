$(document).ready(function () {

  $('#user_name').html(localStorage.getItem("username")); 
  $('#showpoll').attr("href",'http://localhost:8001/user/'+localStorage.getItem("email")+'/'+localStorage.getItem("cod")
  +'/show/polls');
  $('#signout').click(function(){
  localStorage.clear();
  $('#signout').attr("href",'http://localhost:8001/'+localStorage.getItem("email")+'/signout');
  });
  
  $("#schedul").click(function(){
    localStorage.setItem("editpollFlag",false);
    window.location="schedul.html";
    return false;
  });
  $("#schedul2").click(function(){
    localStorage.setItem("editpollFlag",false);
    window.location="schedul.html";
    return false;
  });
 return false;
});

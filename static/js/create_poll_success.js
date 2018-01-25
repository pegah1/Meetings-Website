$(document).ready(function () {
  
 $('#username').html(localStorage.getItem("username"));
 
 $('#currentpoll').click(function () {
    var datas={"cod":localStorage.getItem("cod"), "email":localStorage.getItem("email"), "pollID":localStorage.getItem("pollID")};
    window.location = "http://localhost:8001/"+localStorage.getItem("email")+"/"+localStorage.getItem("pollID")+"/participate";
    return false;
    
  });
});
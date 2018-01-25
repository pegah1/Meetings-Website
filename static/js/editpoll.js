$(document).ready(function () {
  
 $('#username').html(localStorage.getItem("editpoll_callername"));
 
 $('#currentpoll').click(function () {
    var pollinfo =  JSON.parse(localStorage.getItem("editpollInfo"));
    window.location = "http://localhost:8001/"+pollinfo["caller"]+"/"+pollinfo["id"]+"/participate";
    return false;
    
  });
});
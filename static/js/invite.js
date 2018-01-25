if(localStorage.getItem("login")!= null && localStorage.getItem("login")==='true' ){
    $("#home").attr("href","../profile.html");
  }
console.log(localStorage.getItem("editpollFlag"));
var flag = localStorage.getItem("editpollFlag");

if(flag === 'false'){

 
  $('#first').text("Selected");
    $('#seccond').text("Members");
$('#button').click(function () {

   
  
   var _tags=$("#email-tags").data("tags");
   console.log(_tags);
   //console.log(_tags.length);
   if( typeof _tags !== 'undefined' && _tags && (_tags.length !== 0)){
   //console.log(_tags)
 
   var invite=[];
    for (var i = 0; i < _tags.length; i++) {
          console.log(_tags[i].text);
          invite[i]= _tags[i].text;
    }
    
    
    
    var datas = {"tiltle":localStorage.getItem("title"), "location":localStorage.getItem("location"),
    "description":localStorage.getItem("description"), "invite":invite, 
    "dates":JSON.parse(localStorage["dates"]), "cod":localStorage.getItem("cod"), "email":localStorage.getItem("email"),
    "name":localStorage.getItem("username")};
    
       console.log(datas);
       
    $.ajax({
      type: 'POST',
      url: config.CREATE_POLL_URL,
      data: datas
    })
    
   .done(function (response, err) {
   
      localStorage.setItem("pollID" , response["pollID"]);
      console.log(localStorage.getItem("pollID"));
      window.location = 'http://localhost:8000/create_poll_success.html';
      
      })
    
    .fail(function (response, err) {
      
      if (err) {
        alert('error: ' + response.responseText || '');
      }
     
    });
    
     return false;
      }
      else{
      alert('please fill out the e-mail field!');
      return false;
      }
    });
    }
    
    if(flag === 'true'){
    
    var pollinfo =  JSON.parse(localStorage.getItem("editpollInfo"));
    var guestinfo = JSON.parse(localStorage.getItem("editpoll_guestInfo"));
    console.log(pollinfo);
    console.log(guestinfo);
    
    $('#first').text("Add");
    $('#seccond').text("Member");
    $('#invite').append('<input id="cancel" class="btn" type="submit" value="cancel" />');
    
    $("#button").click(function () {

      var _tags=$("#email-tags").data("tags");
      console.log(_tags);
      
      if( typeof _tags !== 'undefined' && _tags && (_tags.length !== 0)){
      
      var flag_invite=true;
      localStorage.setItem("flag_invite",flag_invite);
      
      var invite=[];
      for (var i = 0; i < _tags.length; i++) {
            console.log(_tags[i].text);
            var index = pollinfo["guests"].indexOf(_tags[i].text);
            console.log(index);
            if(index < 0){
              console.log("not found");
              invite.push( _tags[i].text);
            }
      }
      console.log(invite);
      
      if(invite.length === 0){
        console.log("yes");
        flag_invite=false;
        localStorage.setItem("flag_invite",flag_invite);
        alert('please Select the new membre!');
        return false;
      }
      
      console.log("no");
      console.log(pollinfo["guests"]);
      var update = invite;
      update = update.concat(pollinfo["guests"]);
      console.log(update);
      
      
      var datas={"pollid":pollinfo["id"], "caller":pollinfo["caller"], "title":pollinfo["title"],
      "location":pollinfo["_location"], "description":pollinfo["description"], "dates":pollinfo["dates"],
      "guests":update, "caller_name":localStorage.getItem("editpoll_callername"),
      "change_date":localStorage.getItem("flag_date"), "change_invite":localStorage.getItem("flag_invite"),
      "guestinfo":guestinfo, "add_participate":invite};
      
      console.log(datas);
       
      $.ajax({
        type: 'POST',
        url: config.EDIT_POLL_URL,
        data: datas
      })
      
     .done(function (response, err) {
        window.location = 'http://localhost:8000/editpoll.html';
        })
      
      .fail(function (response, err) {
        
        alert('error: ' + response.responseText || '');
      });
     
      return false;
      
      }
        else{
        alert('please fill out the e-mail field!');
        return false;
        }
        
     });
     
    
     $("#cancel").click(function(){
        window.location = "http://localhost:8001/"+pollinfo["caller"]+"/"+pollinfo["id"]+"/participate";
        return false;
     });
     
     
   }
   
   /*<script src="./lib/jquery-1.11.0.min.js"></script>
<script src="./lib/jquery-ui-1.9.2.custom.min.js"></script>
<script src="jquery.min.js"></script>*/
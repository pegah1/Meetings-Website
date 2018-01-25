$(document).ready(function () {
  
  if(localStorage.getItem("login")!= null && localStorage.getItem("login")==='true' ){
    $("#home").attr("href","profile.html");
  }
  console.log(localStorage.getItem("editpollFlag"));
  var flag = localStorage.getItem("editpollFlag");
  
  if(flag === "true"){
    
    var pollinfo =  JSON.parse(localStorage.getItem("editpollInfo"));
    console.log(pollinfo);
    
    $('#button').append('<button id="button_next" type="submit" style="width:172px;margin-left:7px">Next</button>');
    $('#button').append('<button id="button_finish" type="submit" style="width:172px;margin-left:8px">Finish</button>');
    $('#button').append('<button id="button_cancel" type="submit" style="width:172px;margin-left:8px">Cancel</button>');
    
    
    $("input[name=name]").val(pollinfo["title"]);
    $("input[name=location]").val(pollinfo["_location"]);
    $("textarea").val(pollinfo["description"]);
    
    //
    $("#button_next").click(function(){
      var title=$('input[name="name"]').val();
      var location=$('input[name="location"]').val();
      var description=$('textarea[name="subject"]').val();
      
      pollinfo["title"]=title;
      pollinfo["_location"]=location;
      pollinfo["description"]=description;
      
      console.log(pollinfo);
      
      localStorage.setItem("editpollInfo",JSON.stringify(pollinfo));
      
      
      
      window.location = 'datepicker/datepicker.html';
    return false;
    });
    
    //
    $("#button_cancel").click(function(){
      window.location = "http://localhost:8001/"+pollinfo["caller"]+"/"+pollinfo["id"]+"/participate";
      return false;
    
    });
    
    //
    $("#button_finish").click(function(){
      console.log("finish");
      var title=$('input[name="name"]').val();
      var location=$('input[name="location"]').val();
      var description=$('textarea[name="subject"]').val();
      
      pollinfo["title"]=title;
      pollinfo["_location"]=location;
      pollinfo["description"]=description;
      
      localStorage.setItem("editpollInfo",JSON.stringify(pollinfo));
      console.log(pollinfo);
       console.log("ok");
      var datas={"pollid":pollinfo["id"], "caller":pollinfo["caller"], "title":pollinfo["title"], "location":pollinfo["_location"],
      "description":pollinfo["description"], "dates":pollinfo["dates"], "guests":pollinfo["guests"],
      "name":localStorage.getItem("editpoll_callername"), "change_date": localStorage.getItem("flag_date"),
      "change_invite":localStorage.getItem("flag_invite")};
      
     
      
     $.ajax({
      type: 'POST',
      url: config.EDIT_POLL_URL,
      data: datas
      })
    
      .done(function (response, err) {
        console.log("ok");
        window.location = 'editpoll.html';
      })
      .fail(function (response, err) {
        alert('error: ' + response.responseText || '');
      });
   
      return false;
    });
    
    
  }
  if(flag === "false"){
  
    $('#button').append('<button id="button_next" type="submit" style="width:100%">Next</button>');
    
    $("#button").click(function (form) {
      var title=$('input[name="name"]').val();
      var location=$('input[name="location"]').val();
      var description=$('textarea[name="subject"]').val();
      
      if(title === ""){
        alert('please fill out the tiltle field!');
        return false;
      }
      if(location === ""){
        alert('please fill out the location field!');
        return false;
      }
      localStorage.setItem("title", title);
      localStorage.setItem("location", location);
      localStorage.setItem("description", description);
      
      window.location = 'datepicker/datepicker.html';
      
      return false;
    });
  }
});
$(document).ready(function () {
  console.log(localStorage.getItem("login"));
  if(localStorage.getItem("login")!= null && localStorage.getItem("login")==='true' ){
    $("#home").attr("href","profile.html");
  }
  var vars = [], hash;
  
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  
  for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
 
    var query = JSON.parse(decodeURIComponent(vars.a));

    var pollInfo = query["pollInfo"];
    var guestInfo = query["participateInfo"];
    var pm = query["pm"];
    var email = query["email"];
    
    console.log(guestInfo); 
    console.log(pollInfo);
    console.log(email);
    var max_date_selected=[];
    var user,caller_name;
    var flag = false;
    if(pollInfo["caller"] === email) flag=true;
    
    if(flag){
      $('#editPoll').val("Edit Poll   |");
      $('#delPoll').val("Delete Poll   | ");
    }
    
    $('#count_pm').html(pm.length+'   | ');
    $('#count_contact').html(guestInfo.length);
    $('#pollName').html(pollInfo["title"]);
    $('#where').html(pollInfo["_location"]);
    $('#detail').html(pollInfo["description"]);
    
    
    //create table
    mytable = $('<table></table>').attr({ id: "poll" });
    
       var row = $('<tr></tr>').appendTo(mytable);
       
      $('<th></th>').text("").appendTo(row);
      for(var j=0; j<(pollInfo["dates"].length); j++){
       
        $('<td></td>').attr({ class: "date" }).text(pollInfo["dates"][j]).appendTo(row); 
      }
      
    
      for (var i=0; i<guestInfo.length; i++){
      
      row = $('<tr></tr>').appendTo(mytable);
      
      if(guestInfo[i]["email"] === email){
          user = i;
          $('<td></td>').attr({ class: "name" }).prepend('<input type="text"  name="name'+i+'" value="'+guestInfo[i]["name"]+'" />').appendTo(row); 
        }
        else{
          if(flag){
            $('<td></td>').attr({ class: "name" }).prepend('<i title="Delete Member" id="'+guestInfo[i]["email"]+'-'+i+'" class="deletename" style="cursor:pointer; margin:4px 2px 0 2px">remove_circle</i><input type="text" name="name'+i+'" value="'+guestInfo[i]["name"]+'" disabled/></input>').appendTo(row); 
          }
          else{
            $('<td></td>').attr({ class: "name" }).prepend('<input type="text" name="name'+i+'" value="'+guestInfo[i]["name"]+'" disabled/>').appendTo(row); 
          }
        } 
      if(guestInfo[i]["email"] === pollInfo["caller"]){
          caller_name = guestInfo[i]["name"];
        }
     
      
      //$('<td></td>').attr({ class: "name" }).text(guestInfo[i]["name"]).appendTo(row); 
      for(var j=0; j<(pollInfo["dates"].length); j++){
         max_date_selected[j]=0;
        console.log(guestInfo[i]["dates_flag"][j]);
        if(guestInfo[i]["email"] === email){
          
          if(guestInfo[i]["dates_flag"][j]===true){
            max_date_selected[j]++;
          }
          $('<td></td>').attr({ class: "check-box" }).prepend($('<input />', { type: 'checkbox', id: 'ch'+i+'-'+j, checked: guestInfo[i]["dates_flag"][j] })).appendTo(row);
        }
        else{
        
        if(guestInfo[i]["dates_flag"][j]===true){
          max_date_selected[j]++;
        }
        $('<td></td>').attr({ class: "check-box" }).prepend($('<input />', { type: 'checkbox', id: 'ch'+i+'-'+j, checked: guestInfo[i]["dates_flag"][j], disabled:true })).appendTo(row); 
      }
      }
      }
      
      
      
      
      
      /*var row = $('<tr></tr>').appendTo(mytable);
      $('<th></th>').text("").appendTo(row);
      for(var j=0; j<(guestInfo.length); j++){
        if(guestInfo[j]["email"] === pollInfo["caller"]){
          caller_name = guestInfo[j]["name"];
        }
        if(guestInfo[j]["email"] === email){
          user = j;
          $('<th></th>').attr({ class: "name" }).prepend('<input type="text"  name="name'+j+'" value="'+guestInfo[j]["name"]+'" />').appendTo(row); 
        }
        else{
          if(flag){
            $('<th></th>').attr({ class: "name" }).prepend('<i title="Delete Member" id="'+guestInfo[j]["email"]+'-'+j+'" class="deletename" style="cursor:pointer; margin:4px 2px 0 2px">remove_circle</i><input type="text" name='+j+'" value="'+guestInfo[j]["name"]+'" disabled/></input>').appendTo(row); 
          }
          else{
            $('<th></th>').attr({ class: "name" }).prepend('<input type="text" name="name'+j+'" value="'+guestInfo[j]["name"]+'" disabled/>').appendTo(row); 
          }
        } 
      }
    
    for (var i=0; i<(pollInfo["dates"].length); i++){
      max_date_selected[i]=0;
      row = $('<tr></tr>').appendTo(mytable);
      $('<td></td>').attr({ class: "date" }).text(pollInfo["dates"][i]).appendTo(row); 
      for(var j=0; j<(guestInfo.length); j++){
      
        console.log(guestInfo[j]["dates_flag"][i]);
        if(guestInfo[j]["email"] === email){
          
          if(guestInfo[j]["dates_flag"][i]===true){
            max_date_selected[i]++;
          }
          $('<td></td>').attr({ class: "check-box" }).prepend($('<input />', { type: 'checkbox', id: 'ch'+j+'-'+i, checked: guestInfo[j]["dates_flag"][i] })).appendTo(row);
        }
        else{
        
        if(guestInfo[j]["dates_flag"][i]===true){
          max_date_selected[i]++;
        }
        $('<td></td>').attr({ class: "check-box" }).prepend($('<input />', { type: 'checkbox', id: 'ch'+j+'-'+i, checked: guestInfo[j]["dates_flag"][i], disabled:true })).appendTo(row); 
      }
      }
    
    }*/
    console.log(max_date_selected);
    var max_date = [];
    max_date.push(0);
    
    for(var i=1; i<max_date_selected.length; i++){
    if(max_date_selected[i] === max_date_selected[max_date[0]]){
        max_date.push(i);
      }
      if(max_date_selected[i] > max_date_selected[max_date[0]]){
        max_date=[];
        max_date.push(i);
        console.log(max_date);
      }
      
    }
    var _max_date;
    if(max_date.length === 1){
    $("#sdate").html(pollInfo["dates"][max_date[0]]);
    _max_date = pollInfo["dates"][max_date[0]];
    }
    if(max_date.length>1){
    $("#sdate").html("Several");
    _max_date = "Several";
    }
    console.log(max_date);
    mytable.appendTo("#polldiv");	
    console.log("done tbl");
    
    
    //create comment
    var pm;
    for(var i=0; i<pm.length; i++){
      $("#_footer").append('<p class="pm" id="pm'+i+'"><i class="material-icons">message</i>'+pm[i]["pm"]+'</p>');
      if(flag){
        $("#_footer").append('<p id="ipm'+i+'" class="idpm"><span id="pmname'+i+'">'+pm[i]["name"]+' | </span><span id="pmdate'+i+'">'+pm[i]["time"]+'</span><i title="Delete Message" id="'+pm[i]["email"]+'-'+i+'"  class="deletepm" style="font-size:20px ; cursor:pointer">remove_circle</i></p>');
      }
      else{
        $("#_footer").append('<p id="ipm'+i+'" class="idpm"><span id="pmname'+i+'">'+pm[i]["name"]+' | </span><span id="pmdate'+i+'">'+pm[i]["time"]+'</span></p>');
      }
    }
    console.log("done pm");
    
    
    //save comment
    $("#savepm").click(function(form){
          var pm = $('textarea[name="pm"]').val();
            
          if(pm === ""){
            alert("Please enter a comment in the text area.");
            return false;
          }
          
          // set current Date
          var weekday,dayOfWeek,domEnder,dayOfMonth,months,curMonth,curYear,curHour,curMinute,curSeconds,curMeridiem;
          var objToday = new Date(),
          weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
          dayOfWeek = weekday[objToday.getDay()],
          domEnder = new Array( 'th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th' ),
          dayOfMonth = today + (objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder[objToday.getDate()] : objToday.getDate() + domEnder[parseFloat(("" + objToday.getDate()).substr(("" + objToday.getDate()).length - 1))],
          months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
          curMonth = months[objToday.getMonth()],
          curYear = objToday.getFullYear(),
          curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
          curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
          curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
          curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
        
          var today = curHour + ":" + curMinute + "." + curSeconds + " "+curMeridiem + " " + dayOfWeek + " " + dayOfMonth + " of " + curMonth + ", " + curYear;
          console.log(today);
          console.log(pm);
          
          var datas={"pm":pm, "time":today, "email":email, "pollid":pollInfo["id"], "name":guestInfo[user]["name"],
          "caller":pollInfo["caller"], "pollname":pollInfo["title"], "caller_name":caller_name,
          "group_count":guestInfo.length, "most_date":_max_date};
          
          $.ajax({
          type: 'POST',
          url: config.ADD_COMMENT_URL,
          data: datas
        })
        
        .done(function (response, err) {
       
           window.location = "http://localhost:8001/"+email+"/"+pollInfo["id"]+"/participate";
        })
        .fail(function (response, err) {
          if (err) {
            alert('error: ' + response.responseText || '');
          }
        });
         
        return false;
       
    });
    
    //delete comment
    
    $(".deletepm").click(function(){
      var str = this.id;
      console.log(typeof(str));
      var id_email = str.split("-");
      
     
      var time=$("#pmdate"+id_email[1]).html();
      var email=id_email[0];
      
     
      var datas={"email":email, "poll":pollInfo["id"], "time":time, "caller":pollInfo["caller"]};
      console.log(datas);
      
      $.ajax({
          type: 'POST',
          url: config.DELETE_COMMENT_URL,
          data: datas
        })
        
        .done(function (response, err) {
          console.log("yeees");
       
           window.location = "http://localhost:8001/"+pollInfo["caller"]+"/"+pollInfo["id"]+"/participate";
        })
        .fail(function (response, err) {
          if (err) {
            alert('error: ' + response.responseText || '');
          }
        });
         
        return false;
    });
    
    //delete participate
    
     $(".deletename").click(function(){
      var str = this.id;
      console.log(str);
      var id_email = str.split("-");
      
     
      var email=id_email[0];
      var guests = pollInfo["guests"];
      console.log(guests);
      delete guests[guests.indexOf(email)];
      
      if(guests[0]  == undefined){
        console.log('yes');
        guests=['empty'];
      }
      
      var datas={"email":email, "poll":pollInfo["id"], "guests":guests};
      console.log(datas);
      
     $.ajax({
          type: 'POST',
          url: config.DELETE_PARTICIPATE_URL,
          data: datas
        })
        
        .done(function (response, err) {
          console.log("yeees");
       
           window.location = "http://localhost:8001/"+pollInfo["caller"]+"/"+pollInfo["id"]+"/participate";
        })
        .fail(function (response, err) {
          if (err) {
            alert('error: ' + response.responseText || '');
          }
        });
         
        return false;
    });
    
    //save poll
    $("#savepoll").click(function(form){
        var name = $('input[name="name'+user+'"]').val();
        console.log(name);
        console.log(user);
        var date=[];
        
        for(var i=0; i<pollInfo["dates"].length; i++){
        
          date[i] =document.getElementById('ch'+user+'-'+i).checked;
          
        }
      
      var datas ={"caller":guestInfo[user]["caller"], "poll":guestInfo[user]["poll"], "email":guestInfo[user]["email"],
      "name":name, "dates":date, "caller_email":pollInfo["caller"], "pollname":pollInfo["title"],
      "caller_name":caller_name, "group_count":guestInfo.length, "most_date":_max_date};
      
      console.log(datas);
      $.ajax({
          type: 'POST',
          url: config.SAVE_POLL_URL,
          data: datas
        })
        
        .done(function (response, err) {
       
           window.location = "http://localhost:8001/"+email+"/"+pollInfo["id"]+"/participate";
        })
        .fail(function (response, err) {
          if (err) {
            alert('error: ' + response.responseText || '');
          }
        });
        
      return false;
    });
    
    //edit poll ################################################
    
    $('#editPoll').click(function(){
      
     
      localStorage.setItem("editpollFlag",true);
      localStorage.setItem("editpoll_callername",caller_name);
      localStorage.setItem("editpollInfo",JSON.stringify(pollInfo));
      localStorage.setItem("editpoll_guestInfo",JSON.stringify(guestInfo));
      localStorage.setItem("flag_date",false);
      localStorage.setItem("flag_invite",false);
      
      window.location="schedul.html";
      return false;
      
    });
    
    $('#delPoll').click(function(){
      
      console.log("deletepoll");
      
      if (confirm("Are you sure you want to remove the poll!!?") == true) {
       
        var datas={"id":pollInfo["id"]};
        $.ajax({
            type: 'POST',
            url: config.DELETE_POLL_URL,
            data: datas
          })
          
          .done(function (response, err) {
         
             window.location="deletepoll.html";
          })
          .fail(function (response, err) {
            if (err) {
              alert('error: ' + response.responseText || '');
            }
          });
         
        return false;
      } else {
        return false;
    }
    });
  
});
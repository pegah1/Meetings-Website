$(document).ready(function () {
  if(localStorage.getItem("login")!= null && localStorage.getItem("login")==='true' ){
    $("#home").attr("href","../profile.html");
  }
  var count = 2;
  var add_count= 1;
  var options=["1"];

  console.log(localStorage.getItem("editpollFlag"));
  var flag = localStorage.getItem("editpollFlag");
  console.log(localStorage.getItem("editpoll_callername"));
  
  //flag true #######################################################################
  
  if(flag === 'true'){
   
    var pollinfo =  JSON.parse(localStorage.getItem("editpollInfo"));
    console.log("pollinfo");
    console.log(pollinfo);
    var guestinfo = JSON.parse(localStorage.getItem("editpoll_guestInfo"));
    console.log("guestinfo");
    console.log(guestinfo); 
  
      
     $("#form-horizontal").append('<input id="finish" class="btn" type="submit" value="Finish" />');
     $("#form-horizontal").append('<input  id="cancel" class="btn" type="submit" value="Cancel" />');
     
     $("#date1").val(pollinfo["dates"][0]);
    for(var i=1; i<pollinfo["dates"].length; i++){
    
        var newDateTimePicker = $('<div class="controls input-append date form_datetime" data-date="1979-09-16T05:25:07Z" data-date-format="dd MM yyyy - HH:ii p" data-link-field="dtp_input1" id="div'+count+'">'+
         
         '<input id="date'+count+'" size="16" type="text" value="'+pollinfo["dates"][i]+'" readonly>'+
         '<span class="add-on"><i id="'+count+'" class="icon-remove"></i></span>'+
         '<span class="add-on"><i class="icon-th"></i></span>'+
         '</div>');

          $(newDateTimePicker).insertBefore(".insert");
         newDateTimePicker.datetimepicker({
         //language: 'fr',
         weekStart: 1,
         todayBtn: 1,
         autoclose: 1,
         todayHighlight: 1,
         startView: 2,
         forceParse: 0,
         showMeridian: 1
         });
         
         options.push(count.toString());
         
         count = count+1;
         add_count = add_count+1;
  
    }
    
      
    $("#cancel").click(function(){
      window.location = "http://localhost:8001/"+pollinfo["caller"]+"/"+pollinfo["id"]+"/participate";
      return false;
    
    });
    
    $("#finish").click(function(){
          console.log("finish");
          var dates =[];
          for(var i=0; i<options.length; i++){
           
            console.log($("#date"+options[i]).val());
            if($("#date"+options[i]).val() != ""){
              dates[i]=$("#date"+options[i]).val();
            }
             
          }
           if(dates.length === 0){
              alert('please select date');
              return false;
            }
            
          console.log(JSON.stringify(pollinfo["dates"]));
          console.log(JSON.stringify(dates));
          console.log(JSON.stringify(pollinfo["dates"]) !== JSON.stringify(dates));
          
          if(JSON.stringify(pollinfo["dates"]) !== JSON.stringify(dates)) {
              console.log("dates edited");
              var flag_date=true;
              localStorage.setItem("flag_date",flag_date);
              var date_change = [];
              var index;
              for(var i=0; i< guestinfo.length; i++){
                  date_change=[];
                  console.log(date_change);
                   for(var j=0; j<dates.length; j++){
                      index = guestinfo[i]["dates"].indexOf(dates[j]);
                      console.log(index);
                      if(index > 0 || index ==0 ){
                          date_change[j] = guestinfo[i]["dates_flag"][index];
                      }
                      if(index < 0){
                        date_change[j]=false;
                      }
                  
                }
                guestinfo[i]["dates"] = dates;
                guestinfo[i]["dates_flag"] = date_change;
              }
            
          }
          console.log("edit guestinfo")
          console.log(guestinfo);
          pollinfo["dates"]=dates;
          
          localStorage["editpollInfo"] = JSON.stringify(pollinfo);
          localStorage["editpoll_guestInfo"] = JSON.stringify(guestinfo);
          
      
          var datas={"pollid":pollinfo["id"], "caller":pollinfo["caller"], "title":pollinfo["title"], "location":pollinfo["_location"],
          "description":pollinfo["description"], "dates":pollinfo["dates"], "guests":pollinfo["guests"],
          "caller_name":localStorage.getItem("editpoll_callername"), "change_date":localStorage.getItem("flag_date"),
          "change_invite":localStorage.getItem("flag_invite"), "guestinfo":guestinfo};
          
          console.log("datas");
          console.log(datas);
          
         $.ajax({
          type: 'POST',
          url: config.EDIT_POLL_URL,
          data: datas
          })
        
          .done(function (response, err) {
            console.log("yees");
            window.location = 'http://localhost:8000/editpoll.html';
          })
          .fail(function (response, err) {
            alert('error: ' + response.responseText || '');
          });
        
          return false;
    });

    
    $('#next').click(function () {
          var dates =[];
          for(var i=0; i<options.length; i++){
           
            console.log($("#date"+options[i]).val());
            if($("#date"+options[i]).val() != ""){
              dates[i]=$("#date"+options[i]).val();
            }
             
          }
           if(dates.length === 0){
              alert('please select date');
              return false;
            }  
         
          var flag_date = false;
          var flag_invite = false;
          if(JSON.stringify(pollinfo["dates"]) != JSON.stringify(dates)) {
              console.log("dates edited");
              flag_date = true;
              var date_change = [];
              var index;
              for(var i=0; i< guestinfo.length; i++){
                  date_change=[];
                  console.log(date_change);
                   for(var j=0; j<dates.length; j++){
                      index = guestinfo[i]["dates"].indexOf(dates[j]);
                      console.log(index);
                      if(index > 0 || index ==0 ){
                          date_change[j] = guestinfo[i]["dates_flag"][index];
                      }
                      if(index < 0){
                        date_change[j]=false;
                      }
                  
                }
                guestinfo[i]["dates"] = dates;
                guestinfo[i]["dates_flag"] = date_change;
              }
            
          }
          console.log("edit guestinfo")
          console.log(guestinfo);
          pollinfo["dates"]=dates;
          
          localStorage["editpollInfo"] = JSON.stringify(pollinfo);
          localStorage["editpoll_guestInfo"] = JSON.stringify(guestinfo);
          localStorage.setItem("flag_date",flag_date);
          
          window.location = 'http://localhost:8000/invite/invite.html';
          return false;
        });
    
  }
  
      
      //delete date ########################################################

  $(".icon-remove").live("click",function(form){
       
       $("#div"+this.id).remove();
       
        
        var index = options.indexOf(this.id);
        
        options.splice(index, 1);
        console.log(options);
        return false;
      });
  
  //add date ###########################################################
  
  $('#add').click(function (form) {
     
         var newDateTimePicker = $('<div class="controls input-append date form_datetime" data-date="1979-09-16T05:25:07Z" data-date-format="dd MM yyyy - HH:ii p" data-link-field="dtp_input1" id="div'+count+'">'+
         
         '<input id="date'+count+'" size="16" type="text" value="" readonly>'+
         '<span class="add-on"><i id="'+count+'" class="icon-remove"></i></span>'+
         '<span class="add-on"><i class="icon-th"></i></span>'+
         '</div>');

          $(newDateTimePicker).insertBefore(".insert");
         newDateTimePicker.datetimepicker({
         //language: 'fr',
         weekStart: 1,
         todayBtn: 1,
         autoclose: 1,
         todayHighlight: 1,
         startView: 2,
         forceParse: 0,
         showMeridian: 1
         });
         
         options.push(count.toString());
         
         count = count+1;
         add_count = add_count+1;
         return false;
  });

  //flag false ######################################################################
  
  if(flag === 'false'){
        
       $('#next').click(function () {
          var dates =[];
          for(var i=0; i<options.length; i++){
           
            console.log($("#date"+options[i]).val());
            if($("#date"+options[i]).val() != ""){
              dates[i]=$("#date"+options[i]).val();
            }
             
          }
           if(dates.length === 0){
              alert('please select date');
              return false;
            }  
         
         
          localStorage["dates"] = JSON.stringify(dates);
          console.log(JSON.parse(localStorage["dates"]));
          
          window.location = 'http://localhost:8000/invite/invite.html';
          return false;
        });
  }
  
});
    
   
    
     

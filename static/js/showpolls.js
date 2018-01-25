$(document).ready(function () {

var vars = [], hash;
  
var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  
for(var i = 0; i < hashes.length; i++)
{
  hash = hashes[i].split('=');
  vars.push(hash[0]);
  vars[hash[0]] = hash[1];
}
 
var query = JSON.parse(decodeURIComponent(vars.a));
if(query.length > 0){
console.log(query);
mytable = $('<table></table>').attr({ id: "poll" });

row = $('<tr></tr>').appendTo(mytable);
$('<th style="background-color:#ededfa"></th>').text("Subject").appendTo(row); 
$('<th style="background-color:#ededfa"></th>').text("Location").appendTo(row);  
$('<th style="background-color:#ededfa"></th>').text("Administer").appendTo(row); 
      

var color;
for (var i=0; i<query.length; i++){
      color="#ededfa";
      if(i%2=== 0)  color="#eff9f4"
      row = $('<tr></tr>').appendTo(mytable);
      $('<td style="background-color:'+color+'"></td>').attr({class:"title"}).html('<a href="http://localhost:8001/'+
      localStorage.getItem("email")+'/'+query[i]["id"]+'/participate">'+query[i]["title"]+'</a>').appendTo(row); 
      
      $('<td style="background-color:'+color+'"></td>').attr({class:"location"}).text(query[i]["_location"]).appendTo(row); 
      
      $('<td style="background-color:'+color+'"></td>').attr({class:"admin"}).text(query[i]["caller"]).appendTo(row); 
      
      
      
      }
    


mytable.appendTo("#polldiv");	
}
else{
$("#showpoll").css("margin",0);
$("#polldiv").append("<h1 class='empty'>You have not created any poll yet (at least not while being logged into your Doodle account).</h1>");
$("#polldiv").append("<h2>Polls that you have invite in</h2><hr>");
$("#polldiv").append("<h1 class='empty'>You have not participated in any poll yet (at least not while being logged into your Doodle account).</h1>");
}
});
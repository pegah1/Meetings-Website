$.log = function(message){
  var $logger = $("#logger");
  $logger.html($logger.html() + "\n * " + message );
}
$(function(){
        var location=$('input[name="location"]').val();
        var options = {
          map: ".map_canvas",
          location: location
        };
        
        $("#geocomplete").geocomplete(options);
        
      });
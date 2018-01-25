$(document).ready(function () {

  $('input[name="old_name"]').attr("placeholder",localStorage.getItem("username"));
  
 $('.submit').click(function (form) {
    
    var name=$('input[name="new_name"]').val();
    var email = localStorage.getItem("email");
    
   if(name === ''){
    alert('please fill out the new email field!');
      return false;
   
   }
   
    var datas = {"new_name":name, "email":email, "cod":localStorage.getItem("cod"),
    };
    localStorage.setItem("username",name);
    $.ajax({
      type: 'POST',
      url: config.CHANGE_USERNAME,
      data: datas
    })
    .done(function (response, err) {
    
     
     alert("The Username was changed successfully!");
   
   
    })
    .fail(function (response, err) {
      if (err) {
        alert('error: ' + response.responseText || '');
      }
    });
    return false;
  });
});

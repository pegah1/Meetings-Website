$(document).ready(function () {

var email = localStorage.getItem("forgot_pass_email");
var username = localStorage.getItem("forgot_pass_username");
    
 $('.submit').click(function (form) {
    
    console.log("bale!");
    
    var pass1=$('input[name="new_pass"]').val();
    var pass2=$('input[name="confirm_new_pass"]').val();
    
    
    console.log(email);
    console.log(username);
    if(pass1===""){
     alert("please fill out New Password field");
     return false;
    }
    
    if(pass1!= pass2) {
      alert('please check the password!');
      return false;
    }
    
    var datas={"newpass":pass1, "email":email, "username":username};
    
    $.ajax({
      type: 'POST',
      url: config.FORGOTPASS_RESETPASS,
      data: datas
    })
    
    .done(function (response, err) {
     alert("please check your e-mail!");
   
      window.location = 'signin.html';
   
    })
    .fail(function (response, err) {
      if (err) {
        alert('error: ' + response.responseText || '');
      }
    });
    return false;
  });
});


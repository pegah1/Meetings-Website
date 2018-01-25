$(document).ready(function () {
 
  $('#button1').click(function (form) {
  
    $.ajax({
      type: 'POST',
      url: config.SIGNIN_URL,
      data: $('#signin').serialize()
    })
    
    .done(function (response, err) {
    console.log('heloooo');
      if(response){
      localStorage.setItem("cod" , response["id"]);
      localStorage.setItem("username" , response["username"]);
      localStorage.setItem("email" , response["email"]);
      localStorage.setItem("login" , true);
      
      
      window.location = 'profile.html';
      }
    })
    .fail(function (response, err) {
      if (err) {
        alert('error: ' + response.responseText || '');
      }
    });
    return false;
  });

 
  
  $('#activeCod').click(function (form) {
    
    $.ajax({
      type: 'POST',
      url: config.ACTIVECOD_URL,
      data: $('#signin').serialize()
    })
    .done(function (response, err) {
      alert('we resend activation cod:\n Please check your e-mail and activate your MEETING account');
    })
    .fail(function (response, err) {
      if (err) {
        alert('error: ' + response.responseText || '');
      }
    });
    return false;
  });
  
  $('#forgotPass').click(function (form) {
    var email1=$('input[name="email"]').val();
    $.ajax({
      type: 'POST',
      url: config.FORGOTPASS_URL,
      data: $('#signin').serialize()
    })
    .done(function (response, err) {
      localStorage.setItem("forgot_pass_email" , response.email);
      localStorage.setItem("forgot_pass_username" , response.username);
      window.location = 'forget_pass.html';
    })
    .fail(function (response, err) {
      if (err) {
        alert('error: ' + response.responseText || '');
      }
    });
    return false;
  });
});

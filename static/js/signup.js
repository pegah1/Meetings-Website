$(document).ready(function () {
  //$('#signup').attr('action', config.SIGNUP_URL);
  $('#signup').submit(function () {
    var pass1=$('input[name="password"]').val();
    var pass2=$('input[name="password2"]').val();
    
    if(pass1!= pass2) {
      alert('please check the password!');
      return false;
    }
    $.ajax({
      type: 'POST',
      url: config.SIGNUP_URL,
      data: $('#signup').serialize()
    })
    .done(function (response, err) {
      alert('thanks for registration!\n please check your e-mail');
    })
    .fail(function (response, err) {
      if (err) {
        alert('error: ' + response.responseText || '');
      }
    });
    return false;
  });
});

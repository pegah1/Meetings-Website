$(document).ready(function () {
 $('.submit').click(function (form) {
    var oldpass=$('input[name="old_pass"]').val();
    var newpass=$('input[name="new_pass"]').val();
    var confirmpass=$('input[name="confirm_new_pass"]').val();
    
    if(newpass === ''){
     alert('please fill out the New Password field!');
      return false;
   
    }
    if(newpass!= confirmpass) {
      alert('please check the new password!');
      return false;
    }
    
    datas={"oldpass":oldpass, "newpass":newpass, "email":localStorage.getItem("email"), "cod":localStorage.getItem("cod")};
    $.ajax({
      type: 'POST',
      url: config.CHANGE_PASS,
      data: datas
    })
    .done(function (response, err) {
     alert("The password was changed successfully!");
   
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

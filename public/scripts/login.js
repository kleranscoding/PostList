console.log('sanity-check');

function clearWarning() {
    $('#login_msg').attr('class','');
    $('#login_msg').html('');
}
    

$(document).ready(function() {

    $('#username-email').on('focus',clearWarning);
    $('#password').on('focus',clearWarning);
    

    $('.btn-login-submit').on('click',function(event){
        event.preventDefault();

        var $email= $('#username-email').val();
        var $password= $('#password').val();

        if ($email=='' || $password=='') return;

        var dataObj= {'email': $email,'password': $password};
        
        $.ajax({
            'method': 'POST',
            'url': '/login',
            'data': JSON.stringify(dataObj),
            'dataType': 'json',
            'contentType': 'application/json',
            'success': function (res){
                console.log(res);
                if (res.status==200) { 
                    $('#login_msg').attr('class','');
                    $('#login_msg').html('');
                    $(location).attr('href','/profile');
                } else {
                    $('#login_msg').addClass('alert alert-danger');
                    $('#login_msg').html('incorrect email or password');
                }
            },
            'error': function(e1,e2,e3) { 
                $('#login_msg').addClass('alert alert-danger');
                $('#login_msg').html('incorrect email or password');
            }
        });

    });

});

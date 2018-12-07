console.log('sanity-check');

$(document).ready(function() {

    $('.btn-login-submit').on('click',function(event){
        event.preventDefault();

        var $email= $('#username-email').val();
        var $password= $('#password').val();

        if ($email=='' || $password=='') return;

        var dataObj= {'email': $email,'password': $password};
        console.log(dataObj);
        $.ajax({
            //'method': 'GET',
            //'url': '/api/search/users',
            'method': 'POST',
            'url': '/login',
            'data': JSON.stringify(dataObj),
            'dataType': 'json',
            'contentType': 'application/json',
            'success': function (res){
                console.log(res);
                //$(location).attr('href',`/profile`)
                //if (res.length==0) return;
                //$(location).attr('href',`/profile?=${res[0]._id}`);
            },
            'error': function(e1,e2,e3) { console.log(e1,e2,e3); }
        });

    });

});

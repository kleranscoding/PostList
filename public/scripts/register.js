
var $categories;

function checkEmptyVal(target) { return target.val()==''; }

$(document).ready(function(){

    $.ajax({
        'method': 'GET',
        'url': '/api/category',
        'success': function(categories){
            $categories= categories;
            categories.forEach((cat)=> {
                $('.form-check').append(
                `<label class='form-check-label'>
                  <input type='checkbox' class='form-check-input' data-id='${cat._id}'>
                  ${cat.name}
                 </label>`
                );
            });
        },
        'error': function(e1,e2,e3) { console.log(e1,e2,e3); }
    });

    $('#email').on('blur',function(){
        if ($('#email').val()=='') return;
        $.ajax({
            'method': 'GET',
            'url': '/api/search/users',
            'data': {'email': $('#email').val() },
            'success': function(json){
                console.log(json);
                if (json.length>0) alert('email is taken');
            },
            'error': function(e1,e2,e3) { console.log(e1,e2,e3); }
        });
    });

    $('#confirm_password').on('blur',function(){
        var $password= $('#password').val();
        var $confirm_pwd= $('#confirm_password').val();
        if ($password!='' && $confirm_pwd!='' && $confirm_pwd!=$password) {
            alert('password not match');
        }
    });

    $('#cancel').on('click',function(){ $(location).attr('href','/login'); });

    $('#create').on('click', function(){
        if (checkEmptyVal($('#username'))) return;
        if (checkEmptyVal($('#email'))) return;
        if (checkEmptyVal($('#password'))) return;
        if (checkEmptyVal($('#confirm_pwd'))) return;
        if (checkEmptyVal($('#loc'))) return;
        var $checked= $('div input[type=checkbox]:checked');
        var $selectedCat= [];
        for (var i=0;i<$checked.length;i++) { $selectedCat.push($checked.eq(i).attr('data-id')); }
        console.log($selectedCat);

        var dataObj= {};
        dataObj['username']= $('#username').val();
        dataObj['email']= $('#email').val();
        dataObj['password']= $('#password').val();
        dataObj['location']= $('#loc').val();
        dataObj['img_url']= $('#img_url').val(); 
        dataObj['preference']= $selectedCat;
        
        var today= new Date();
        // get timestamp
        var timestamp= {'year': today.getFullYear(), 'month': today.getMonth()+1, 'day': today.getDay()+1 };
        timestamp['day']= (timestamp['day']>=1 && timestamp['day']<=9)? `0${timestamp['day']}`: timestamp['day'];
        dataObj['join_date']= `${timestamp['year']}-${timestamp['month']}-${timestamp['day']}`;

        $.ajax({
            'method': 'POST',
            'url': '/api/users',
            'dataType': 'json',
            'data': JSON.stringify(dataObj),
            'contentType': 'application/json',
            'success': function(data) {
                console.log(data);
                //if (data.length==0) return;
                $(location).attr('href',`/profile?=${data._id}`);
                //$(location).attr('href','');
            },
            'error': function(err1,err2,err3) { console.log(err1,err2,err3); }
        });

    });

});
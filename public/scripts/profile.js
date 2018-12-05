console.log('sanity check...');

var maxLen= 150;
var $categories;
var $userid;

function startProfilePage() {
    $userid= $(location).attr('href').split('=')[1];
    console.log($userid);
    $.ajax({
        'method': 'GET',
        'url': `/api/users/${$userid}`,
        'success': function(user) {
            getUserInfo(user.user,user.posts);
        },
        'error': function(err1,err2,err3) {
            console.log(err1,err2,err3);
        }
    });
    $.ajax({
        'method': 'GET',
        'url': '/api/category',
        'success': function(categories) {
            $categories= categories;
            categories.forEach((cat)=> {
                $('select[name=cat1]').append(`
                <option value=${cat._id}>${cat.name}</option>
                `);
            });
            $('select[name=pref1]').children().eq(0).attr('selected','selected');
        },
        'error': function(err1,err2,err3) { console.log(err1,err2,err3); }
    });
}

function getPosts(posts,target) {
    console.log(target);
    posts.forEach((post)=> {
        var descrpLen= post.description.length;
        var dots= '';
        if (descrpLen>maxLen) {
            descrpLen= maxLen;
            dots= '...';
        } 
        $(target).append(`
        <article class='post-snippet' data-id='${post._id}'>
          <h3>${post.title}</h3>
          <div class='wrapper'>
            <img src='${post.images[0]}'/>
            <p class='text-truncate'>
              ${post.description.substring(0,descrpLen)}${dots}
              <span type='button' class='learn-more btn btn-info'>
                Learn More
              </span>
            </p>
          </div>
          <button name='delete_post' class='btn btn-danger'>Delete</button>
        </article>
        
        `);
    });
}

function createPostData() {
    var $createPost= $('#modal-post-create');
    var dataObj= {};
    dataObj['title']= $createPost.find('input[name=title]').val();
    if (dataObj['title']=='') return {};
    dataObj['description']= $createPost.find('textarea[name=description]').val();
    if (dataObj['description']=='') return {};
    dataObj['contact_info']= $createPost.find('p[name=email]').html();
    // get categories
    var category= [];
    var $selectedCat= $createPost.find('.more_categories').children();
    for (var i=0;i<$selectedCat.length;i++) {
        category.push($selectedCat.eq(i).find('option:selected').val());
    }
    dataObj['ccategories']= category;
    // get images
    var imgs= [];
    var $imgURLs= $createPost.find('.more_imgs').children();
    for (var i=0;i<$imgURLs.length;i++) {
        imgs.push($imgURLs.eq(i).find('input').val());
    }
    dataObj['images']= imgs;
    var today= new Date();
    // get timestamp
    var timestamp= { 
        'year': today.getFullYear(),
        'month': today.getMonth()+1,
        'day': today.getDay()+1
    };
    timestamp['day']= (timestamp['day']>=1 && timestamp['day']<=9)? `0${timestamp['day']}`: timestamp['day'];
    dataObj['date_of_post']= `${timestamp['year']}-${timestamp['month']}-${timestamp['day']}`;
    console.log(dataObj['date_of_post']);
    return dataObj;
}


function getUserInfo($user,$posts) {
    //$('img[name=img]').src(`${$user.img_url}`);
    $('.welcome').html(`Welcome, <i>${$user.username}</i>`);
    $('[name=username]').html(`${$user.username}`);
    $('[name=email]').html(`${$user.email}`);
    $('[name=location]').html(`${$user.location}`);
    $('[name=join_date]').html(`${$user.join_date}`);
    for (var i=0;i<$user.preference.length;i++) {
        var $pref= $user.preference[i];
        $(`[name=pref${i+1}]`).attr('data-id',$pref._id);
        $(`[name=pref${i+1}]`).html(`${$pref.name}`);
    }
    getPosts($posts,'#user_posts');
    $('#modal-post-create p[name=email]').html(`${$user.email}`);
}

function populateModal(){
    var $article= $(this).parent().parent().parent();
    var $modal= $('#modal-post');
    $modal.modal('toggle');
    // populate post
    $.ajax({
        'method': 'GET',
        'url': `/api/posts/${$article.attr('data-id')}`,
        'success': function(post) {
            var $modalBody= $modal.find('.modal-body');
            $modal.find('.modal-title').html(post.title);
            post.images.forEach((img)=> {
                $modalBody.append(`<img src='${img}'>`)
            });
            var $categories= '';
            post.categories.forEach((cat)=> {
                $categories+= `<span class='label label-info'>${cat.name}</span> `;
            });
            $modalBody.append(`
              <p>Categories: ${$categories} </p>
              <p>Posted By: <span>${post.post_by.username}</span></p>
              <p>Date: <span>${post.date_of_post}</span></p>
              <p>Location: <span>${post.post_by.location}</span></p>
              <p><section><h4>${post.description}</h4></section></p>
              <p>Contact Info: <span>${post.contact_info}</span></p>
            `);
        },
        'error': function(err1,err2,err3) { console.log(err1,err2,err3); }
    });
}

function clearPostModal() {
    var $modal= $('#modal-post');
    $modal.find('.modal-title').html('');
    $modalBody= $modal.find('.modal-body').html('');
}



$(document).ready(function(){
    
    startProfilePage();
    
    $('#create_post').on('click', function(){
        $('#modal-post-create').modal('toggle');
        $('#more_img_url').on('click', function(){
            $('.more_imgs').append(`<p><input type='text' placeholder='image_url'></p>`);
        });
        
    });

    $('#modal-post button[data-dismiss=modal]').on('click',clearPostModal);
    
    $('#user_posts').on('click','.learn-more',populateModal);

    $('button[name=create_post]').on('click', function(event){
        var dataObj= createPostData();
        if (dataObj=={}) return;
        ///*
        $.ajax({
            'method': 'POST',
            'url': `/api/users/${$userid}/posts`,
            'dataType': 'json',
            'data': JSON.stringify(dataObj),
            'contentType': 'application/json',
            'success': function(data) {
                $('#modal-post-create').modal('toggle');
                location.reload();
            },
            'error': function(err1,err2,err3) { console.log(err1,err2,err3); }
        });
        //*/
    });

    $('#user_posts').on('click','button[name=delete_post]',function(){
        var $post_id= $(this).parent().attr('data-id');
        $.ajax({
            'method': 'DELETE',
            'url': `/api/users/${$userid}/posts/${$post_id}`,
            'success': function(data) { location.reload(); },
            'error': function(err1,err2,err3) { console.log(err1,err2,err3); }
        });
    });
    
});

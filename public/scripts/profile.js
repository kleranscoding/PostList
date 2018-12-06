console.log('sanity check...');

const maxLen= 150;
var $categories, $userid, $prefs, $initProfileVal, $postid;



function targetValByName(target,tag1,tag2,name,val) {
    target.find(`${tag1}[name=${name}] ${tag2}`).val(val);
}

function targetHTMLByName(target,tag1,tag2,name,val) {
    target.find(`${tag1}[name=${name}] ${tag2}`).html(val);
}

function getTargetHTMLByName(target,tag1,tag2,name) {
    return target.find(`${tag1}[name=${name}] ${tag2}`).html();
}

function getTargetValByName(target,tag1,tag2,name) {
    return target.find(`${tag1}[name=${name}] ${tag2}`).val();
}

function getCategory() {
    $.ajax({
        'method': 'GET',
        'url': '/api/category',
        'success': function(categories) {
            $categories= categories;
            categories.forEach((cat)=> {
                $('.more_categories').append(
                `<label class='form-check-label'>
                   <input type='checkbox' class='form-check-input' value='${cat._id}'>
                   ${cat.name}
                 </label>
                `);
            });
            $('select[name=pref1]').children().eq(0).attr('selected','selected');
        },
        'error': function(err1,err2,err3) { console.log(err1,err2,err3); }
    });
}

function startProfilePage() {
    $userid= $(location).attr('href').split('=')[1];
    console.log($userid);
    $.ajax({
        'method': 'GET',
        'url': `/api/users/${$userid}`,
        'success': function(user) {
            getUserInfo(user.user,user.posts);
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
        $(target).append(
        `<article class='post-snippet' data-id='${post._id}'>
            <div class='row'>
            <div class='col-md-12'>
                <h3>${post.title}</h3>
            </div> 
            </div> 
            <div class='row'>
            <div class='col-md-4'>
                <img class='img-thumbnail' src='${post.images.length>0? post.images[0]: "assets/postlist_default.jpg"}' />
            </div>  
            <div class='col-md-8'>
                <p class='text-truncate'>
                ${post.description.substring(0,descrpLen)}${dots}
                </p>
                <div class='row'>
                <div class='col-md-2'>
                    <span type='button' class='learn-more label label-info'>
                    Learn More
                    </span>
                </div>
                </div>
            </div>  
            </div>
            <button name='delete_post' class='btn btn-danger'>&times;</button>
        </article>
        `);
    });
}

function createPostData() {
    var $createPost= $('#modal-post-create');
    var dataObj= {};
    dataObj['title']= $createPost.find('input[name=title]').val();
    if (dataObj['title']=='') return null;
    dataObj['description']= $createPost.find('textarea[name=description]').val();
    if (dataObj['description']=='') return null;
    dataObj['contact_info']= $createPost.find('p[name=email]').html();
    // get categories
    var category= [];
    var $checkedCat= $('#modal-post-create input[type=checkbox]:checked');
    //console.log($checkedCat);
    if ($checkedCat.length==0) return null;
    for (var i=0;i<$checkedCat.length;i++) { category.push($checkedCat.eq(i).val()); }
    dataObj['categories']= category;
    // get images
    var imgs= [];
    var $imgURLs= $createPost.find('.more_imgs').children();
    for (var i=0;i<$imgURLs.length;i++) {
        var url= $imgURLs.eq(i).find('input').val();
        if (url!='') imgs.push(url);
    }
    dataObj['images']= imgs;
    var today= new Date();
    // get timestamp
    var timestamp= {'year': today.getFullYear(), 'month': today.getMonth()+1, 'day': today.getDay()+1 };
    timestamp['day']= (timestamp['day']>=1 && timestamp['day']<=9)? `0${timestamp['day']}`: timestamp['day'];
    dataObj['date_of_post']= `${timestamp['year']}-${timestamp['month']}-${timestamp['day']}`;
    //console.log(dataObj['date_of_post']);
    return dataObj;
}


function getUserInfo($user,$posts) {
    $('.welcome').html(`Welcome, <i>${$user.username}</i>`);
    $('img[name=img]').attr('src',`${$user.img_url==''? "assets/postlist_default.jpg" : $user.img_url}`);
    $('#username').html(`${$user.username}`);
    $('#email').html(`${$user.email}`);
    $('#loc').html(`${$user.location}`);
    $('#join_date').html(`${$user.join_date}`);
    for (var i=0;i<$user.preference.length;i++) {
        var $pref= $user.preference[i];
        $('div[name=display_pref]').append(`
        <button data-id='${$pref._id}' class='btn btn-info'>${$pref.name}</button>
        `);
    }
    getPosts($posts,'#user_posts');
    $('#modal-post-create p[name=email]').html(`${$user.email}`);
}


function populateViewModal(){
    var $article= $(this);
    while ($article.prop('tagName')!='ARTICLE') { $article= $article.parent(); }
    $postid= $article.attr('data-id');
    var $modal= $('#modal-post');
    $modal.modal('toggle');
    // populate post
    $.ajax({
        'method': 'GET',
        'url': `/api/posts/${$article.attr('data-id')}`,
        'success': function(post) {
            var $modalBody= $modal.find('.modal-body');
            $modal.find('.modal-title').html(post.title);
            if (post.images.length>0) {
                post.images.forEach((img)=> {
                    $modalBody.find('[name=image-container]')
                    .append(`<img class='img-responsive img-thumbnail' src='${img}'>`);
                });
            } else {
                $modalBody.find('[name=image-container]')
                    .append(`<img class='img-responsive img-thumbnail' src='assets/postlist_default.jpg'>`);
            }
            var $categories= '';
            post.categories.forEach((cat)=> {
                $categories+= `<button class='btn btn-info' data-id='${cat._id}'>${cat.name}</span>`;
            });
            $modalBody.find('p[name=category-container]').append($categories);
            targetHTMLByName($modalBody,'p','span','post-by-container',post.post_by.username);
            targetHTMLByName($modalBody,'p','span','date-container',post.date_of_post);
            targetHTMLByName($modalBody,'p','span','location-container',post.post_by.location);
            targetHTMLByName($modalBody,'p','span','descrp-container',`${post.description}`);
            targetHTMLByName($modalBody,'p','span','contact-container',post.contact_info);
        },
        'error': function(err1,err2,err3) { console.log(err1,err2,err3); }
    });
}

function clearViewModal() {
    $postid= '';
    var $modal= $('#modal-post');
    $modal.find('.modal-title').html('');
    $modal.find('.modal-body').find('[name=image-container]').html('');
    $modal.find('.modal-body').find('p[name=category-container]').html('');
    //$modalBody= $modal.find('.modal-body').html('');
}

function createNewPost() {
    var dataObj= createPostData();
    //console.log(dataObj); console.log(dataObj==null);return;
    if (dataObj==null) return;
    ///*
    $.ajax({
        'method': 'POST',
        'url': `/api/users/${$userid}/posts`,
        'dataType': 'json',
        'data': JSON.stringify(dataObj),
        'contentType': 'application/json',
        'success': function(data) {
            //$('#modal-post-create').modal('toggle');
            location.reload();
        },
        'error': function(err1,err2,err3) { console.log(err1,err2,err3); }
    });
    //*/
}

function instantUpdateByID(field,target,oldTag) {
    // click on area to change
    $(target).on('click',`${oldTag}[id=${field}]`,function(){
        $initProfileVal= $(this).html();
        $(this).replaceWith($(`<input id='${field}' value='${$(this).html()}' required>`));
        $(`${target} input[id=${field}]`).focus();
    });

    $(target).on('blur',`input[id=${field}]`,function(){
        var $text= $(this).val();
        if ($text=='') return;
        $(this).replaceWith($(`<${oldTag} id='${field}'>${$text}</${oldTag}>`));
        if ($text.trim()==$initProfileVal.trim()) return;
        var dataObj={}; dataObj[field]= $text;
        $.ajax({
            'type': 'PATCH',
            'url': `/api/users/${$userid}`,
            'data': JSON.stringify(dataObj),
            'contentType': 'application/json',
            'success': function(output){ location.reload(); },
            'error': function(err1,err2,err3) { console.log(err1,err2,err3); }
        });
    });
}


$(document).ready(function(){
    
    getCategory();

    startProfilePage();
    
    $('#create_post').on('click', function(){
        $('#modal-post-create').modal('toggle');
        $('#more_img_url').on('click', function(){
            $('.more_imgs').append(`<p><input type='text' placeholder='image_url'></p>`);
        });
    });

    $('#modal-post button[data-dismiss=modal]').on('click',clearViewModal);

    $('#modal-post-edit button[name=cancel]').on('click',function(){
        $('#modal-post-edit').modal('toggle');
        $('#modal-post').modal('toggle');
        console.log($('#modal-post-edit').find('div[name=display_cat]'));
        $('#modal-post-edit').find('div[name=display_cat]').html('');
    });
    
    $('#user_posts').on('click','.learn-more',populateViewModal);

    $('button[name=create_post]').on('click',createNewPost);

    $('#user_posts').on('click','button[name=delete_post]',function(){
        var $post_id= $(this).parent().attr('data-id');
        $.ajax({
            'method': 'DELETE',
            'url': `/api/users/${$userid}/posts/${$post_id}`,
            'success': function(data) { location.reload(); },
            'error': function(err1,err2,err3) { console.log(err1,err2,err3); }
        });
    });

    instantUpdateByID('username','div','h4');
    instantUpdateByID('loc','div','h4');
    
    // edit preference
    $('button[name=edit_pref]').on('click',function(){
        $('button[name=close_pref]').css('display','inline-block');
        $('button[name=save_pref]').css('display','inline-block');
        $('button[name=edit_pref]').css('display','none');
        $prefs= $('div[name=display_pref]').children();

        $('div[name=display_pref]').html('');
        for (var i=0;i<$prefs.length;i++) {
            $('div[name=display_pref]')
            .append(
            `<label class='form-check-label'>
               <input type='checkbox' class='form-check-input' value='${$prefs.eq(i).attr('data-id')}' checked>
               ${$prefs.eq(i).html()}
             </label>
             `);
        }
        for (var i=0;i<$categories.length;i++) {
            var cat= $categories[i];
            if ($('div[name=display_pref]').find(`input[value=${cat._id}]`).length>0) continue;
            $('div[name=display_pref]')
            .append(
            `<label class='form-check-label'>
               <input type='checkbox' class='form-check-input' value='${cat._id}'>
               ${cat.name}
             </label>  
            `);
        }
    });

    // close edit preference
    $('button[name=close_pref]').on('click',function(){
        $('button[name=close_pref]').css('display','none');
        $('button[name=save_pref]').css('display','none');
        $('button[name=edit_pref]').css('display','inline-block');
        
        $('div[name=display_pref]').html('');
        for (var i=0;i<$prefs.length;i++) {
            $('div[name=display_pref]').append(`${$prefs.eq(i)[0].outerHTML}`);
        };
    });
    
    // save preference
    $('button[name=save_pref]').on('click',function(){
        var $checked= $('input[type=checkbox]:checked');
        if ($checked.length<1) return;
        
        var $selectedPref= [];
        for (var i=0;i<$checked.length;i++) { $selectedPref.push($checked.eq(i).val()); }
        //console.log($selectedPref);
        var dataObj= {'preference': $selectedPref};
        $.ajax({
            'type': 'PATCH',
            'url': `/api/users/${$userid}`,
            'data': JSON.stringify(dataObj),
            'contentType': 'application/json',
            'success': function(output){ location.reload(); },
            'error': function(err1,err2,err3) { console.log(err1,err2,err3); }
        });

    });

    $('button[name=edit_post]').on('click',function(){
        $('#modal-post').modal('toggle');
        $('#modal-post-edit').modal('toggle');
        var $modalBodyEdit= $('#modal-post-edit .modal-body');
        var $modalBody= $('#modal-post .modal-body');
        var $postCategories= $modalBody.find('p[name=category-container] button');
        $('div[name=display_cat]').html('');
        for (var i=0;i<$postCategories.length;i++) {
            $('div[name=display_cat]').append(
            `<label class='form-check-label'>
               <input type='checkbox' class='form-check-input' value='${$postCategories.eq(i).attr('data-id')}' checked>
               ${$postCategories.eq(i).html()}
             </label>  
            `);
        }
        for (var i=0;i<$categories.length;i++) {
            var cat= $categories[i];
            if ($('div[name=display_cat]').find(`input[value=${cat._id}]`).length>0) continue;
            $('div[name=display_cat]')
            .append(
            `<label class='form-check-label'>
               <input type='checkbox' class='form-check-input' value='${cat._id}'>
               ${cat.name}
             </label>  
            `);
        }
        targetValByName($('#modal-post-edit'),'input','','title',getTargetHTMLByName($('#modal-post'),'h2','','title'));
        targetValByName($modalBodyEdit,'textarea','','descrp',getTargetHTMLByName($modalBody,'p','span','descrp-container'));
        targetValByName($modalBodyEdit,'input','','contact_info',getTargetHTMLByName($modalBody,'p','span','contact-container'));
    });

    $('button[name=save_post]').on('click',function(){
        console.log('update');
        var $checked= $('div input[type=checkbox]:checked');
        console.log($checked.length);
        if ($checked.length<1) return;
        var $modalBodyEdit= $('#modal-post-edit .modal-body');
        var $title= getTargetValByName($('#modal-post-edit'),'input','','title');
        if ($title=='') return;
        var $descrp= getTargetValByName($modalBodyEdit,'textarea','','descrp');
        if ($descrp=='') return;
        $additionalContact= getTargetValByName($modalBodyEdit,'input','','contact_info');
        var $contactInfo= $additionalContact; 
        
        var $selectedCat= [];
        for (var i=0;i<$checked.length;i++) { $selectedCat.push($checked.eq(i).val()); }
        var dataObj= {
            'title': $title,
            'description': $descrp,
            'categories': $selectedCat,
            'contact_info': $contactInfo
        };
        
        $.ajax({
            'type': 'PATCH',
            'url': `/api/users/${$userid}/posts/${$postid}`,
            'data': JSON.stringify(dataObj),
            'contentType': 'application/json',
            'success': function(output){ location.reload(); },
            'error': function(err1,err2,err3) { console.log(err1,err2,err3); }
        });
        
    });
    
});


console.log('sanity check...');

const maxLen= 150;
var $categories, $userid, $prefs, $initProfileVal, $postid;
var $categoryDict= {};


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

function appendCheckBoxToCategory(target,catId,catName,checked) {
    target.append(
    `<label class='form-check-label'>
       <input type='checkbox' class='form-check-input' value='${catId}' ${checked?'checked':''}>
       ${catName}
     </label>`);
}

function getCategory() {
    $.ajax({
        'method': 'GET',
        'url': '/api/category',
        'success': function(categories) {
            $categories= categories;
            categories.forEach((cat)=> {
                appendCheckBoxToCategory($('.more_categories'),cat._id,cat.name,false);
                $categoryDict[cat._id]= cat.name;
            });
            $('select[name=pref1]').children().eq(0).attr('selected','selected');
        },
        'error': function(err1,err2,err3) { console.log(err1,err2,err3); }
    });
}

function startProfilePage() {
    //$userid= $(location).attr('href').split('=')[1];
    //console.log($userid);
    console.log('in profile...');
    $.ajax({
        'method': 'GET',
        'url': '/api/profile',
        'success': function(user) {
            getUserInfo(user.user,user.posts);
        },
        'error': function(err1,err2,err3) { console.log(err1,err2,err3); }
    });
}

function appendPostToList(target,post) {
    var descrpLen= post.description.length;
    var dots= '';
    if (descrpLen>maxLen) {
        descrpLen= maxLen;
        dots= '...';
    } 
    $(target).append(
    `<article class='post-snippet' data-id='${post._id}'>
        <div class='row'><div class='col-md-12'>
            <h3 class='post_title'>${post.title}</h3>
        </div></div> 
        <div class='row'>
        <div class='col-md-4'>
            <img class='img-thumbnail' src='${post.images.length==0? "assets/postlist_default.jpg": post.images[0]}' />
        </div>  
        <div class='col-md-8'>
            <p class='descrp-snippet'>
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
    </article>`
    );
}

function getPosts(postsArray,target) {
    console.log(target);
    postsArray.forEach((post)=> {
        appendPostToList(target,post);
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


function displayPreference(prefArray) {
    $('div[name=display_pref]').html('');
    for (var i=0;i<prefArray.length;i++) {
        var $pref= prefArray[i];
        $('div[name=display_pref]').append(`
        <button data-id='${$pref._id}' class='btn btn-info'>${$pref.name}</button>
        `);
    }
}


function getUserInfo($user,$posts) {
    $('.welcome').html(`hi, <i name='user'>${$user.username}</i>`);
    $('img[name=img]').attr('src',`${$user.img_url==undefined || $user.img_url==''? "assets/postlist_default.jpg" : $user.img_url}`);
    $('#username').html(`${$user.username}`);
    $('#email').html(`${$user.email}`);
    $('#location').html(`${$user.location}`);
    $('#join_date').html(`${$user.join_date}`);
    displayPreference($user.preference);
    getPosts($posts,'#user_posts');
    $('#modal-post-create p[name=email]').html(`${$user.email}`);
}


function renderPost(post) {
    var $modal= $('#modal-post');
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
    var $postCat= '';
    post.categories.forEach((cat)=> {
        if (typeof cat=='object') cat= cat._id;
        $postCat+= `<button class='btn btn-info' data-id='${cat}'>${$categoryDict[cat]}</span>`;
    });
    $modalBody.find('p[name=category-container]').append($postCat);
    targetHTMLByName($modalBody,'p','span','post-by-container',post.post_by.username);
    targetHTMLByName($modalBody,'p','span','date-container',post.date_of_post);
    targetHTMLByName($modalBody,'p','span','location-container',post.post_by.location);
    targetHTMLByName($modalBody,'p','span','descrp-container',`${post.description}`);
    targetHTMLByName($modalBody,'p','span','contact-container',post.contact_info);
}


function populateViewModalByClick(){
    var $article= $(this);
    while ($article.prop('tagName')!='ARTICLE') { $article= $article.parent(); }
    $postid= $article.attr('data-id');
    
    $('#modal-post').modal('toggle');
    // populate post
    $.ajax({
        'method': 'GET',
        'url': `/api/posts/${$article.attr('data-id')}`,
        'success': function(post) {
            renderPost(post);
        },
        'error': function(err1,err2,err3) { console.log(err1,err2,err3); }
    });
}

function clearViewModal() {
    //$postid= '';
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
        'url': `/api/profile/posts`,
        'dataType': 'json',
        'data': JSON.stringify(dataObj),
        'contentType': 'application/json',
        'success': function(post) {
            $('#modal-post-create').modal('toggle');
            appendPostToList($('#user_posts'),post);
            //location.reload();
        },
        'error': function(err1,err2,err3) { console.log(err1,err2,err3); }
    });
    //*/
}

function closeEditPost(){
    $('#modal-post-edit').modal('toggle');
    $('#modal-post').modal('toggle');
    // /console.log($('#modal-post-edit').find('div[name=display_cat]'));
    $('#modal-post-edit').find('div[name=display_cat]').html('');
}

function hideEditPreference(hide) {
    $('button[name=close_pref]').css('display', hide? 'inline-block':'none');
    $('button[name=save_pref]').css('display', hide? 'inline-block':'none');
    $('button[name=edit_pref]').css('display', hide? 'none':'inline-block');
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
        console.log(dataObj);
        $.ajax({
            'type': 'PATCH',
            'url': '/api/profile',
            'data': JSON.stringify(dataObj),
            'contentType': 'application/json',
            'success': function(output){ 
                var key= Object.getOwnPropertyNames(output)[0];
                if (key=='username') { $('i[name=user]').html(output[key]); } 
                $(`#${key}`).html(output[key]);
            },
            'error': function(err1,err2,err3) { console.log(err1,err2,err3); }
        });
    });
}


$(document).ready(function(){
    
    getCategory();

    startProfilePage();
    
    // bringing new post template to front 
    $('#create_post').on('click', function(){
        $('#modal-post-create').modal('toggle');
        $('#more_img_url').on('click', function(){
            $('.more_imgs').append(`<p><input type='text' placeholder='image_url'></p>`);
        });
    });

    // close post view
    $('#modal-post button[data-dismiss=modal]').on('click',clearViewModal);

    // cancel edit post
    $('#modal-post-edit button[name=cancel]').on('click',closeEditPost);
    
    // learn more
    $('#user_posts').on('click','.learn-more',populateViewModalByClick);

    // create new post
    $('button[name=create_post]').on('click',createNewPost);

    // delete post
    $('#user_posts').on('click','button[name=delete_post]',function(){
        var $post_id= $(this).parent().attr('data-id');
        $.ajax({
            'method': 'DELETE',
            'url': `/api/profile/posts/${$post_id}`,
            'success': function(data) { 
                $(`article[data-id=${data._id}]`).remove(); 
                //location.reload();
            },
            'error': function(err1,err2,err3) { console.log(err1,err2,err3); }
        });
    });

    // instant update for username and location
    instantUpdateByID('username','div','span');
    instantUpdateByID('location','div','span');
    
    // edit preference
    $('button[name=edit_pref]').on('click',function(){
        hideEditPreference(true);
        
        $prefs= $('div[name=display_pref]').children();

        $('div[name=display_pref]').html('');
        for (var i=0;i<$prefs.length;i++) {
            appendCheckBoxToCategory($('div[name=display_pref]'),$prefs.eq(i).attr('data-id'),$prefs.eq(i).html(),true);
        }
        for (var i=0;i<$categories.length;i++) {
            var cat= $categories[i];
            if ($('div[name=display_pref]').find(`input[value=${cat._id}]`).length>0) continue;
            appendCheckBoxToCategory($('div[name=display_pref]'),cat._id,cat.name,false);
        }
    });

    // close edit preference
    $('button[name=close_pref]').on('click',function(){
        
        hideEditPreference(false);
        $('div[name=display_pref]').html('');
        for (var i=0;i<$prefs.length;i++) {
            $('div[name=display_pref]').append(`${$prefs.eq(i)[0].outerHTML}`);
        };
    });
    
    // save preference
    $('button[name=save_pref]').on('click',function(){
        var $checked= $('input[type=checkbox]:checked');
        //if ($checked.length<1) return;
        
        var $selectedPref= [];
        for (var i=0;i<$checked.length;i++) { $selectedPref.push($checked.eq(i).val()); }
        //console.log($selectedPref);
        var dataObj= {'preference': $selectedPref};
        $.ajax({
            'type': 'PATCH',
            'url': '/api/profile',
            'data': JSON.stringify(dataObj),
            'contentType': 'application/json',
            'success': function(output){ 
                var key= Object.getOwnPropertyNames(output)[0];
                var prefArray= [], updatedPref= output[key];
                for (var i=0;i<updatedPref.length;i++) {
                    prefArray.push({'_id': updatedPref[i],'name': $categoryDict[updatedPref[i]]});
                }
                hideEditPreference();
                displayPreference(prefArray);
            },
            'error': function(err1,err2,err3) { console.log(err1,err2,err3); }
        });

    });

    // edit post button
    $('button[name=edit_post]').on('click',function(){
        $('#modal-post').modal('toggle');
        $('#modal-post-edit').modal('toggle');
        var $modalBodyEdit= $('#modal-post-edit .modal-body');
        var $modalBody= $('#modal-post .modal-body');
        var $postCategories= $modalBody.find('p[name=category-container] button');
        $('div[name=display_cat]').html('');
        for (var i=0;i<$postCategories.length;i++) {
            appendCheckBoxToCategory($('div[name=display_cat]'),$postCategories.eq(i).attr('data-id'),$postCategories.eq(i).html(),true);
        }
        for (var i=0;i<$categories.length;i++) {
            var cat= $categories[i];
            if ($('div[name=display_cat]').find(`input[value=${cat._id}]`).length>0) continue;
            appendCheckBoxToCategory($('div[name=display_cat]'),cat._id,cat.name,false);
        }
        targetValByName($('#modal-post-edit'),'input','','title',getTargetHTMLByName($('#modal-post'),'h2','','title'));
        targetValByName($modalBodyEdit,'textarea','','descrp',getTargetHTMLByName($modalBody,'p','span','descrp-container'));
        targetValByName($modalBodyEdit,'input','','contact_info',getTargetHTMLByName($modalBody,'p','span','contact-container'));
    });

    // save edit post
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
        var dataObj= {};
        dataObj['title']= $title; dataObj['description']= $descrp; 
        dataObj['categories']= $selectedCat; dataObj['contact_info']= $contactInfo;
        
        $.ajax({
            'type': 'PATCH',
            'url': `/api/profile/posts/${$postid}`,
            'data': JSON.stringify(dataObj),
            'contentType': 'application/json',
            'success': function(post){ 
                location.reload(); return;
                //console.log(post); 
                closeEditPost();
                clearViewModal();
                renderPost(post);
                var $thisPost= $('#user_posts').find(`article[data-id=${$postid}]`);
                console.log($thisPost);
                $thisPost.find('.post_title').html(post.title);
                $thisPost.find('.img-thumbnail').attr('src',post.images.length>0? post.images[0]: "assets/postlist_default.jpg");
                var descrpLen= post.description.length;
                var dots= '';
                if (descrpLen>maxLen) {
                    descrpLen= maxLen;
                    dots= '...';
                } 
                $thisPost.find('.descrp-snippet').html(`${post.description.substring(0,descrpLen)}${dots}`);
            },
            'error': function(err1,err2,err3) { console.log(err1,err2,err3); }
        });
        
    });

    $('button[name=edit_prof_img]').on('click',function(){
        $(this).fadeOut();
        $('.update_prof_img_form').fadeIn();
    });

    $('button[name=cancel_edit_prof_img]').on('click',function(){
        $(this).parent().fadeOut();
        $('button[name=edit_prof_img]').fadeIn();
    });

    $('button[name=save_edit_prof_img]').on('click',function(){
        
        var dataObj= {'img_url': $('input[name=input_prof_img]').val()};
        $.ajax({
            'type': 'PATCH',
            'url': '/api/profile',
            'data': JSON.stringify(dataObj),
            'contentType': 'application/json',
            'success': function(output){ 
                var key= Object.getOwnPropertyNames(output)[0];
                var img= output[key];
                $('img[name=img]').attr('src',img.length>0? img: "assets/postlist_default.jpg");;
                $('input[name=input_prof_img]').val(img);
                $('.update_prof_img_form').fadeOut();
                $('button[name=edit_prof_img]').fadeIn();
            },
            'error': function(e1,e2,e3) {
                $('.update_prof_img_form').fadeOut();
                $('button[name=edit_prof_img]').fadeIn();
            }
        });
        
    });
    
    
});


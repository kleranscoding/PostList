console.log('sanity check...');

var $postList;
var maxLen= 150;
//var allCategories= [];

function clearDisplayList() { $('#show_posts').html(''); }

function errorHandler() {

}

function getCategories() {
    $.ajax({
        'method': 'GET',
        'url': '/api/category',
        'success': function(categories) {
            //allCategories= categories;
            categories.forEach((cat)=> {
                $('#cat_options').append(`<option value=${cat._id}>${cat.name}</option>`);
            });
            $('#cat_options').children().eq(0).attr('selected','selected');
        },
        'error': function(err1,err2,err3) {
            console.log(err1,err2,err3);
        }
    });
}

function searchPostsByCategory() {
    var $cat_id= $('#cat_options option:selected').val();
    console.log($cat_id);
    clearDisplayList();
    $.ajax({
        'method': 'GET',
        'url': `/api/category/${$cat_id}`,
        'success': function(catPosts) {
            var $displayText= 'none found';
            if (catPosts.posts.length>0) {
                $displayText= `displaying 1-${catPosts.posts.length} results`;
            }
            $('#show_posts').append(`<span>${$displayText}</span>`);
            catPosts.posts.forEach((post)=> {
                var descrpLen= post.description.length;
                var dots= '';
                if (descrpLen>maxLen) {
                    descrpLen= maxLen;
                    dots= '...';
                } 
                $('#show_posts').append(`
                <article class='post-snippet' data-id='${post._id}'>
                  <h3>${post.title}</h3>
                  <div class='wrapper'>
                    <img src='${post.images[0]}' />
                    <p class='text-truncate'>
                      ${post.description.substring(0,descrpLen)}${dots}
                      <span class='learn-more btn btn-info'>Learn More</span>
                    </p>
                  </div>
                </article>
                `);
            });
        },
        'error': function(err1,err2,err3) {
            console.log(err1,err2,err3);
        }
    });
}


$(document).ready(function(){
    
    //clearDisplayList();
    getCategories();
    $('#search_form button').on('click',searchPostsByCategory);
    
    /*
    $('#cat_options select').on('change',function(){
        var $cat_id= $('#cat_options option:selected').val();
        console.log($cat_id);
    });
    //*/

    $('#show_posts').on('click','.learn-more',function(){
        var $article= $(this).parent().parent().parent();
        console.log($article.attr('data-id'));
        var $modal= $('#modal-post');
        $modal.modal('toggle');
        // populate post
        $.ajax({
            'method': 'GET',
            'url': `/api/posts/${$article.attr('data-id')}`,
            'success': function(post) {
                console.log(post);
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
                //html($article.attr('data-id'));
            },
            'error': function(err1,err2,err3) { console.log(err1,err2,err3); }
        });
        
    });

    $('#modal-post button').on('click',function(){
        var $modal= $('#modal-post');
        var $modalBody= $modal.find('.modal-body');
        $modal.find('.modal-title').html('');
        $modalBody.html('');
    });


    
    
});



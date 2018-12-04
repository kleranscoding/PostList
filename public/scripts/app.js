console.log('sanity check...');

var maxLen= 150;

function getPosts() {
    console.log('inside');
    $.ajax({
        'method': 'GET',
        'url': '/api/posts',
        'success': function(posts) {
            posts.forEach((post)=> {
                var descrpLen= post.description.length;
                var dots= '';
                if (descrpLen>maxLen) {
                    descrpLen= maxLen;
                    dots= '...';
                } 
                $('#post_lists').append(`
                <article class='post-snippet' data-id='${post._id}'>
                  <h3>${post.title}</h3>
                  <div class='wrapper'>
                    <img src='${post.images[0]}' />
                    <p class='text-truncate'>
                      ${post.description.substring(0,descrpLen)}${dots}
                      <span type='button' class='learn-more btn btn-info'>
                        Learn More
                      </span>
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

    getPosts();
    
    $('#post_lists').on('click','.learn-more',function(){
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



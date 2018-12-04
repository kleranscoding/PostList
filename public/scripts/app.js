console.log('sanity check...');

function getPosts() {
    console.log('inside');
    $.ajax({
        'method': 'GET',
        'url': '/api/posts',
        'success': function(posts) {
            posts.forEach((post)=> {
                $('#post_lists').append(`
                <article data-id='${post._id}'>
                  <h3>${post.title}</h3>
                  <div class='wrapper'>
                    <img src='${post.images[0]}' />
                    <p class='text-truncate'>
                      ${post.description.substring(0,Math.min(150,post.description.length))}...
                      <span class='learn-more btn btn-info'>Learn More...</span>
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
    //

});



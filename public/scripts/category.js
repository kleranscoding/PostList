console.log('sanity check...');

var $postList;
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
                $('#show_posts').append(`
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
    
    //clearDisplayList();
    getCategories();
    $('#search_form button').on('click',searchPostsByCategory);
    
    $('#cat_options select').on('change',function(){
        var $cat_id= $('#cat_options option:selected').val();
        console.log($cat_id);
    });

    

    
    
});



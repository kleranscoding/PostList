console.log('sanity check...');

var $postList;
var maxLen= 150;
//var allCategories= [];

function clearDisplayList() { $('#show_posts').html(''); }

function targetHTMLByName(target,tag1,tag2,name,val) {
    target.find(`${tag1}[name=${name}] ${tag2}`).html(val);
}

function clearViewModal() {
    var $modal= $('#modal-post');
    $modal.find('.modal-title').html('');
    $modal.find('.modal-body').find('[name=image-container]').html('');
    $modal.find('.modal-body').find('p[name=category-container]').html('');
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
                  <div class='row'>
                    <div class='col-md-12'>
                      <h3>${post.title}</h3>
                    </div> 
                  </div> 
                  <div class='row'>
                    <div class='col-md-4'>
                      <img class='img-thumbnail' src='${post.images[0]}' />
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
        var $article= $(this);
        while ($article.prop('tagName')!='ARTICLE') { $article= $article.parent(); }
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
                    $modalBody.find('[name=image-container]')
                    .append(`<img class='img-responsive img-thumbnail' src='${img}'>`);
                });
                var $categories= '';
                post.categories.forEach((cat)=> {
                    $categories+= `<button class='btn btn-info' data-id='${cat._id}'>${cat.name}</button>`;
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
        
    });

    $('#modal-post button[data-dismiss=modal]').on('click',clearViewModal);



});



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
                </article>
                `);
            });
        },
        'error': function(err1,err2,err3) {
            console.log(err1,err2,err3);
        }
    });
}

function targetHTMLByName(target,tag1,tag2,name,val) {
    target.find(`${tag1}[name=${name}] ${tag2}`).html(val);
}

function clearViewModal() {
    var $modal= $('#modal-post');
    $modal.find('.modal-title').html('');
    $modal.find('.modal-body').find('[name=image-container]').html('');
    $modal.find('.modal-body').find('p[name=category-container]').html('');
}


$(document).ready(function(){

    getPosts();
    
    $('#post_lists').on('click','.learn-more',function(){
        var $article= $(this);
        while ($article.prop('tagName')!='ARTICLE') { $article= $article.parent(); }
        //console.log($article.attr('data-id'));
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


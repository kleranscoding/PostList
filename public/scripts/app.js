console.log('sanity check...');

let users = [];
let posts = [];
var $postslist;
var $usersList;

let USERS = "/api/users"
let POSTS ="/api/posts"

$(document).ready(function() {
    $usersList = $('#power');
$.ajax({
    method: 'GET',
    url: USERS,
    success: userSuccess,
    error: userError
    });
}); 

userSuccess((users) => {
    users.forEach(el => {
        var username = el.username;
        var password = el.password;
        var location = el.location;
        var email = el.email;
        var join_date = el.join_date;
        var img_url = el.img_url;
        var preference = el.preference;

    profilehtml = 
        `   <div class="row">
            <div class="col-xs-6"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ8xzdv564ewROcTBYDdv51oTD5SgNOCDDwMw4XXIdvxFGyQzn" alt="user"></div>
            <div class="col-xs-6">
                <h3>username:${username}</h3><br>
                <h3>location:${location}</h3><br>
                <h3>date joined:${join_date}</h3><br>
                <h3>email:${email}</h3>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-6"><p>${preference}<p></div>
            <div class="col-xs-6"></div>
        </div>`

    });
});

    $('.btn-cancel').on('submit', (e) => {
    e.preventDefault();
    $.ajax({
        method: 'POST',
        url: USERS,
        data: $(this).serialize(),
        success: createPostSuccess,
        error: createPostError
    });
});


    $usersList.on('click', '.cancelBtn', function() {
    $.ajax({
      method: 'DELETE',
      url: POSTS,
      success: deleteUserSuccess,
      error: deleteUserError
    });
  });
  deleteUserSuccess()
  deleteUserError()



$(document).ready(function() {
$postslist = $('#aim');
$.ajax({
    method: "GET",
    url: POSTS,
    success: newPostSuccess,
    error: newPostError
});
});

newPostSuccess((posts) => {
    posts.forEach(el => {
        var title = el.title;
        var date = el.date_of_post;
        var desc = el.description;
        var contact = el.contact_info
        var images = el.images;
        var url = el.url

       viewhtml = 
                `<div class="row">
                <div class="col-xs-12 col-md-8"></div>
                <div class="col-xs-6 col-md-4"><p>${title}></p>
                <p>${date}</p></div>
                </div>
                
                <!-- Columns are always 50% wide, on mobile and desktop -->
                <div class="row">
                <div class="col-12">
                ${images}
                </div>
                    </div>
                <div class="row">
                    <div class="col-12">
                    <div id='#aim'>
                    <h3>${desc}</h3>
                </div>
                    </div>
                    <div class="row">
                <div class="col-xs-6 col-md-4"><p>${contact}</p></div>
                <div class="col-xs-12 col-md-8"> </div>`; 
                $('#aim').append(viewhtml);
                
    })
})

$('.').on('submit', (e) => {
    e.preventDefault();
    $.ajax({
        method: 'POST',
        url: USERS,
        data: $(this).serialize(),
        success: createPostSuccess,
        error: createPostError
    });
});

function createPostSuccess(json) {
    $("#newPlaceForm input").val("");
    posts.push(json);
    console.log(json);
    renderPost();
  }



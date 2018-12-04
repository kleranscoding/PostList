/**
 * server.js
 * PostList
 */

/////***** ===== VARIABLES ===== *****/////

const portNum= 8000;
const express= require('express');
const app= express();
const bodyParser= require('body-parser');
const db= require('./models');
const ctrl = require('./controllers');



/////***** ===== MIDDLEWARE ===== *****/////

app.use(express.json());
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({ extended: true }));


/////***** ===== VIEWS ===== *****/////

/**
 * Home/Root
 */
app.get('/',(req, res)=> {
    res.sendFile(__dirname+'/views/index.html');
});

/**
 * API home
 */

 /*== GET ==*/
app.get('/api',(req, res)=> {
    res.json({
        'documentation_url': 'https://github.com/kleranscoding/PostList',
        'base_url': '',
        'endpoints': [
            {
                'path': '/api',
                'method': 'GET',
                'description': 'describes all endpoints'
            },
            {
                'path': '/api/category',
                'method': 'GET',
                'description': 'gets all categories and their corresponding posts'
            },
        ]
    });
});


/**
 * Category 
 */

/*== GET ==*/

// get all categories
app.get('/api/category', ctrl.category.index);

// get one category by id
app.get('/api/category/:cat_id', ctrl.category.show);

/*== POST ==*/

// create one new category
app.post('/api/category/', ctrl.category.create);

/*== PUT ==*/

// update one category by category_id
app.put('/api/category/:cat_id', ctrl.category.update);


/**
 * User
 */

/*== GET ==*/

// get all users
app.get('/api/users', ctrl.user.index);


// get one user by user_id
app.get('/api/users/:user_id', ctrl.user.show);

/*== POST ==*/

// create new user
app.post('/api/users', ctrl.user.create);

/*== PUT ==*/

// app.get('/something', (req,res) => {
//     var arr= [];
//     req.body.preference.forEach((pref) => {
//         db.Category.findOne({'name': pref},(err1,foundCat)=> {
//             console.log(`foundcat ${foundCat._id}`);
//             if (err1) { return console.log(err1); }
//             arr.push(foundCat);
//         });
//     });
//     if (arr!=null) res.json(arr);
// })

// update user info
app.put('/api/users/:user_id', ctrl.user.update);


/**
 * Post
 */

/*== GET ==*/

// get all posts
app.get('/api/posts', ctrl.post.index);

// get post by post_id
app.get('/api/posts/:post_id', ctrl.post.show);

// get all posts from user_id
app.get('/api/users/:user_id/posts', ctrl.post.index_by_user_id);

// get one post by post_id from user_id
app.get('/api/users/:user_id/posts/:post_id', ctrl.post.show_by_user_id);

// get all posts from category_id
app.get('/api/category/:cat_id/posts', ctrl.post.index_by_cat_id);

// get one post by post_id from category_id
app.get('/api/category/:cat_id/posts/:post_id', ctrl.post.show_by_cat_id);

/*== POST ==*/

// create a new post from user_id
app.post('/api/users/:user_id/posts', ctrl.post.create);

/*== PUT ==*/

// update an existing post by post_id from user_id
app.put('/api/users/:user_id/posts/:post_id', ctrl.post.update);

/*== DELETE ==*/

// delete an existing post by post_id from user_id
app.delete('/api/users/:user_id/posts/:post_id', ctrl.post.delete);



/////***** ===== PORT LISTENING ===== *****/////

app.listen(process.env.PORT || portNum);



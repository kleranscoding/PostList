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


/////***** ===== ROUTES ===== *****/////

/**
 * Home/Root
 */
app.get('/',(req, res)=> {
    res.sendFile(__dirname+'/views/index.html');
});

app.get('/home',(req, res)=> {
    res.sendFile(__dirname+'/views/index.html');
});

app.get('/index',(req, res)=> {
    res.sendFile(__dirname+'/views/index.html');
});

app.get('/category',(req, res)=> {
    res.sendFile(__dirname+'/views/category.html');
});

app.get('/login',(req, res)=> {
    res.sendFile(__dirname+'/views/login.html');
});

app.get('/register',(req, res)=> {
    res.sendFile(__dirname+'/views/register.html');
});

///*
app.get('/profile',(req, res)=> {
    res.sendFile(__dirname+'/views/profile.html');
    //res.sendFile(__dirname+'/views/profile.html?id='+req.params.userid);
});
//*/

app.get('/profile/:userid',(req, res)=> {
    res.redirect('/profile?userid='+req.params.userid);
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

// update user info
app.put('/api/users/:user_id', ctrl.user.update);

// update user some info
app.patch('/api/users/:user_id', (req,res)=>{
    console.log(req.body);
    db.User.findOneAndUpdate(
        {'_id': req.params.user_id},
        {'$set': req.body},
        {new: true},
        (err,updateOne)=> {
            if (err) { res.status(500).json({error:'internal error:',description: err}); }
            res.json(updateOne);
    });
});


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

// update an existing post by post_id from user_id (PUT)
app.put('/api/users/:user_id/posts/:post_id', ctrl.post.update);

/*== PATCH ==*/

// update an existing post by post_id from user_id (PATCH)
app.patch('/api/users/:user_id/posts/:post_id', (req,res)=>{
    //console.log(req.body);
    db.Post.findOneAndUpdate(
        {'_id': req.params.post_id, 'post_by': req.params.user_id},
        {'$set': req.body},
        {new: true},
        (err,updateOne)=> {
            if (err) { res.status(500).json({error:'internal error:',description: err}); }
            res.json(updateOne);
    });
});

/*== DELETE ==*/

// delete an existing post by post_id from user_id
app.delete('/api/users/:user_id/posts/:post_id', ctrl.post.delete);


/**
 * SEARCH
 */

// get all users
app.get('/api/search/users', (req,res)=> {
    console.log(req.query);
    //return;
    db.User.find(req.query)
    .exec((err,foundUser)=> {
        if (err) { res.status(500).json({error:'internal error:',description: err}); }
        console.log(foundUser);
        res.json(foundUser);
    });
});



/////***** ===== PORT LISTENING ===== *****/////

app.listen(process.env.PORT || portNum);



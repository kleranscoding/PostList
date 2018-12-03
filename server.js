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
const async = require('async');
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');


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
app.get('/api/category',(req, res)=> {
    db.Category.find({})
    .populate('posts')
    .exec((err,categories)=> {
        if (err) { res.status(500).json({error:'internal error'}); }
        res.json(categories);
    });
});

// get one category by id
app.get('/api/category/:cat_id',(req, res)=> {
    db.Category.findById(req.params.cat_id)
    .populate('posts')
    .exec((err,categories)=> {
        if (err) { res.status(500).json({error:'internal error'}); }
        res.json(categories);
    });
});

/*== POST ==*/

// create one new category
app.post('/api/category/',(req, res)=> {
    var newCategory= new db.Category({
        'name': req.body.name,
        'description': req.body.description,
        'posts': []
    });
    newCategory.save((err, savedCategory)=> {
        if (err) { res.status(500).json({error:'internal error:',description: err}); }
        console.log('saved Category= ',savedCategory.name,' describing ',savedCategory.description);
        res.json(savedCategory);
    });
});


/**
 * User
 */

/*== GET ==*/

// get all users
app.get('/api/users',(req, res)=> {
    db.User.find({})
    .populate('preference')
    .populate('posts')
    .exec((err,users)=> {
        if (err) { res.status(500).json({error:'internal error'}); }
        res.json(users);
    });
});

// get one user by user_id
app.get('/api/users/:user_id',(req, res)=> {
    db.User.findById(req.params.user_id)
    .populate('preference')
    .populate('posts')
    .exec((err,users)=> {
        if (err) { res.status(500).json({error:'internal error'}); }
        res.json(users);
    });
});

/*== POST ==*/

// create new user
app.post('/api/users',(req, res)=> {
    var newUser= new db.User({
        'username': req.body.username,
        'email': req.body.email,
        'password': req.body.password,
        'location': req.body.location,
        'join_date': req.body.join_date,
        'img_url': req.body.img_url,
        'posts': [],
        'preference': req.body.preference
    });

    newUser.save((err,savedUser)=> {
        if (err) { res.status(500).json({error:'internal error','description': err}); }
        res.json(savedUser);
    });
    
});


/**
 * Post
 */

/*== GET ==*/

// get all posts
app.get('/api/posts',(req, res)=> {
    db.Post.find({})
    .populate('categories')
    .populate('post_by')
    .exec((err,posts)=> {
        if (err) { res.status(500).json({error:'internal error', 'description': err}); }
        res.json(posts);
    });
});

// get all posts
app.get('/api/posts/:post_id',(req, res)=> {
    db.Post.findById(req.params.post_id)
    .populate('categories')
    .populate('post_by')
    .exec((err,posts)=> {
        if (err) { res.status(500).json({error:'internal error', 'description': err}); }
        res.json(posts);
    });
});


// get all posts from user_id
app.get('/api/users/:user_id/posts', (req, res)=> {
    db.Post.find({'post_by._id': req.params.user_id})
    .populate('post_by')
    .populate('categories')
    .exec((err,posts)=> {
        if (err) { res.status(500).json({error:'internal error', 'description': err}); }
        res.json(posts);
    });
});

// get one post by post_id from user_id
app.get('/api/users/:user_id/posts/:post_id', (req, res)=> {
    db.Post.findOne({'post_by._id': req.params.user_id, '_id': req.params.post_id})
    //.populate('post_by')
    //.populate('category')
    .exec((err,posts)=> {
        if (err) { res.status(500).json({error:'internal error', 'description': err}); }
        res.json(posts);
    });
});

// get all posts from category_id
app.get('/api/category/:cat_id/posts', (req, res)=> {
    db.Post.find({'categories._id': req.params.cat_id})
    //.populate('post_by')
    .exec((err,posts)=> {
        if (err) { res.status(500).json({error:'internal error', 'description': err}); }
        res.json(posts);
    });
});

// get one post by post_id from category_id
app.get('/api/category/:cat_id/posts/:post_id', (req, res)=> {
    db.Post.findOne({'_id': req.params.post_id, 'categories._id': req.params.cat_id})
    .exec((err,posts)=> {
        if (err) { res.status(500).json({error:'internal error', 'description': err}); }
        res.json(posts);
    });
});




/////***** ===== PORT LISTENING ===== *****/////

app.listen(process.env.PORT || portNum);


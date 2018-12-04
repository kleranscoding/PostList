/**
 * server.js
 * PostList
 * Author: Clarence
 */

/////***** ===== VARIABLES ===== *****/////

const portNum= 8000;
const express= require('express');
const app= express();
const bodyParser= require('body-parser');
const db= require('./models');


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
    .exec((err,categories)=> {
        if (err) { res.status(500).json({error:'internal error'}); }
        res.json(categories);
    });
});

// get one category by id
app.get('/api/category/:cat_id',(req, res)=> {
    db.Category.findById(req.params.cat_id)
    .populate('posts')
    .exec((err,category)=> {
        if (err) { res.status(500).json({error:'internal error'}); }
        db.Post.find({'categories': {'$in': category._id}})
        .populate('users')
        .exec((err,posts)=> {
            if (err) { res.status(500).json({error:'internal error'}); }
            res.json({'category': category, 'posts': posts});
        });
    });
});

/*== POST ==*/

// create one new category
app.post('/api/category/',(req, res)=> {
    var newCategory= new db.Category({
        'name': req.body.name,
        'description': req.body.description,
    });
    newCategory.save((err, savedCategory)=> {
        if (err) { res.status(500).json({error:'internal error:',description: err}); }
        console.log('saved Category= ',savedCategory.name,' describing ',savedCategory.description);
        res.json(savedCategory);
    });
});

/*== PUT ==*/

// update one category by category_id
app.put('/api/category/:cat_id',(req, res)=> {
    var reqID= req.params.cat_id;
    console.log('updating category',reqID);
    db.Category.findOneAndUpdate({_id: reqID},req.body,{new: true}, (err, editCategory)=> {
        if (err) { res.status(500).json({error:'internal error:',description: err}); }
        res.json(editCategory);
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
    .exec((err,users)=> {
        if (err) { res.status(500).json({error:'internal error'}); }
        res.json(users);
    });
});


// get one user by user_id
app.get('/api/users/:user_id',(req, res)=> {
    db.User.findById(req.params.user_id)
    .populate('preference')
    .exec((err,users)=> {
        if (err) { res.status(500).json({error:'internal error'}); }
        db.Post.find({'post_by': users._id})
        .populate('users')
        .exec((err,posts)=> {
            if (err) { res.status(500).json({error:'internal error'}); }
            res.json({'user': users, 'posts': posts});
        });
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
        'preference': req.body.preference
    });

    newUser.save((err,savedUser)=> {
        if (err) { res.status(500).json({error:'internal error','description': err}); }
        res.json(savedUser);
    });
    
});

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
app.put('/api/users/:user_id',(req, res)=> {
    var reqID= req.params.user_id;
    db.User.findOneAndUpdate({_id: reqID},
    {
        '$set': {
        'username': req.body.username,
        'email': req.body.email,
        'password': req.body.password,
        'location': req.body.location,
        'img_url': req.body.img_url,
        'preference': req.body.preference,
        }
    },
    {new:true}, (err, editUser)=> {
    if (err) { res.status(500).json({error:'internal error:',description: err}); }
    
    //console.log(req.body.preference)
    
    res.json(editUser);
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

// get post by post_id
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

/*== POST ==*/

// create a new post from user_id
app.post('/api/users/:user_id/posts', (req, res)=> {
    var newPost= new db.Post({
        'title': req.body.title,
        'date_of_post': req.body.date_of_post,
        'description': req.body.description,
        'images': req.body.images,
        'categories': req.body.categories,
        'post_by': req.params.user_id
    });
    newPost.save((err,savedPost)=> {
        if (err) { res.status(500).json({error:'internal error', 'description': err}); }
        res.json(savedPost);
    });
});

/*== PUT ==*/

// update an existing post by post_id from user_id
app.put('/api/users/:user_id/posts/:post_id', (req, res)=> {
    var edit= {
        'title': req.body.title,
        'description': req.body.description,
        'images': req.body.images,
        'categories': req.body.categories
    };
    db.Post.findOneAndUpdate({
        '_id': req.params.post_id, 
        'post_by': req.params.user_id
    },
    {'$set': edit},{new: true},(err,editPost)=> {
        if (err) { res.status(404).json({error:'not found', 'description': err}); }
        console.log(editPost);
        res.json(editPost);
    });
});

/*== DELETE ==*/

// delete an existing post by post_id from user_id
app.delete('/api/users/:user_id/posts/:post_id', (req, res)=> {
    db.Post.findById(req.params.post_id)
    .exec((err,deletePost)=> {
        if (err) { res.status(404).json({error:'not found', 'description': err}); }
        res.json(deletePost);
    });
});



/////***** ===== PORT LISTENING ===== *****/////

app.listen(process.env.PORT || portNum);



/**
 * server.js
 * PostList
 */

/////***** ===== VARIABLES ===== *****/////

const portNum= 8000;
const NOT_FOUND_ERR= 404, FORBIDDEN_ERR=403, OK=200, INTERNAL_ERR=500;
const SALT_WORK_FACTOR = 10;
const express= require('express');
const app= express();
const bodyParser= require('body-parser');
const cookieParser= require('cookie-parser');
const bcrypt= require('bcrypt');
const db= require('./models');
const ctrl = require('./controllers');


/////***** ===== MIDDLEWARE ===== *****/////

app.use(express.json());
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


/////***** ===== ROUTES ===== *****/////

/**
 * Home/Root
 */

app.use('/',(req,res,next)=>{
    //const data = req.cookies.userInfo;
    //console.log(data);
    next();
});

app.get('/',(req, res)=> {
    //res.locals.erewui
    res.sendFile(__dirname+'/views/index.html');
});

app.get('/home',(req, res)=> {
    res.sendFile(__dirname+'/views/index.html');
});

app.get('/search',(req, res)=> {
    res.sendFile(__dirname+'/views/category.html');
});

app.get('/login',(req, res)=> {
    if (req.cookies.userInfo!==undefined) {
        res.redirect('/profile');
    } else {
        res.sendFile(__dirname+'/views/login.html');
    }
});

app.get('/logout',(req, res)=> {
    res.clearCookie('userInfo');
    res.sendFile(__dirname+'/views/index.html');
});

app.get('/register',(req, res)=> {
    if (req.cookies.userInfo!==undefined) {
        res.redirect('/profile');
    } else {
        res.sendFile(__dirname+'/views/register.html');
    }
});

app.get('/profile',(req, res)=> {
    if (req.cookies.userInfo!==undefined) {
        console.log('profile: ',req.cookies.userInfo);
        res.sendFile(__dirname+'/views/profile.html');
    } else {
        res.status(FORBIDDEN_ERR).json({'error': `${FORBIDDEN_ERR} FORBIDDEN`});
    }
});

/*== POST ==*/

app.post('/login',(req,res)=> {
    if (req.cookies.userInfo===undefined) {
        console.log(req.body);
        console.log(req.body.email.trim());
        db.User.findOne({'email': req.body.email.trim()}).exec((err,user)=> {
            if (err) { 
                res.status(INTERNAL_ERR).json({'status': INTERNAL_ERR});
            } else {
                console.log('user',user);
                if (user=={}) {
                    res.status(NOT_FOUND_ERR).json({'status': NOT_FOUND_ERR});
                } else {
                    bcrypt.compare(req.body.password.trim(), user.password, function(err, isMatch) {
                        if (err) {
                            res.status(NOT_FOUND_ERR).json({'status': NOT_FOUND_ERR});
                        } else {
                            console.log('setting cookie');
                            res.cookie('userInfo',user,{expire: new Date(3600*1000*24 + Date.now()), httpOnly: true});
                            res.status(OK).json({'status': OK,'description': 'OK'});
                        }
                    });
                    
                }
            }
        });
    } else {
        res.status(OK).json({'status': OK});
    } 
});

/*== GET ==*/

app.get('/api/profile',(req,res)=> {
    if (req.cookies.userInfo!==undefined) {
        db.User.findById(req.cookies.userInfo._id)
        .populate('preference')
        .exec((err,users)=> {
            if (err) { res.status(INTERNAL_ERR).json({error:'internal error'}); }
            db.Post.find({'post_by': users._id})
            .populate('users')
            .exec((err,posts)=> {
                if (err) { res.status(INTERNAL_ERR).json({error:'internal error'}); }
                var userObj= {}
                userObj['username']= users.username;
                userObj['email']= users.email;
                userObj['location']= users.location;
                userObj['join_date']= users.join_date;
                userObj['preference']= users.preference;
                userObj['img_url']= users.img_url;
                res.json({'user': userObj, 'posts': posts});
            });
        });
    } else {
        res.status(FORBIDDEN_ERR).json({'error': `${FORBIDDEN_ERR} FORBIDDEN`});
    }
});


/*== POST ==*/

// create a new post from user_id
app.post('/api/profile/posts', (req,res)=> {
    if (req.cookies.userInfo!==undefined) {
        var newPost= new db.Post({
            'title': req.body.title,
            'date_of_post': req.body.date_of_post,
            'description': req.body.description,
            'images': req.body.images,
            'categories': req.body.categories,
            'post_by': req.cookies.userInfo._id,
            'contact_info': req.body.contact_info
        });
        newPost.save((err,savedPost)=> {
            if (err) { res.status(INTERNAL_ERR).json({error:'internal error', 'description': err}); }
            res.json(savedPost);
        });
    } else {
        res.status(FORBIDDEN_ERR).json({'error': `${FORBIDDEN_ERR} FORBIDDEN`});
    }
});


/*== PATCH ==*/

// update some user info
app.patch('/api/profile', (req,res)=>{
    if (req.cookies.userInfo!==undefined) {
        db.User.findOneAndUpdate(
            {'_id': req.cookies.userInfo._id},
            {'$set': req.body},
            {upsert: true},
        ).populate('categories').exec(
            (err,updatedOne)=> {
                if (err) { res.status(INTERNAL_ERR).json({error:'internal error:',description: err}); }
                res.json(req.body);
        });
    } else {
        res.status(FORBIDDEN_ERR).json({'error': `${FORBIDDEN_ERR} FORBIDDEN`});
    }
});

// update an existing post by post_id from user_id (PATCH)
app.patch('/api/profile/posts/:post_id', (req,res)=>{
    if (req.cookies.userInfo!==undefined) {
        db.Post.findOneAndUpdate(
            {'_id': req.params.post_id, 'post_by': req.cookies.userInfo._id},
            {'$set': req.body},
            {new: true},
            (err,updateOne)=> {
                if (err) { res.status(INTERNAL_ERR).json({'error':'internal error','description': err}); }
                res.json(updateOne);
        });
    } else {
        res.status(FORBIDDEN_ERR).json({'error': `${FORBIDDEN_ERR} FORBIDDEN`});
    }
});

/*== DELETE ==*/

// delete an existing post by post_id from user_id
app.delete('/api/profile/posts/:post_id', (req,res)=>{
    if (req.cookies.userInfo!==undefined) {
        db.Post.remove({'_id': req.params.post_id})
        .exec((err,deletedPost)=> {
            if (err) { res.status(NOT_FOUND_ERR).json({error:'not found', 'description': err}); }
            res.json({'_id': req.params.post_id, 'message': deletedPost});
        });
    } else {
        res.status(FORBIDDEN_ERR).json({'error': `${FORBIDDEN_ERR} FORBIDDEN`});
    }
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


/*== PUT ==*/

// update an existing post by post_id from user_id (PUT)
app.put('/api/users/:user_id/posts/:post_id', ctrl.post.update);


/**
 * SEARCH
 */

// get all users
app.get('/api/search/users', (req,res)=> {
    //
    db.User.find(req.query)
    .exec((err,foundUser)=> {
        if (err) { res.status(NOT_FOUND_ERR).json({error:'not found', 'description': err}); }
        res.json(foundUser);
    });
});

app.get('/api/search/posts', (req,res)=> {
    db.Post.find({'title': new RegExp(req.query.q,'i')})
    .exec((err,foundPosts)=> {
        if (err) { res.status(NOT_FOUND_ERR).json({error:'not found', 'description': err}); }
        res.json(foundPosts);
    });
});

app.get('/api/search/posts/:cat_id', ctrl.post.index_by_cat_id);



/////***** ===== PORT LISTENING ===== *****/////

app.listen(process.env.PORT || portNum);



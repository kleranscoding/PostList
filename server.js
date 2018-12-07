/**
 * server.js
 * PostList
 */

/////***** ===== VARIABLES ===== *****/////

const portNum= 8000;
const NOT_FOUND_ERR= 404, FORBIDDEN_ERR=403, OK=200, INTERNAL_ERR=500;
const express= require('express');
const app= express();
const bodyParser= require('body-parser');
const cookieParser= require('cookie-parser');
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

 /*
 app.use('/',(req,res,next)=>{
    //get cookies data 
    // check if that cookeis is undefined
    // if defined get user data and set to locals variable
    // if undefined set userdata in locals null or anything
    res.cookie('name', 'express').send('cookie set');
    next();
});
//*/

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

app.get('/category',(req, res)=> {
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

///*
app.get('/profile',(req, res)=> {
    ///*
    console.log('out.profile: ',req.cookies.userInfo);
    console.log(req.cookies.userInfo===undefined);
    if (req.cookies.userInfo!==undefined) {
        console.log('profile: ',req.cookies.userInfo);
        res.sendFile(__dirname+'/views/profile.html');
    } else {
        res.status(FORBIDDEN_ERR).json({'error': `${FORBIDDEN_ERR} FORBIDDEN`});
    }
    //*/
});
//*/


app.post('/login',(req,res)=> {
    console.log('login guard: ',req.cookies.userInfo);
    if (req.cookies.userInfo===undefined) {
        console.log('req.body: ',req.body);
        db.User.findOne(req.body).exec((err,user)=> {
            if (err) { 
                res.status(INTERNAL_ERR).json({'status': INTERNAL_ERR});
            } else {
                if (user=={}) {
                    res.status(NOT_FOUND_ERR).json({'status': NOT_FOUND_ERR});
                } else {
                    console.log('setting cookie');
                    res.cookie('userInfo',user,{expire: new Date(3600*1000*24 + Date.now()), httpOnly: true});
                    res.status(OK).json({'status': OK});
                }
            }
        });
    } else {
        res.status(OK).json({'status': OK});
    } 
});


app.get('/api/profile',(req,res)=> {
    if (req.cookies.userInfo!==undefined) {
        console.log('api/profile: ',req.cookies.userInfo);
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
                console.log('api profile: ',{'user': userObj, 'posts': posts});
                res.json({'user': userObj, 'posts': posts});
            });
        });
    } else {
        res.status(FORBIDDEN_ERR).json({'error': `${FORBIDDEN_ERR} FORBIDDEN`});
    }
});

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
        {upsert: true},
    ).populate('categories').exec(
        (err,updatedOne)=> {
            if (err) { res.status(INTERNAL_ERR).json({error:'internal error:',description: err}); }
            res.json(req.body);
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



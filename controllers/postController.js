const db= require('../models');

module.exports= {

    'index': (req, res)=> {
        db.Post.find({})
        .populate('categories')
        .populate('post_by')
        .exec((err,posts)=> {
            if (err) { res.status(500).json({error:'internal error', 'description': err}); }
            res.json(posts);
        });
    },

    'show': (req, res)=> {
        db.Post.findById(req.params.post_id)
        .populate('categories')
        .populate('post_by')
        .exec((err,posts)=> {
            if (err) { res.status(500).json({error:'internal error', 'description': err}); }
            res.json(posts);
        });
    },

    'index_by_user_id': (req, res)=> {
        db.Post.find({'post_by': req.params.user_id})
        .populate('post_by')
        .populate('categories')
        .exec((err,posts)=> {
            if (err) { res.status(500).json({error:'internal error', 'description': err}); }
            res.json(posts);
        });
    },

    'show_by_user_id': (req, res)=> {
        db.Post.findOne({'post_by': req.params.user_id, '_id': req.params.post_id})
        //.populate('post_by')
        //.populate('category')
        .exec((err,posts)=> {
            if (err) { res.status(500).json({error:'internal error', 'description': err}); }
            res.json(posts);
        });
    },

    'index_by_cat_id': (req, res)=> {
        db.Post.find({'categories': req.params.cat_id})
        //.populate('post_by')
        .exec((err,posts)=> {
            if (err) { res.status(500).json({error:'internal error', 'description': err}); }
            res.json(posts);
        });
    },

    'show_by_cat_id': (req, res)=> {
        db.Post.findOne({'_id': req.params.post_id, 'categories': {'$in': req.params.cat_id}})
        .exec((err,posts)=> {
            if (err) { res.status(500).json({error:'internal error', 'description': err}); }
            res.json(posts);
        });
    },

    'create': (req, res)=> {
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
    },

    'update': (req, res)=> {
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
            res.json(editPost);
        });
    },

    'delete': (req, res)=> {
        db.Post.findById(req.params.post_id)
        .exec((err,deletePost)=> {
            if (err) { res.status(404).json({error:'not found', 'description': err}); }
            res.json(deletePost);
        });
    },

};
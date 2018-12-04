const db = require('../models');

module.exports = {
    
    'index': (req, res)=> {
        db.Category.find({})
        .exec((err,categories)=> {
            if (err) { res.status(500).json({error:'internal error'}); }
            res.json(categories);
        });
    },

    'show': (req, res)=> {
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
    },

    'create': (req, res)=> {
        var newCategory= new db.Category({
            'name': req.body.name,
            'description': req.body.description,
        });
        newCategory.save((err, savedCategory)=> {
            if (err) { res.status(500).json({error:'internal error:',description: err}); }
            console.log('saved Category= ',savedCategory.name,' describing ',savedCategory.description);
            res.json(savedCategory);
        });
    },

    'update': (req, res)=> {
        var reqID= req.params.cat_id;
        console.log('updating category',reqID);
        db.Category.findOneAndUpdate({_id: reqID},req.body,{new: true}, (err, editCategory)=> {
            if (err) { res.status(500).json({error:'internal error:',description: err}); }
            res.json(editCategory);
        });
    }

};


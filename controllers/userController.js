const db = require('../models');

module.exports = {
    
    'index': (req, res)=> {
        db.User.find({})
        .populate('preference')
        .exec((err,users)=> {
            if (err) { res.status(500).json({error:'internal error'}); }
            res.json(users);
        });
    },

    'show': (req, res)=> {
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
    },

    'create': (req, res)=> {
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
    },

    'update': (req, res)=> {
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
    
        res.json(editUser);
        });    
    }

};
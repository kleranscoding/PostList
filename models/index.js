const mongoose= require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/PostList', {useNewUrlParser: true});

module.exports.Category= require('./category');
module.exports.User= require('./user.js');
module.exports.Post= require('./post.js');


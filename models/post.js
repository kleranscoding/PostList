const mongoose= require('mongoose');
const Schema= mongoose.Schema;

const postSchema= new mongoose.Schema({
  'title': String,
  'post_by': {'type': mongoose.Schema.Types.ObjectId, 'ref': 'User'},
  'categories': [{'type': mongoose.Schema.Types.ObjectId, 'ref': 'Category'}],
  'date_of_post': String,
  'description': String,
  'contact_info': String,
  'images': [String],
});

const Post= mongoose.model('Post',postSchema);
module.exports= Post;

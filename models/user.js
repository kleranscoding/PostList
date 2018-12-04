const mongoose= require('mongoose');
const Schema= mongoose.Schema;

const userSchema= new mongoose.Schema({
  'email': {'type': String, 'unique': true, 'required': true, 'lowercase': true},
  'password': {'type': String, 'required': true},
  'username': String,
  'location': String,
  'join_date': String,
  'img_url': String,
  'preference': [{'type': mongoose.Schema.Types.ObjectId, 'ref': 'Category'}],
});

const User= mongoose.model('User',userSchema);
module.exports= User;

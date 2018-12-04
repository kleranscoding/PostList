const mongoose= require('mongoose');
const Schema= mongoose.Schema;

const categorySchema= new mongoose.Schema({
  'name': String,
  'description': String,
});

const Category= mongoose.model('Category',categorySchema);
module.exports= Category;

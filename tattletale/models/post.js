let mongoose = require('mongoose');
const connectDB = require('../database');

connectDB();
let Post = mongoose.model('Post', {
  title: String,
  body: String,
});

module.exports = Post;

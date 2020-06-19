var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  access_token: {
    type: String,
    required: true
  },


});

module.exports = mongoose.model('Article', ArticleSchema);
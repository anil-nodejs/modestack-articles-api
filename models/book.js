var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookSchema = new Schema({
  code: {
    type: String,
    required: true
  },
  className: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  unitName: {
    type: String,
    required: true
  },
  subSubject: {
    type: String,
    required: true
  },
  api_controller:
  {
    type: String,
    required: true
  }

});

module.exports = mongoose.model('Book', BookSchema);
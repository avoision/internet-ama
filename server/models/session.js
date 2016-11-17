var mongoose = require('mongoose');

// define the schema for our user model
var sessionSchema = mongoose.Schema({
  _id: String,
  session: {},
  expires: {}
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Session', sessionSchema);

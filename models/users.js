const mongoose = require('mongoose'); //utilising mongoose means we must require it

const  userSchema = new mongoose.Schema({
  _id : mongoose.Schema.Types.ObjectId,
  username : String,
  email : String,
  password :String
});

module.exports = mongoose.model('User', userSchema);
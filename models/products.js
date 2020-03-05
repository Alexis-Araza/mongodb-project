const mongoose = require('mongoose'); //utilising mongoose means we must require it

const  userSchema = new mongoose.Schema({
  _id : mongoose.Schema.Types.ObjectId,
  product : String,
  price : String,
  description : String
});

module.exports = mongoose.model('Product', userSchema);
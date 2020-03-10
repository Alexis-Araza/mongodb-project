const mongoose = require('mongoose'); //utilising mongoose means we must require it

const  userSchema = new mongoose.Schema({
  _id : mongoose.Schema.Types.ObjectId,
  product : String,
  price : String,
  description : String,
  user_id :{
  	type : mongoose.Schema.Types.ObjectId,
  	ref : 'User'
  }
});

module.exports = mongoose.model('Product', userSchema);
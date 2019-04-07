const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Chats = new Schema({
  msg: {type:String},
  time: {type:Date, index:true},
  userId: {type:String},
  name: {type:String}
});

module.exports = mongoose.model('chats', Chats);

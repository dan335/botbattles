const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Server = new Schema({
  name: {type:String, required:true},
  address: {type:String, required:true},  // for websocket connection
  url: {type:String, required:true}       // url for stats
});

module.exports = mongoose.model('Server', Server);

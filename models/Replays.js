const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Replays = new Schema({
  createdAt: {type:Date},
  gameStart: {type:Number, index: true},
  json: {type:String},
  gameId: {type:String, index: true}
});

module.exports = mongoose.model('replays', Replays);

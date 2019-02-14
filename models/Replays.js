const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Replays = new Schema({
  createdAt: {type:Date},
  json: {type:String},
  gameId: {type:String}
});

module.exports = mongoose.model('replays', Replays);

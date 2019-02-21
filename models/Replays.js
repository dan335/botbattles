const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Replays = new Schema({
  createdAt: {type:Date},
  json: {type:String},
  gameId: {type:String, index: true}
});

Replays.index({ createdAt:-1 });

module.exports = mongoose.model('replays', Replays);

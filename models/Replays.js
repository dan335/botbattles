const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Replays = new Schema({
  createdAt: {type:Date, index: true},
  gameId: {type:String}
});

module.exports = mongoose.model('replays', Replays);

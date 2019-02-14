const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Games = new Schema({
  createdAt: {type:Date},
  startedAt: {type:Date},
  endedAt: {type:Date},
  length: {type:Number},
  players: {type:Array}
});

module.exports = mongoose.model('games', Games);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Abilities = new Schema({
  abilityId: {type:String, unique: true, index: true},
  name: {type:String, index: true},
  description: {type:String},
  uses: {type:Number, index: true},
  wins: {type:Number, index: true},
  winPercent: {type:Number, index: true},
  usedWith: {type:Array},
  categories: {type:Array}
});

module.exports = mongoose.model('abilities', Abilities);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Combos = new Schema({
  abilityIds: {type:String, unique: true, index: true},
  uses: {type:Number, index: true},
  wins: {type:Number, index: true},
  winPercent: {type:Number, index: true}
});

module.exports = mongoose.model('combos', Combos);

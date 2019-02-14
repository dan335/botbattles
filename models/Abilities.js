const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Abilities = new Schema({
  abilityId: {type:String, unique: true, index: true},
  name: {type:String},
  description: {type:String},
  uses: {type:Number},
  wins: {type:Number}
});

module.exports = mongoose.model('abilities', Abilities);

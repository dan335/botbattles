const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplayData = new Schema({
  json: {type:String}
});

module.exports = mongoose.model('ReplayData', ReplayData);

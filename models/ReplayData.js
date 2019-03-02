const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplayData = new Schema({
  json: {type:Object}
});

module.exports = mongoose.model('ReplayData', ReplayData);

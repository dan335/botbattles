const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');



const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    index: true,
    required: true,
    trim: true,
    lowercase: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {type:String, required:true},
  token: {type:String, required:true},
  createdAt: Date,
  updatedAt: Date,
  isAdmin: {type:Boolean, required:true},

  plays: {type:Number},
  wins: {type:Number},
  kills: {type:Number},
  damage: {type:Number},
  rating: {type:Number}
});


UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({ email:email }).exec(function(err, user) {
    if (err) {
      return callback(err);
    } else if (!user) {
      var err = new Error('User not found.');
      err.status = 401;
      return callback(err);
    }

    bcrypt.compare(password, user.password, function(err, result) {
      if (result === true) {
        return callback(null, user);
      } else {
        return callback('Wrong password.');
      }
    })
  })
}

var User = mongoose.model('User', UserSchema);
module.exports = User;

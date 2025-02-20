const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt');

const registrationSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    unique: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  like_list:{
    type: Array
  }
  
});


registrationSchema.plugin(passportLocalMongoose, {
  
  hashField: 'password',

  
  passwordValidator: (password, cb) => {
    if (password.length < 8) {
      return cb('Password must be at least 8 characters long');
    }
    
    return cb();
  },

  
  encryptPassword: function(password, cb) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return cb(err);
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) return cb(err);
        return cb(null, hash);
      });
    });
  },

  
  comparePassword: function(candidatePassword, hashedPassword, cb) {
    bcrypt.compare(candidatePassword, hashedPassword, (err, isMatch) => {
      if (err) return cb(err);
      return cb(null, isMatch);
    });
  }
});

module.exports = mongoose.model('Registration', registrationSchema);
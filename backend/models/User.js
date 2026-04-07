const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    // Not required because Google OAuth users do not have a standard password
    required: false,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // sparse allows multiple nulls
  },
  profilePicture: {
    type: String,
    default: '',
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

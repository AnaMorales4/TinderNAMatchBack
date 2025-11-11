const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
  },

  age: {
    type: Number,
    required: true,
  },

  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
  },

  interests: [String],

  bio: {
    type: String,
    maxlength: 300,
  },

  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], //[longitude, latitude]
      default: [0, 0],
    },
  },

  profilePhoto: [String], //URLs

  swipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', //foreign key
  }],

  matches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', //foreign key
  }],

}, {
  timestamps: true,
});

userSchema.index({ location: '2dsphere' }); //NOTE: búsqueda geoespacial, por revisar

module.exports = mongoose.model('User', userSchema);

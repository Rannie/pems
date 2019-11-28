'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: String,
  password: String,
  nick_name: String,
  head_img: String,
  create_at: {
    type: Date,
    default: Date.now
  }
});

userSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema, 'user');

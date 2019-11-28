'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const lampinsSchema = new Schema({
  date: Date,
  road_name: String,
  record: String,
  resolved: Boolean,
  create_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lampins', lampinsSchema, 'lampins');

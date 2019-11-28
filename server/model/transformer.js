'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const transSchema = new Schema({
  serial_number: String,
  model: String,
  substation: { type: ObjectId, ref: 'Substation' },
  transbox: { type: ObjectId, ref: 'Transbox' },
  create_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transformer', transSchema, 'transformer');

'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const voltageSchema = new Schema({
  number: String,
  range: String,
  model: String,
  substation: { type: ObjectId, ref: 'Substation' },
  transbox: { type: ObjectId, ref: 'Transbox' },
  create_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Index', voltageSchema, 'voltage');

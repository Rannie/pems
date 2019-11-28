'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const substationSchema = new Schema({
  name: String,
  superior: String,
  user_comp: String,
  contact_info: String,
  number: String,
  appear_pic: String,
  location_pic: String,
  area: String,
  high_vols: [{
    type: ObjectId,
    ref: 'Voltage',
    default: [],
  }],
  low_vols: [{
    type: ObjectId,
    ref: 'Lowvol',
    default: [],
  }],
  transformers: [{
    type: ObjectId,
    ref: 'Transformer',
    default: [],
  }],
  worklogs: [{
    type: ObjectId,
    ref: 'Worklog',
    default: [],
  }],
  create_at: {
    type: Date,
    default: Date.now
  }
});

substationSchema.index({ area: 1 });

module.exports = mongoose.model('Substation', substationSchema, 'substation');

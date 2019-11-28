'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const worklogSchema = new Schema({
  date: Date,
  content: String,
  resolved: Boolean,
  notify_user: Boolean,
  substation: { type: ObjectId, ref: 'Substation' },
  transbox: { type: ObjectId, ref: 'Transbox' },
  create_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Worklog', worklogSchema, 'worklog');

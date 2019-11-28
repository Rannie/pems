'use strict';

const mongoose = require('mongoose');
const config = require('../config');

mongoose.connect(config.MONGO_PATH, {
  useNewUrlParser: true,
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  useFindAndModify: false
}).then(res => {
    console.log('database connect success');
  }, err => {
    console.log('database connect failed');
    process.exit(1);
});

module.exports = {
  User: require('./user'),
  Substation: require('./substation'),
  Voltage: require('./voltage'),
  Lowvol: require('./lowvol'),
  Transformer: require('./transformer'),
  Worklog: require('./worklog'),
  Lampins: require('./lampins'),
  Transbox: require('./transbox'),
};

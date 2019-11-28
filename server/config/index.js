const path = require('path');

let config;

if (process.env.ENV_PHASE === 'dev') {
  config = {
    SERVE_PATH: path.resolve(__dirname, '../../views/dist'),
    MONGO_PATH: ''
  };
}

if (process.env.ENV_PHASE === 'prod') {
  config = {
    SERVE_PATH: '/var/www/pems',
    MONGO_PATH: ''
  };
}

config.JWT_SECRET = '';
config.JWT_EXPIRE = '15 day';
config.RATE_LIMIT_MAX = 1000;
config.RATE_LIMIT_DURATION = 1000;

config.DEFAULT_PAGE_SIZE = 8;
config.SMALL_PAGE_SIZE = 5;

module.exports = config;

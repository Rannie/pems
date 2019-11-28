'use strict';

let SERVICE_URL = process.env.MOCK ? '"MOCK_SERVER_URL"' : '"http://localhost:3700"';

module.exports = {
  NODE_ENV: JSON.stringify('development'),
  SERVICE_URL,
  INDEX_URL: '"http://localhost:8080"',
};

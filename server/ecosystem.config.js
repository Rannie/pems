module.exports = {
  apps : [
    {
      name: 'PEMSStaticServer',
      script: './app.js',

      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',

      output: '~/.pm2/logs/pems-static/ss.out.log',
      error: '~/.pm2/logs/pems-static/ss.error.log',
      merge_logs: true,
      log_date_format: "YYYY-MM-DD hh:mm:ss",
    },
    {
      name: 'PEMSApiServer',
      script: './server.js',

      instances: 2,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',

      output: '~/.pm2/logs/pems-api/ss.out.log',
      error: '~/.pm2/logs/pems-api/ss.error.log',
      merge_logs: true,
      log_date_format: "YYYY-MM-DD hh:mm:ss",
    }
  ],
};

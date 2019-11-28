'use strict';

const config = require('../config');
const Router = require('koa-router');
const ratelimit = require('koa-ratelimit');
const {
  user,
  substation,
  lampins,
  transbox,
  transformer,
  voltage,
  lowvol,
  worklog
} = require('../controller');
const util = require('../util');

const apiRouter = new Router({ prefix: '/api/pems' });
const rate = ratelimit({
  db: null,
  id: ctx => ctx.url,
  max: config.RATE_LIMIT_MAX,
  duration: config.RATE_LIMIT_DURATION,
  errorMessage: 'Sometimes You Just Have to Slow Down.',
  headers: {
    remaining: 'Rate-Limit-Remaining',
    reset: 'Rate-Limit-Reset',
    total: 'Rate-Limit-Total'
  }
});

// user
apiRouter
  .post('/login', user.login)
// substation
  .get('/substation/list', substation.list)
  .post('/substation/create', substation.create)
  .post('/substation/update', substation.update)
  .post('/substation/delete', substation.delete)
// voltage
  .get('/voltage/list', voltage.list)
  .post('/voltage/create', voltage.create)
  .post('/voltage/update', voltage.update)
  .post('/voltage/delete', voltage.delete)
// lowvol
  .get('/lowvol/list', lowvol.list)
  .post('/lowvol/create', lowvol.create)
  .post('/lowvol/update', lowvol.update)
  .post('/lowvol/delete', lowvol.delete)
// transformer
  .get('/transformer/list', transformer.list)
  .post('/transformer/create', transformer.create)
  .post('/transformer/update', transformer.update)
  .post('/transformer/delete', transformer.delete)
// worklog
  .get('/worklog/list', worklog.list)
  .post('/worklog/create', worklog.create)
  .post('/worklog/update', worklog.update)
  .post('/worklog/delete', worklog.delete)
// lampins
  .get('/lampins/list', lampins.list)
  .post('/lampins/create', lampins.create)
  .post('/lampins/update', lampins.update)
  .post('/lampins/delete', lampins.delete)
// transbox
  .get('/transbox/list', transbox.list)
  .post('/transbox/create', transbox.create)
  .post('/transbox/update', transbox.update)
  .post('/transbox/delete', transbox.delete);

module.exports = apiRouter;

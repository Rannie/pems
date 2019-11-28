'use strict';

const koa = require('koa');
const cors = require('koa2-cors');
const logger = require('koa-logger');
const bodyParser = require('koa-body');
const koaJwt = require('koa-jwt');
const onerror = require('koa-onerror');
const validate = require('koa-validate');
const pathToRegexp = require('path-to-regexp');

const config = require('./config');
const middleware = require('./middleware');
const router = require('./router');

const app = new koa();

onerror(app);
validate(app);

app
  .use(cors())
  .use(logger())
  .use(middleware.util)
  .use(koaJwt({ secret: config.JWT_SECRET }).unless((ctx) => {
    if (/^\/api/.test(ctx.path)) {
      return pathToRegexp([
        '/api/pems/login'
      ]).test(ctx.path);
    }
    return true;
  }))
  .use(bodyParser({ multipart: true }))
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3700, () => {
  console.log('start pems api server, listen 3700');
});

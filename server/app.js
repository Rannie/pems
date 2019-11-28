'use strict';

const koa = require('koa');
const staticServe = require('koa-static-cache');
const router = require('koa-router');
const views = require('koa-views');
const cors = require('koa2-cors');
const logger = require('koa-logger');
const bodyParser = require('koa-body');
const config = require('./config');

let app = new koa();
let route = new router();

app
  .use(cors())
  .use(bodyParser())
  .use(logger())
  .use(staticServe(config.SERVE_PATH))
  .use(views(config.SERVE_PATH))
  .use(route.routes());

route.get('/*', async ctx => {
  await ctx.render('index.html');
});

app.listen(3010, () => {
  console.log('start pems static server, listen 3010');
});

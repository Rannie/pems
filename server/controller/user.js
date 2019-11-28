'use strict';

const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { User } = require('../model');
const ft = require('../model/fields_table');
const config = require('../config');

module.exports = class UserController {
  static async login(ctx) {
    let verifyPassword;
    const name = ctx.checkBody('name').notEmpty().value;
    const password = ctx.checkBody('password').notEmpty().value;

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors);
      return;
    }

    let user = await User.findOne({ name: name });

    if (!user) {
      ctx.body = ctx.util.refail('用户不存在');
      return;
    }

    verifyPassword = user.password === password;
    if (!verifyPassword) {
      ctx.body = ctx.util.refail('用户名或密码错误');
      return;
    }

    user.token = jwt.sign({ id: user.id, name: user.name }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRE });

    ctx.body = ctx.util.resuccess(_.pick(user, ft.user));
  }
};

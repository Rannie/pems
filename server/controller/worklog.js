'use strict';

const config = require('../config');
const { Worklog, Substation, Transbox } = require('../model');

module.exports = class WorklogController {
  static async list(ctx) {
    const pageIndex = ctx.checkQuery('page_index').empty().toInt().gt(0).default(1).value;
    const pageSize = ctx.checkQuery('page_size').empty().toInt().gt(0).default(config.DEFAULT_PAGE_SIZE).value;
    const subId = ctx.checkQuery('subId').value;
    const transId = ctx.checkQuery('transId').value;

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors);
      return;
    }

    const opt = {
      skip: (pageIndex - 1) * pageSize,
      limit: pageSize,
      sort: '-create_at'
    };

    let query;
    if (subId) {
      query = { substation: subId };
    }
    if (transId) {
      query = { transbox: transId };
    }

    const worklogs = await Worklog
      .find(query, null, opt)
      .populate({ path: 'substation', select: { name: 1 } })
      .populate({ path: 'transbox', select: { name: 1 } });
    const count = await Worklog.count(query);
    ctx.body = ctx.util.resuccess({ count, worklogs });
  }

  static async create(ctx) {
    const {
      date,
      content,
      resolved,
      notify_user,
      subId,
      transId
    } = ctx.request.body;

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors);
      return;
    }

    const newWorklog = new Worklog({
      date, content, resolved, notify_user, substation: subId, transbox: transId,
    });
    newWorklog.save();

    if (subId) {
      const substation = await Substation.findOne({ _id: subId });
      substation.worklogs.push(newWorklog);
      substation.save();
    }
    if (transId) {
      const transbox = await Transbox.findOne({ _id: transId });
      transbox.worklogs.push(newWorklog);
      transbox.save();
    }

    ctx.body = ctx.util.resuccess();
  }

  static async update(ctx) {
    const logId = ctx.checkBody('_id').notEmpty().value;
    const {
      date,
      content,
      resolved,
      notify_user,
    } = ctx.request.body;

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors);
      return;
    }

    await Worklog.findOneAndUpdate( { _id: logId }, {
      date, content, resolved, notify_user
    }, null, (err) => {
      if (err) {
        ctx.body = ctx.util.refail(err.message, null, err);
      } else {
        ctx.body = ctx.util.resuccess();
      }
    });
  }

  static async delete(ctx) {
    const logId = ctx.checkBody('id').notEmpty().value;

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors);
      return;
    }

    await Worklog.findByIdAndRemove(logId);

    ctx.body = ctx.util.resuccess();
  }
};

'use strict';

const config = require('../config');
const { Transbox, Voltage, Lowvol, Transformer, Worklog } = require('../model');

module.exports = class TransboxController {
  static async list(ctx) {
    const pageIndex = ctx.checkQuery('page_index').empty().toInt().gt(0).default(1).value;
    const pageSize = ctx.checkQuery('page_size').empty().toInt().gt(0).default(config.DEFAULT_PAGE_SIZE).value;
    const fil_area = ctx.checkQuery('fil_area').empty().value;

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors);
      return;
    }

    const opt = {
      skip: (pageIndex - 1) * pageSize,
      limit: pageSize,
      sort: '-create_at'
    };
    const where = fil_area ? { area: fil_area } : null;

    const transboxs = await Transbox
      .find(where, null, opt)
      .populate({ path: 'worklogs', select: { resolved: 1, notify_user: 1 } });
    const count = await Transbox.count(where);

    ctx.body = ctx.util.resuccess({ count, transboxs });
  }

  static async create(ctx) {
    const name = ctx.checkBody('name').notEmpty().value;
    const {
      superior,
      user_comp,
      contact_info,
      appear_pic,
      location_pic,
      area
    } = ctx.request.body;

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors);
      return;
    }

    const transbox = await Transbox.findOne({ 'name': name });
    if (transbox) {
      ctx.body = ctx.util.refail(`${name} 变电箱已存在`);
      return;
    }

    const newTransbox = new Transbox({
      name, superior,user_comp, contact_info, appear_pic, location_pic, area
    });
    newTransbox.save();

    ctx.body = ctx.util.resuccess();
  }

  static async update(ctx) {
    const transId = ctx.checkBody('_id').notEmpty().value;
    const name = ctx.checkBody('name').notEmpty().value;
    const {
      superior,
      user_comp,
      contact_info,
      appear_pic,
      location_pic,
      area
    } = ctx.request.body;

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors);
      return;
    }

    const transbox = await Transbox.findOne({ 'name': name });
    if (transbox && transbox._id.toString() !== transId) {
      ctx.body = ctx.util.refail(`${name} 变电箱已存在`);
      return;
    }

    await Transbox.findOneAndUpdate({ _id: transId }, {
      name,
      superior,
      user_comp,
      contact_info,
      appear_pic,
      location_pic,
      area
    }, null, (err) => {
      if (err) {
        ctx.body = ctx.util.refail(err.message, null, err);
      } else {
        ctx.body = ctx.util.resuccess();
      }
    });
  }

  static async delete(ctx) {
    const transId = ctx.checkBody('id').notEmpty().value;

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors);
      return;
    }

    const query = { transbox: transId };
    await Voltage.deleteMany(query);
    await Lowvol.deleteMany(query);
    await Transformer.deleteMany(query);
    await Worklog.deleteMany(query);
    await Transbox.findByIdAndRemove(transId);

    ctx.body = ctx.util.resuccess();
  }
};

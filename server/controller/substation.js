'use strict';

const config = require('../config');
const { Substation, Voltage, Lowvol, Transformer, Worklog } = require('../model');

module.exports = class SubstationController {
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

    const substations = await Substation
      .find(where, null, opt)
      .populate({ path: 'worklogs', select: { resolved: 1, notify_user: 1 } });
    const count = await Substation.count(where);

    ctx.body = ctx.util.resuccess({ count, substations });
  }

  static async create(ctx) {
    const name = ctx.checkBody('name').notEmpty().value;
    const {
      superior,
      user_comp,
      contact_info,
      number,
      appear_pic,
      location_pic,
      area
    } = ctx.request.body;

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors);
      return;
    }

    const substation = await Substation.findOne({ 'name': name });
    if (substation) {
      ctx.body = ctx.util.refail(`${name} 变电所已存在`);
      return;
    }

    const newSub = new Substation({
      name, superior, user_comp, number, contact_info, appear_pic, location_pic, area
    });
    newSub.save();

    ctx.body = ctx.util.resuccess();
  }

  static async update(ctx) {
    const subId = ctx.checkBody('_id').notEmpty().value;
    const name = ctx.checkBody('name').notEmpty().value;
    const {
      superior,
      user_comp,
      contact_info,
      number,
      appear_pic,
      location_pic,
      area
    } = ctx.request.body;

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors);
      return;
    }

    const substation = await Substation.findOne({ 'name': name });
    if (substation && substation._id.toString() !== subId) {
      ctx.body = ctx.util.refail(`${name} 变电所已存在`);
      return;
    }

    await Substation.findOneAndUpdate({ _id: subId }, {
      name,
      superior,
      user_comp,
      contact_info,
      number,
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
    const subId = ctx.checkBody('id').notEmpty().value;

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors);
      return;
    }

    const query = { substation: subId };
    await Voltage.deleteMany(query);
    await Lowvol.deleteMany(query);
    await Transformer.deleteMany(query);
    await Worklog.deleteMany(query);
    await Substation.findByIdAndRemove(subId);

    ctx.body = ctx.util.resuccess();
  }
};

'use strict';

const config = require('../config');
const { Voltage, Substation, Transbox } = require('../model');

module.exports = class VoltageController {
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

    const voltages = await Voltage.find(query, null, opt);
    const count = await Voltage.count(query);
    ctx.body = ctx.util.resuccess({ count, voltages });
  }

  static async create(ctx) {
    const number = ctx.checkBody('number').notEmpty().value;
    const {
      range,
      model,
      subId,
      transId
    } = ctx.request.body;

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors);
      return;
    }

    const voltage = await Voltage.findOne({ 'number': number });
    if (voltage) {
      ctx.body = ctx.util.refail(`${number} 调度号的高压室已经存在`);
      return;
    }

    const newVol = new Voltage({
      number, range, model, substation: subId, transbox: transId,
    });
    newVol.save();

    if (subId) {
      const substation = await Substation.findOne({ _id: subId });
      substation.high_vols.push(newVol);
      substation.save();
    }
    if (transId) {
      const transbox = await Transbox.findOne({ _id: transId });
      transbox.high_vols.push(newVol);
      transbox.save();
    }

    ctx.body = ctx.util.resuccess();
  }

  static async update(ctx) {
    const volId = ctx.checkBody('_id').notEmpty().value;
    const number = ctx.checkBody('number').notEmpty().value;
    const {
      range,
      model
    } = ctx.request.body;

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors);
      return;
    }

    const voltage = await Voltage.findOne({ 'number': number });
    if (voltage && voltage._id.toString() !== volId) {
      ctx.body = ctx.util.refail(`调度号 ${number} 的高压室已经存在`);
      return;
    }

    await Voltage.findOneAndUpdate( { _id: volId }, {
      number, range, model
    }, null, (err) => {
      if (err) {
        ctx.body = ctx.util.refail(err.message, null, err);
      } else {
        ctx.body = ctx.util.resuccess();
      }
    });
  }

  static async delete(ctx) {
    const volId = ctx.checkBody('id').notEmpty().value;

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors);
      return;
    }

    await Voltage.findByIdAndRemove(volId);

    ctx.body = ctx.util.resuccess();
  }
};

'use strict';

const config = require('../config');
const { Transformer, Substation, Transbox } = require('../model');

module.exports = class TransformerController {
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

    const transformers = await Transformer.find(query, null, opt);
    const count = await Transformer.count(query);
    ctx.body = ctx.util.resuccess({ count, transformers });
  }

  static async create(ctx) {
    const serial_number = ctx.checkBody('serial_number').notEmpty().value;
    const {
      model,
      subId,
      transId
    } = ctx.request.body;

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors);
      return;
    }

    const transformer = await Transformer.findOne({ 'serial_number': serial_number });
    if (transformer) {
      ctx.body = ctx.util.refail(`${serial_number} 编号变压器已经存在`);
      return;
    }

    const newTrans = new Transformer({
      serial_number, model, substation: subId, transbox: transId,
    });
    newTrans.save();

    if (subId) {
      const substation = await Substation.findOne({ _id: subId });
      substation.transformers.push(newTrans);
      substation.save();
    }
    if (transId) {
      const transbox = await Transbox.findOne({ _id: transId });
      transbox.transformers.push(newTrans);
      transbox.save();
    }

    ctx.body = ctx.util.resuccess();
  }

  static async update(ctx) {
    const transId = ctx.checkBody('_id').notEmpty().value;
    const serial_number = ctx.checkBody('serial_number').notEmpty().value;
    const {
      model
    } = ctx.request.body;

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors);
      return;
    }

    const transformer = await Transformer.findOne({ 'serial_number': serial_number });
    if (transformer && transformer._id.toString() !== transId) {
      ctx.body = ctx.util.refail(`${serial_number} 编号变压器已经存在`);
      return;
    }

    await Transformer.findOneAndUpdate( { _id: transId }, {
      serial_number, model
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

    await Transformer.findByIdAndRemove(transId);

    ctx.body = ctx.util.resuccess();
  }
};

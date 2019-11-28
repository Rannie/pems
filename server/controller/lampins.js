'use strict';

const config = require('../config');
const { Lampins } = require('../model');

module.exports = class LampinsController {
  static async list(ctx) {
    const pageIndex = ctx.checkQuery('page_index').empty().toInt().gt(0).default(1).value;
    const pageSize = ctx.checkQuery('page_size').empty().toInt().gt(0).default(config.DEFAULT_PAGE_SIZE).value;
    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors);
      return;
    }

    const opt = {
      skip: (pageIndex - 1) * pageSize,
      limit: pageSize,
      sort: '-create_at'
    };

    const lampins = await Lampins.find(null, null, opt);
    const count = await Lampins.count();
    ctx.body = ctx.util.resuccess({ count, lampins });
  }

  static async create(ctx) {
    const {
      date,
      road_name,
      record,
      resolved,
    } = ctx.request.body;

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors);
      return;
    }

    const newLampins = new Lampins({
      date, road_name, resolved, record
    });
    newLampins.save();

    ctx.body = ctx.util.resuccess();
  }

  static async update(ctx) {
    const insId = ctx.checkBody('_id').notEmpty().value;
    const {
      date,
      road_name,
      record,
      resolved,
    } = ctx.request.body;

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors);
      return;
    }

    await Lampins.findOneAndUpdate( { _id: insId }, {
      date, road_name, resolved, record
    }, null, (err) => {
      if (err) {
        ctx.body = ctx.util.refail(err.message, null, err);
      } else {
        ctx.body = ctx.util.resuccess();
      }
    });
  }

  static async delete(ctx) {
    const insId = ctx.checkBody('id').notEmpty().value;

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors);
      return;
    }

    await Lampins.findByIdAndRemove(insId);

    ctx.body = ctx.util.resuccess();
  }
};

/*
 * Aliyun EMAS serverless
 */
module.exports = async (ctx) => {
  const targetDB = ctx.mpserverless.db.collection(ctx.args.db)
  try {
    // ctx.logger.info('invoke args: %j', ctx.args);

    if (ctx.args.type == "insert") {
      return await targetDB.insertOne(ctx.args.data)
    }

    if (ctx.args.type == "update") {
      return await targetDB.updateOne(
        {_id: ctx.args._id},
        {$set: ctx.args.data}
      )
    }

    if (ctx.args.type == "delete") {
      return await targetDB.deleteOne(ctx.args.condition)
    }

    if (ctx.args.type == "get") {
      // ctx.logger.info('db find: %j', ctx.args);
      return await targetDB.find(ctx.args.condition,
        {limit: ctx.args.limit, skip: ctx.args.limit * ctx.args.skip})
    }
  } catch (e) {
    console.error(e)
  }
}

/*
 * Tencent cloud serverless
 *
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const targetDB = db.collection(event.db)
  try {
    if (event.type == "insert") {
      return await targetDB.add({
        data: event.data
      })
    }

    if (event.type == "update") {
      return await targetDB.doc(event.indexKey).update({
        data: event.data
      })
    }

    if (event.type == "delete") {
      return await targetDB.where(event.condition).remove()
    }

    if (event.type == "get") {
      return await targetDB.where(event.condition)
        .skip(event.limit * event.skip)
        .limit(event.limit)
        .get()
    }
  } catch (e) {
    console.error(e)
  }
}
*/
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var docid = event.docid
  var vdata1 = event.players
  var barlist = []

  try {
    barlist = await db.collection('foos_barlist').get({
      data: {
        players: vdata1
      }
    })
  } catch (e) {
    console.log(e)
  }
}
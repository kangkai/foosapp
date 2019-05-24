// 云函数入口文件
const cloud = require('wx-server-sdk')

// cloud.init()
cloud.init({
  env: 'foosball-test1',
  traceUser: true
})
const db = cloud.database()

const result = {
  code: '',
  body: ''
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var docid = event.bar._id

  /* not admin && not super admin (Yin Kangkai) */
  try {
    const check = await db.collection('foos_bardetail').doc(docid).get().then((res) => {
      // console.log(res);

      if (res.data.length == 0) {
        result.code = 400;
        result.body = "no record";
        return result;
      } else if (res.data.admin_openid == wxContext.OPENID ||
        wxContext.OPENID == 'oxksR5evxcGhFCJxpbjrtb7Am6d0') {
        result.code = 200;
        result.body = res;
        return result;
      } else {
        result.code = 400;
        result.body = "You're not admin";
        return result;
      }
    })

    if (check.code == 200) {
      console.log("to update");
      delete event.bar._id;
      
      return await db.collection('foos_bardetail').doc(docid).update({
        data: event.bar
      }).then((res) => {
        console.log("update done")
        result.code = 200;
        result.body = res;
        return result;
      })
    }

  } catch (e) {
    console.log(e)
  }
}

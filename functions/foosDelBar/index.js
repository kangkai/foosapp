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
  const wxContext = cloud.getWXContext();
  var checkbarlist = {};

  try {
    /* not admin && not super admin (Yin Kangkai) */
    if (wxContext.OPENID != 'oxksR5evxcGhFCJxpbjrtb7Am6d0') {
      result.code = 400;
      result.body = "You're not admin";
      return result;
    }

    /* check bar and city in foos_barlist */
    checkbarlist = await db.collection('foos_barlist').where({
      places: event.bar.barid
    }).get().then((res) => {
      console.log("foos_barlist search result: ", res);

      if (res.data.length == 0) {
        result.code = -1;
        result.body = "no record";
        return result;
      } else if (res.data.length > 1) {
        result.code = -2;
        result.body = res;
        result.msg = "more than 1 record";
        return result;
      } else {
        result.code = 200;
        result.docid = res.data[0]._id;
        result.places = res.data[0].places;
        result.body = res;
        return result;
      }
    })

    if (checkbarlist.code < 0) {
      /* return immediately */
      return checkbarlist;
    }

    if (checkbarlist.code == 200) {
      var docid = checkbarlist.docid;
      var places = checkbarlist.places;

      places.forEach(function (item, index, arr) {
        if (item === event.bar.barid) {
          arr.splice(index, 1);
        }
      });

      if (places.length == 0) {
        /* Del the only bar in the city, then we del city */
        return await db.collection('foos_barlist')
          .doc(docid)
          .remove()
          .then((res) => {
            console.log("Del place and city done.")
            result.code = 200;
            result.body = res;
            return result;
          })
      } else {
        /* more than 1 bar in city, just update barlist */
        return await db.collection('foos_barlist')
          .doc(docid)
          .update({
            data: {
              places: places
            }
          })
          .then((res) => {
            console.log("Del places done.")
            result.code = 200;
            result.body = res;
            return result;
          })
      }
    }
  } catch (e) {
    console.log(e)
  }
}

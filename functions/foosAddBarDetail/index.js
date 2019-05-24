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
  var addbarlist = {};
  addbarlist.code = 0;
  var addbarlistplaces = {};
  var checkbarlist = {};

  try {
    /* not admin && not super admin (Yin Kangkai) */
    if (wxContext.OPENID != 'oxksR5evxcGhFCJxpbjrtb7Am6d0') {
      result.code = 400;
      result.body = "You're not admin";
      return result;
    }

    /* we do not check duplicity here, add directly */
    checkbarlist = await db.collection('foos_barlist').where({
      city: event.bar.city
    }).get().then((res) => {
      console.log(res);

      if (res.data.length == 0) {
        result.code = 1;
        result.body = "no record";
        return result;
      } else {
        result.code = 200;
        result.docid = res.data[0]._id;
        result.places = res.data[0].places;
        result.body = res;
        return result;
      }
    })

    if (checkbarlist.code == 1) {
      console.log("No city.");

      addbarlist = await db.collection('foos_barlist').add({
        data: {
          city: event.bar.city,
          places: []
        }
      }).then((res) => {
        console.log(res);

        if (res.length == 0) {
          result.code = -1;
          result.body = "Add city fail.";
          return result;
        } else {

          result.code = 200;
          result.docid = res._id;
          result.places = [];
          result.body = res;
          return result;
        }
      })

      if (addbarlist.code < 0) {
        /* return immediately */
        return addbarlist;
      }
    }

    if (checkbarlist.code == 200) {
      console.log("City already there: ", checkbarlist);

      var docid = checkbarlist.docid;
      var places = checkbarlist.places;
      places.push(event.bar.barid);

      addbarlistplaces = await db.collection('foos_barlist')
        .doc(docid)
        .update({
          data: {
            places: places
          }
        })
        .then((res) => {
          console.log("update places done")
          result.code = 200;
          result.body = res;
          return result;
        })

      if (addbarlistplaces.code == 200) {
        /* add into foos_bardetail */
        return await db.collection('foos_bardetail')
          .add({
            data: event.bar
          }).then((res) => {
            console.log("add bardetail done")
            result.code = 200;
            result.body = res;
            return result;
          })
      }

    } else if (addbarlist.code == 200) {
      console.log("City add done: ", addbarlist);

      var docid = addbarlist.docid;
      var places = [];
      places.push(event.bar.barid);

      addbarlistplaces = await db.collection('foos_barlist')
        .doc(docid)
        .update({
          data: {
            places: places
          }
        })
        .then((res) => {
          console.log("update done")
          result.code = 200;
          result.body = res;
          return result;
        })

      if (addbarlistplaces.code == 200) {
        /* add into foos_bardetail */
        return await db.collection('foos_bardetail')
          .add({
            data: event.bar
          }).then((res) => {
            console.log("add bardetail done")
            result.code = 200;
            result.body = res;
            return result;
          })
      }

    } else {
      result.code = -2;
      result.body = "Unknown error";
      return result;
    }

  } catch (e) {
    console.log(e)
  }
}

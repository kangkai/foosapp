
// 获取全局应用程序实例对象
var app = getApp();

var util = require('../../utils/util.js');

// 创建页面实例对象
Page({
  /**
   * 页面名称
   */
  name: "place",
  /**
   * 页面的初始数据
   */

  data: {
    name_disabled: true,
    bar: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    var disabled = true;

    wx.showShareMenu({
      withShareTicket: true
    })

    /* super admin */
    if (app.globalData.openid == 'oxksR5evxcGhFCJxpbjrtb7Am6d0') {
      // console.log("super: ", app.globalData.openid);
      disabled = false;
    } else {
      // console.log("normal user: ", app.globalData.openid)
    }

    this.setData({
      name_disabled: disabled,
      bar: app.globalData.idbars[app.globalData.cur_barid]
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    wx.stopPullDownRefresh() //停止下拉刷新 
  },


  //以下为自定义点击事件

  bindPlaceChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var bars = this.data.bars;

    this.setData({
      bar_index: e.detail.value,
      barid: bars[e.detail.value].barid
    })
  },

  formSubmit: function (e) {
    var that = this;
    var newbar = that.data.bar;

    // console.log(e);

    /* check if we want to del this bar */
    if (app.globalData.openid == 'oxksR5evxcGhFCJxpbjrtb7Am6d0' &&
      e.detail.value.name.length == 0 &&
      e.detail.value.address.length == 0) {

      /* Aliyun EMAS version */
      const collection = app.mpserverless.db.collection('foos_barlist');
      collection.find(
        { places: newbar.barid }
      ).then(res => {
        console.log("foos_barlist find result:", res);

        if (res.result.length == 0) {
          console.log("No record: ", newbar.barid);
          app.globalData.bar_refresh = true;
          wx.navigateBack({
            delta: 1
          })
          return;
        } else if (res.result.length > 1) {
          console.log("error, bar in more than 1 city: ", res.result);
          app.globalData.bar_refresh = true;
          wx.navigateBack({
            delta: 1
          })
          return;
        } else {
          var docid = res.result[0]._id;
          var places = res.result[0].places;

          places.forEach(function (item, index, arr) {
            if (item === newbar.barid) {
              arr.splice(index, 1);
            }
          });

          if (places.length == 0) {
            /* Del the only bar in the city, then we del city */
            return collection
              .deleteOne(
                { _id: docid }
              )
              .then((res2) => {
                console.log("Del place and city done: ", res2)
                app.globalData.bar_refresh = true;
                wx.navigateBack({
                  delta: 1
                })
                return;
              })
          } else {
            /* more than 1 bar in city, just update barlist */
            return collection
              .updateOne(
                { _id: docid },
                { $set: { places: places } }
              )
              .then((res2) => {
                console.log("Del places done: ", res2)
                app.globalData.bar_refresh = true;
                wx.navigateBack({
                  delta: 2
                })
                return;
              })
          }
        }

      }).catch(console.error);
      /* Aliyun EMAS version end */

      /* Tencent cloud version */
      /*
      wx.cloud.callFunction({
        name: 'foosDelBar',
        data: {
          bar: newbar
        },
        complete: res => {
          // console.log("foosDelBar: ", res)
          /* TODO: update idbars. app.globalData.idbars[newbar.barid] = newbar; 
          app.globalData.bar_refresh = true;
          wx.navigateBack({
            delta: 2
          })
        }
      })
      */
      /* Tencent cloud version end */

      return;
    }

    if (app.globalData.openid == 'oxksR5evxcGhFCJxpbjrtb7Am6d0') {
      newbar.name = e.detail.value.name;
      newbar.callout.content = newbar.name;
    }
    newbar.address = e.detail.value.address;
    newbar.longitude = e.detail.value.longitude;
    newbar.latitude = e.detail.value.latitude;
    newbar.contacts = e.detail.value.contacts;
    newbar.tables = e.detail.value.tables;
    newbar.intro = e.detail.value.intro;
    if (e.detail.value.admin_openid.length == 28) {
      newbar.admin_openid = e.detail.value.admin_openid;
      newbar.admin_nick = '';
      newbar.admin_avatarUrl = '';
    }

    // in reverse order
    if (e.detail.value.pic4.length)
      newbar.pic[4] = e.detail.value.pic4;
    else
      newbar.pic.splice(4, 1);

    if (e.detail.value.pic3.length)
      newbar.pic[3] = e.detail.value.pic3;
    else
      newbar.pic.splice(3, 1);

    if (e.detail.value.pic2.length)
      newbar.pic[2] = e.detail.value.pic2;
    else
      newbar.pic.splice(2, 1);

    if (e.detail.value.pic1.length)
      newbar.pic[1] = e.detail.value.pic1;
    else
      newbar.pic.splice(1, 1);

    if (e.detail.value.pic0.length)
      newbar.pic[0] = e.detail.value.pic0;
    else
      newbar.pic.splice(0, 1);

    newbar.lastChangeTime = util.formatTime(new Date());

    // console.log("newbar: ", newbar);

    /* Aliyun EMAS version */
    const collection = app.mpserverless.db.collection('foos_bardetail');
    collection.find(
      { _id: newbar._id }
    ).then(res => {
      console.log("foos_bardetail find result:", res);

      if (res.result.length == 0) {
        console.log("No record: ", newbar._id);
        app.globalData.bar_refresh = true;
        wx.navigateBack({
          delta: 1
        })
        return;
      } else if (res.result.admin_openid == app.globalData.openid ||
        app.globalData.openid == 'oxksR5evxcGhFCJxpbjrtb7Am6d0') {
        console.log("to update");

        var docid = newbar._id;
        delete newbar._id;
        return app.mpserverless.db.collection('foos_bardetail')
          .updateOne(
            { _id: docid },
            { $set: newbar }
          )
          .then((res2) => {
            console.log("update done: ", res2)
            app.globalData.bar_refresh = true;
            wx.navigateBack({
              delta: 1
            })
            return;
          })
      } else {
        console.log("You're not admin");
        wx.navigateBack({
          delta: 1
        })
        return;
      }
    }).catch(console.error);
    /* Aliyun EMAS version end */

    /* Tencent cloud version */
    /*
    wx.cloud.callFunction({
      name: 'foosUpdateBarDetail',
      data: {
        bar: newbar
      },
      complete: res => {
        // console.log("foosUpdateBarDetail: ", res)
        app.globalData.idbars[newbar.barid] = newbar;
        app.globalData.bar_refresh = true;
        wx.navigateBack({
          delta: 1
        })
      }
    })
    */
    /* Tencent cloud version end */

  },

  formReset: function () {
    console.log('form发生了reset事件')
  },

})


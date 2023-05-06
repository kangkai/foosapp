
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
    openid: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.setData({
      openid: app.globalData.openid
    })

    wx.showShareMenu({
      withShareTicket: true
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
    var newbar = {};

    // console.log(e);

    newbar.name = e.detail.value.name;
    newbar.city = e.detail.value.city;
    if (newbar.name.length == 0 ||
      newbar.city.length == 0) {
      console.warn("name and city should not be null.");
      return;
    }
    newbar.callout = {};
    newbar.callout.content = newbar.name;
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
    newbar.pic = [];
    if (e.detail.value.pic0.length) newbar.pic[0] = e.detail.value.pic0;
    if (e.detail.value.pic1.length) newbar.pic[1] = e.detail.value.pic1;
    if (e.detail.value.pic2.length) newbar.pic[2] = e.detail.value.pic2;
    if (e.detail.value.pic3.length) newbar.pic[3] = e.detail.value.pic3;
    if (e.detail.value.pic4.length) newbar.pic[4] = e.detail.value.pic4;
    newbar.lastChangeTime = util.formatTime(new Date());
    newbar.barid = Math.random().toString(36).substr(2, 15);
    newbar.iconPath = "/images/poi80.png";
    newbar.width = 30;
    newbar.height = 30;
    newbar.logo = "";

    // console.log("newbar: ", newbar);

    /* Aliyun EMAS version */
    if (this.data.openid != 'oxksR5evxcGhFCJxpbjrtb7Am6d0') {
      console.log("Only super admin can add places.");
      return;
    }

    const collection = app.mpserverless.db.collection('foos_barlist');
    collection.find(
      { city: newbar.city }
    ).then(res => {
      console.log(res);

      if (res.result.length == 0) {
        console.log("No city.");

        collection.insertOne(
          {
            city: newbar.city,
            places: [newbar.barid]
          }
        ).then((res2) => {
          console.log(res2);

          if (!res2.result.success) {
            console.log("Add city fail: ", res2);
            return;
          } else {
            /* add into foos_bardetail */
            return app.mpserverless.db.collection('foos_bardetail').insertOne(newbar)
              .then((res3) => {
                console.log("add bardetail done: ", res3);
                app.globalData.idbars[newbar.barid] = newbar;
                app.globalData.bar_refresh = true;
              })
          }
        })

      } else {

        console.log("City already there ");

        var docid = res.result[0]._id;
        var places = res.result[0].places;
        places.push(newbar.barid);

        addbarlistplaces = collection.updateOne(
          { _id: docid },
          { $set: { places: places } }
        )
          .then((res2) => {
            console.log("update places done: ", res2)
            /* add into foos_bardetail */
            return app.mpserverless.db.collection('foos_bardetail').insertOne(newbar)
              .then((res3) => {
                console.log("add bardetail done: ", res3)
                app.globalData.idbars[newbar.barid] = newbar;
                app.globalData.bar_refresh = true;
              })
          })

        wx.navigateBack({
          delta: 1
        })
        return;
      }
    }).catch(console.error);
    /* Aliyun EMAS version end */

    /* tencent cloud version */
    /*
    wx.cloud.callFunction({
      name: 'foosAddBarDetail',
      data: {
        bar: newbar
      },
      complete: res => {
        // console.log("foosAddBarDetail: ", res)
        app.globalData.idbars[newbar.barid] = newbar;
        app.globalData.bar_refresh = true;

        wx.navigateBack({
          delta: 1
        })
      }
    })
    */

  },

  formReset: function () {
    console.log('form发生了reset事件')
  },

})


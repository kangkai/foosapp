var util = require('../../utils/util.js');

// 获取全局应用程序实例对象
var app = getApp();

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
    myappointments: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    var that = this;

    wx.showShareMenu({
      withShareTicket: true
    })

    if (app.globalData.openid) {
      this.openidAppointments(app.globalData.openid);
    } else {
      app.openidReadyCallback = function (openid) {
        that.openidAppointments(openid);
      }
    }

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
    console.log("on pulldown refresh.");
    wx.showNavigationBarLoading(); //在标题栏中显示加载

    if (app.globalData.openid) {
      this.openidAppointments(app.globalData.openid);
    } else {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }
  },

  onReachBottom() {
    console.log("on reach bottom.")
  },

  getLocation(e) {
    app.globalData.cur_barid = e.currentTarget.id;
    var bar = app.globalData.idbars[e.currentTarget.id];

    app.commonGetLocation(bar);
  },

  markAppointments(appointments) {

    for (var i = 0; i < appointments.length; i++) {

      /* check due */
      var mydate = appointments[i].end_date + ' ' + appointments[i].end_time;
      mydate = mydate.replace(/-/g, '/');

      if (Date.parse(mydate) > Date.now()) {
        appointments[i].due = false;
      } else {
        appointments[i].due = true;
      }
    }

    this.setData({
      myappointments: appointments
    })
  },

  /* swiper myappointments */
  openidAppointments(openid) {
    var that = this;
    const db = wx.cloud.database();
    const collection = db.collection('foos_appointment');
    const PAGE_LIMIT = 3;

    collection.where({
      "players._openid": openid
    })
      .orderBy('end_date', 'desc')
      .orderBy('end_time', 'desc')
      .limit(PAGE_LIMIT)
      .get({
        success: function (res) {
          // console.log("openidAppointments", res.data);
          that.markAppointments(res.data);

          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
        },
        fail: function (err) {
          console.log(err);
        }
      });
  }

})


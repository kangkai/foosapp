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
    fbars: []
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
      this.favariteBars(app.globalData.openid);
    } else {
      app.openidReadyCallback = function (openid) {
        that.favariteBars(openid);
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
      this.favariteBars(app.globalData.openid);
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

  constructFbars(idbars, like) {
    var fbars = [];
    // console.log(idbars, like);
    for (var i = 0; i < like.length; i++) {
      var bar = idbars[like[i].barid];

      bar.likeNumber = like[i].like.length;
      bar.discussionNumber = like[i].discussion.length;
      bar.lastUpdateTime = util.formatDate(new Date(like[i].lastUpdateTime));

      fbars.push(bar);
    }
    //console.log(fbars);
    this.setData({
      fbars: fbars
    })
  },

  favariteBars(openid) {
    var that = this;
    const db = wx.cloud.database();
    const collection = db.collection('foos_barlikediscussion');

    //console.log("favariteBars: ", openid)
    collection.where({
      "like.openid": openid
    })
      .get({
        success: function (res) {
          // console.log(res);

          if (res.data.length == 0) {
            /* false */
            console.log("no record");
            return;
          }

          if (app.globalData.idbars) {
            that.constructFbars(app.globalData.idbars, res.data);
          } else {
            app.dataReadyCallback_my = function (idbars) {
              that.constructFbars(idbars, res.data);
            }
          }

        },
        fail: function (err) {
          console.log(err);
        }
      });
  },

  navitap(e) {
    app.globalData.cur_barid = e.currentTarget.id;
  },

  likeDiscussClicked(e) {
    // console.log(e.currentTarget.id);
    app.globalData.cur_barid = e.currentTarget.id;
    wx.navigateTo({
      url: "/pages/likediscussion/likediscussion"
    })
  },


})


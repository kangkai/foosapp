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
    userInfo: null,
    appId: "wx8abaf00ee8c3202e",
    extraData: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    var that = this;
    var extraData = {
      // 把1221数字换成你的产品ID，否则会跳到别的产品
      id: "62699",
      // 自定义参数，具体参考文档
      customData: {
        clientInfo: "unknown"
      }
    };

    wx.showShareMenu({
      withShareTicket: true
    })

    this.setData({
      extraData: extraData
    });

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
      app.cb_userInfo_my = function () {
        this.setData({
          userInfo: app.globalData.userInfo
        })
      }
    }

    wx.getSystemInfo({
      success: function (res) {
        //console.log(res);
        extraData.customData.clientInfo = res.model;
        that.setData({
          extraData: extraData
        });
      }
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
    console.log("on pulldown refresh.");
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  onReachBottom() {
    console.log("on reach bottom.")
  }

})


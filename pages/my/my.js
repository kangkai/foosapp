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
    hasUserInfo: false,
    canIUseGetUserProfile: false,
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

    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }

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
        that.setData({
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

  getUserProfile(e) {
    var that = this;
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '仅用于交互时候的展示', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })

        app.globalData.userInfo = res.userInfo
        console.log(res.userInfo);

        // 由于 getUserProfile 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (app.userInfoReadyCallback) {
          app.userInfoReadyCallback(res.userInfo)
        }
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })

    app.globalData.userInfo = res.userInfo
    console.log(res.userInfo);

    // 由于 getUserProfile 是网络请求，可能会在 Page.onLoad 之后才返回
    // 所以此处加入 callback 以防止这种情况
    if (app.userInfoReadyCallback) {
      app.userInfoReadyCallback(res.userInfo)
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
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  onReachBottom() {
    console.log("on reach bottom.")
  }

})


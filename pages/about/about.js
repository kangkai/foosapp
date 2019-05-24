// 获取全局应用程序实例对象
var app = getApp();

Page({
  data: {
    openid: ""
  },
  onLoad: function () {
    this.setData({
      openid: app.globalData.openid
    })
  }
})

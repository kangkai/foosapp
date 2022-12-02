// 获取全局应用程序实例对象
var app = getApp();
var emas = app.mpserverless;
/* example
 * emas.db.collection('test').find();
 * emas.function.invoke('test');
 */

Page({
  data: {
    openid: ""
  },
  onLoad: function () {
    this.setData({
      openid: app.globalData.openid
    })

    wx.showShareMenu({
      withShareTicket: true
    })
  },
  onPullDownRefresh() {
    console.log("on pulldown refresh.");
    wx.showNavigationBarLoading(); //在标题栏中显示加载

    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新   
  }
})

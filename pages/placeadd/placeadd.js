
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
    if (e.detail.value.pic0.length) newbar.pic[0] = e.detail.value.pic0;
    if (e.detail.value.pic1.length) newbar.pic[1] = e.detail.value.pic1;
    if (e.detail.value.pic2.length) newbar.pic[2] = e.detail.value.pic2;
    if (e.detail.value.pic3.length) newbar.pic[3] = e.detail.value.pic3;
    if (e.detail.value.pic4.length) newbar.pic[4] = e.detail.value.pic4;
    newbar.lastChangeTime = util.formatTime(new Date());

    // console.log("newbar: ", newbar);

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

  },

  formReset: function () {
    console.log('form发生了reset事件')
  },

})

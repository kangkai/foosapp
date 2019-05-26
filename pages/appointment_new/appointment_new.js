
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
    swiperCurrent: 0,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 800,
    circular: true,
    bars: [],
    bar_index: 0,
    barid: '',
    date: '',
    date_end: '',
    time: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    var that = this;

    if (!app.globalData.bars) {
      app.dataReadyCallback_picker = res => {
        that.setData({
          bars: app.globalData.bars,
          bar_index: 0,
          barid: app.globalData.bars[0].barid,
        })
      }
    } else {
      this.setData({
        bars: app.globalData.bars,
        bar_index: 0,
        barid: app.globalData.bars[0].barid,
        date: util.formatDate(new Date()),
        date_end: util.formatDate(new Date(Date.now() + 31536000000)), //一年后
        time: util.formatTime2(new Date())
      });
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

  },


  //以下为自定义点击事件
  getLocation(e) {
    var bar = this.data.bars[this.data.bar_index];

    app.commonGetLocation(bar);
  },



  bindDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  bindPlaceChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var bars = this.data.bars;

    this.setData({
      bar_index: e.detail.value,
      barid: bars[e.detail.value].barid
    })
  },

  formSubmit: function (e) {

    var desc = e.detail.value.appoint_desc;

    var foos_appointment = {
      "desc": desc,
      "date": this.data.date,
      "time": this.data.time,
      "create_time": Date.now(),
      "bar_index": this.data.bar_index,
      "barid": this.data.barid,
      "bar_name": this.data.bars[this.data.bar_index].name,
      "admin_nick": app.globalData.userInfo.nickName,
      "admin_avatarUrl": app.globalData.userInfo.avatarUrl,
      "players": [
        {
          "id": 0,
          "nick": app.globalData.userInfo.nickName,
          "_openid": app.globalData.openid,
          "avatarUrl": app.globalData.userInfo.avatarUrl
        }
      ]
    };

    //console.log(foos_appointment);

    const db = wx.cloud.database();
    const collection = db.collection('foos_appointment');

    collection.add({
      data: foos_appointment,
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log("数据库创建成功: ", res._id);

        //redirect to appointment list page
        app.globalData.appointment_needs_refresh = true;
        wx.switchTab({
          url: '/pages/appointment/appointment' // 希望跳转过去的页面
        })
      },
      fail: function (err) {
        console.log(err);
      }
    })


  },

  formReset: function () {
    console.log('form发生了reset事件')
  },

})


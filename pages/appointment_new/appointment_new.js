
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
    end_date: '',
    date_limit: '',
    time: '',
    end_time: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    var that = this;

    wx.showShareMenu({
      withShareTicket: true
    })

    const randomid = (min, max) => Math.floor(Math.random() * (max - min)) + min;
    if (!app.globalData.bars) {
      app.dataReadyCallback_picker = res => {
        that.setData({
          bar_index: randomid(0, app.globalData.bars.length),
        });
        that.setData({
          bars: app.globalData.bars, 
          barid: app.globalData.bars[that.data.bar_index].barid,
          date: util.formatDate(new Date()),
          date_limit: util.formatDate(new Date(Date.now() + 31536000000)), //一年后
          time: util.formatTime2(new Date()),
          end_date: util.formatDate(new Date()),
          end_time: util.formatTime2(new Date(Date.now() + 3600000)) //1小时后
        })
      }
    } else {
      that.setData({
        bar_index: randomid(0, app.globalData.bars.length),
      });
      this.setData({
        bars: app.globalData.bars,
        barid: app.globalData.bars[that.data.bar_index].barid,
        date: util.formatDate(new Date()),
        date_limit: util.formatDate(new Date(Date.now() + 31536000000)), //一年后
        time: util.formatTime2(new Date()),
        end_date: util.formatDate(new Date()),
        end_time: util.formatTime2(new Date(Date.now() + 3600000)) //1小时后
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
    wx.stopPullDownRefresh() //停止下拉刷新 
  },


  //以下为自定义点击事件
  getLocation(e) {
    var bar = this.data.bars[this.data.bar_index];

    app.commonGetLocation(bar);
  },



  bindDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value,
      end_date: e.detail.value,
    })
  },
  bindTimeChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  bindEndDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      end_date: e.detail.value
    })
  },
  bindEndTimeChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      end_time: e.detail.value
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
      "end_date": this.data.end_date,
      "end_time": this.data.end_time,
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
    const collection = app.mpserverless.db.collection('foos_appointment');

    collection.insertOne(foos_appointment)
    .then((res) => {
      console.log("foos_appointment insert done: ", res)
        //redirect to appointment list page
        app.globalData.appointment_needs_refresh = true;
        wx.switchTab({
          url: '/pages/appointment/appointment' // 希望跳转过去的页面
        })
    })

  },

  formReset: function () {
    console.log('form发生了reset事件')
  },

})


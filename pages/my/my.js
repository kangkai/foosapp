
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
    swiperCurrent: 0,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 800,
    circular: true,
    bar: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    if (app.globalData.cur_barid) {
      var bar = app.globalData.idbars[app.globalData.cur_barid];
      //console.log(bar);
      this.setData({
        bar: bar
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
    if (app.globalData.cur_barid) {
      var bar = app.globalData.idbars[app.globalData.cur_barid];
      //console.log(bar);
      this.setData({
        bar: bar
      });
    }
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
    var bar = this.data.bar;

    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        wx.openLocation({//​使用微信内置地图查看位置。
          latitude: bar.latitude,//要去的纬度-地址
          longitude: bar.longitude,//要去的经度-地址
          name: bar.name,
          address: bar.address
        })
      },

      fail: function (err) {
        wx.showModal({
          title: '提示',
          content: '请在设置中打开定位服务',
          showCancel: false,
          confirmText: "知道了",
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else {
              console.log('用户点击取消')
            }

          }
        })
      }
    })
  }

})


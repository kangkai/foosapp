
// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面名称
   */
  name: "map",
  /**
   * 页面的初始数据
   */

  data: {
    showCard: false,

    //map 标记数据
    markers: [],
    bar: {},
    map_height: 0,
    mapcard_height: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    var markers = app.globalData.bars;

    for (var i = 0; i < markers.length; i++) {
      markers[i].id = i;
    }

    this.setData({
      markers: markers,
      map_height: app.globalData.map_height
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
  markertap(e) {
    var query = wx.createSelectorQuery();
    var that = this;

    //console.log(e);
    that.setData({
      showCard: true,
      bar: that.data.markers[e.markerId]
    });

    query.select('#mapcard').boundingClientRect()
    query.exec(function (res) {
      that.setData({
        mapcard_height: res[0].height,
        map_height: app.globalData.map_height - res[0].height
      });

    });


  },

  navitap(e) {
    app.globalData.cur_barid = e.currentTarget.id;
  },

  onFloatIconClick(e) {
    wx.switchTab({
      url: '../list/list',
      fail: function (err) {
        console.log(err);
      }
    })
  },

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


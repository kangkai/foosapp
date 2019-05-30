
// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面名称
   */
  name: "list",
  /**
   * 页面的初始数据
   */

  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var list_bars = function (that) {
      const mylist = [];
      var foobar = app.globalData.foobar;
      var idbars = app.globalData.idbars;

      for (var i = 0; i < foobar.length; i++) {
        var pages = [];

        var places = foobar[i].places
        for (var j = 0; j < places.length; j++) {
          var barid = places[j];
          pages.push({
            index: barid,
            name: idbars[barid].name
          });
        }

        // console.log("before sort: ", pages);
        pages.sort(function (a, b) {
          return a.name.localeCompare(b.name, 'zh');
        })
        // console.log("after sort: ", pages);

        mylist.push({
          id: 'test' + i,
          name: foobar[i].city,
          open: false,
          pages: pages
        })
      }

      mylist.sort(function (a, b) {
        return a.name.localeCompare(b.name, 'zh');
      })

      that.setData({
        list: mylist
      })

      wx.showShareMenu({
        withShareTicket: true
      })
    };

    if (!app.globalData.bars) {
      app.dataReadyCallback = res => {
        list_bars(this);
      }
    } else {
      list_bars(this);
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
  kindToggle(e) {
    const id = e.currentTarget.id
    //console.log(id)

    const list = this.data.list
    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].id === id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list
    })
  },

  itemClick(e) {
    app.globalData.cur_barid = e.currentTarget.id;
  },

  onFloatIconClick(e) {
    if (app.globalData.openid == 'oxksR5evxcGhFCJxpbjrtb7Am6d0') {
      wx.navigateTo({
        url: '../placeadd/placeadd',
        fail: function (err) {
          console.log(err);
        }
      })
    }
  }

})


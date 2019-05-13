
// 引入coolsite360交互配置设定
//require('coolsite.config.js');

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
  onLoad: function() {
    var that = this;
    const db = wx.cloud.database();
    const mylist = [];
    var myitem = {};

    db.collection('foos_place').get({
      success: function(res) {
        for (var i = 0; i < res.data.length; i++) {
          var pages = [];

          var places = res.data[i].places
          for (var j = 0; j < places.length; j++) {
            pages.push(places[j].name)
          }

          mylist.push({
            id: 'test'+i, 
            name: res.data[i].city,
            open: false,
            pages: pages
          })
        }

        that.setData({
          list: mylist
        })
      },
      fail: function(err) {
        console.error(err);
      }
    });


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
    // 执行coolsite360交互组件展示
    //app.coolsite360.onShow(this);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    
  },


  //以下为自定义点击事件
  kindToggle(e) {
    const id = e.currentTarget.id
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
  }
  
})


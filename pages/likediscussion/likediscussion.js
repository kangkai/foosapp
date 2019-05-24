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
    barlikediscussion: null,
    currentData: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    var that = this;

    this.getBarLikeDiscussion(app.globalData.cur_barid);

    this.setData({
      userInfo: app.globalData.userInfo
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

  bindchange(e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },

  checkCurrent(e) {
    const that = this;

    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {

      that.setData({
        currentData: e.target.dataset.current
      })
    }
  },


  /* new */
  getBarLikeDiscussion(barid) {
    var that = this;
    const db = wx.cloud.database();
    const collection = db.collection('foos_barlikediscussion');

    collection
      .where({
        barid: barid
      })
      .get({
        success: function (res) {
          console.log(res);
          if (res.data.length == 0) {
            console.log("no record!");
            return;
          }

          res.data[0].likeNumber = res.data[0].like.length;
          res.data[0].discussionNumber = res.data[0].discussion.length;
          res.data[0].lastUpdateTime = util.formatDate(new Date(res.data[0].lastUpdateTime));
          that.setData({
            barlikediscussion: res.data[0]
          })

        },
        fail: function (err) {
          console.log(err);
        }
      });
  },

  formSubmit: function (e) {
    var that = this;
    var content = e.detail.value.content;
    var discussion = [];

    if (content.length == 0) {
      console.log("content 0: ", content);
      return;
    }

    var rid = this.data.barlikediscussion._id;
    discussion = this.data.barlikediscussion.discussion;
    discussion.push({
      openid: app.globalData.openid,
      nick: app.globalData.userInfo.nickName,
      avatarUrl: app.globalData.userInfo.avatarUrl,
      createTime: util.formatTime(new Date()),
      content: content
    });


    wx.cloud.callFunction({
      name: 'foosDB',
      data: {
        db: 'foos_barlikediscussion',
        type: 'update',
        indexKey: rid,
        data: {
          discussion: discussion,
          lastUpdateTime: Date.now()
        }
      },
      complete: res => {
        console.log("discussion update done");
        var barlikediscussion = that.data.barlikediscussion;
        barlikediscussion.discussionNumber++;
        that.setData({
          barlikediscussion
        })
      }
    })

  },


})


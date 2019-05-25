
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
    db_total: 0,
    db_done_read: 0,
    appointments: []
  },

  refresh_list: function (that) {
    const db = wx.cloud.database();
    const collection = db.collection('foos_appointment');
    const PAGE_LIMIT = 3;

    that.data.db_total = 0;
    that.data.db_done_read = 0;

    collection.count({
      success: function (res) {
        const db_total = res.total;
        //console.log(db_total);
        if (db_total == 0)
          return;

        if (that.dbTotalCallback) {
          that.dbTotalCallback(db_total);
        }

        that.setData({
          db_total: db_total
        });
      },
      fail: function (err) {
        console.log(err);
      }
    });

    if (!that.data.db_total) {
      that.dbTotalCallback = res => {
        collection
          .orderBy('date', 'desc')
          .orderBy('time', 'desc')
          .skip(that.data.db_done_read)
          .limit(PAGE_LIMIT)
          .get({
            success: function (res) {
              //console.log(res.data);
              for (var i = 0; i < res.data.length; i++) {
                var mydate = res.data[i].date + ' ' + res.data[i].time;
                mydate = mydate.replace(/-/g, '/');

                if (Date.parse(mydate) > Date.now()) {
                  res.data[i].due = false;
                } else {
                  res.data[i].due = true;
                }
                //console.log(res.data[i]);
              }

              that.setData({
                db_done_read: that.data.db_done_read + res.data.length,
                appointments: res.data
              })
            },
            fail: function (err) {
              console.log(err);
            }
          })
      }
    }
  },

  more_list: function (that) {
    const db = wx.cloud.database();
    const collection = db.collection('foos_appointment');
    const PAGE_LIMIT = 3;
    var local_read = that.data.db_done_read;

    that.data.db_total = 0;
    that.data.db_done_read = 0;

    collection.count({
      success: function (res) {
        const db_total = res.total;
        //console.log(db_total);
        if (db_total == 0)
          return;

        if (that.dbTotalCallback) {
          that.dbTotalCallback(db_total);
        }

        that.setData({
          db_total: db_total
        });
      },
      fail: function (err) {
        console.log(err);
      }
    });

    if (!that.data.db_total) {
      that.dbTotalCallback = res => {
        collection
          .orderBy('date', 'desc')
          .orderBy('time', 'desc')
          .skip(that.data.db_done_read)
          .limit(local_read + PAGE_LIMIT)
          .get({
            success: function (res) {
              //console.log(res.data);

              for (var i = 0; i < res.data.length; i++) {
                var mydate = res.data[i].date + ' ' + res.data[i].time;
                mydate = mydate.replace(/-/g, '/');

                if (Date.parse(mydate) > Date.now()) {
                  res.data[i].due = false;
                } else {
                  res.data[i].due = true;
                }
                //console.log(res.data[i]);
              }

              that.setData({
                db_done_read: res.data.length,
                appointments: res.data
              })
            },
            fail: function (err) {
              console.log(err);
            }
          })
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.refresh_list(this);
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
    if (app.globalData.appointment_needs_refresh) {
      app.globalData.appointment_needs_refresh = false;

      //refresh
      this.refresh_list(this);
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
    var barid = e.currentTarget.id;
    var bar = app.globalData.idbars[barid];

    app.commonGetLocation(bar);
  },

  addme: function (docid) {
    //console.log('addme clicked.', e);
    var appointments = this.data.appointments;

    for (var i = 0; i < appointments.length; i++) {
      if (appointments[i]._id != docid)
        continue;

      if (appointments[i].due) {
        wx.showModal({
          title: '提示',
          content: '无法加入已经过期的约球',
          showCancel: false,
          confirmText: "好的",
          success: function (res) {
            if (res.confirm) {
              //console.log('用户点击确定')
            } else {
              //console.log('用户点击取消')
            }
          }
        })

        return;
      }

      var players = appointments[i].players;
      for (var j = 0; j < players.length; j++) {
        if (players[j]._openid == app.globalData.openid) {
          // already in
          wx.showModal({
            title: '提示',
            content: '你已经加入',
            showCancel: false,
            confirmText: "好的",
            success: function (res) {
              if (res.confirm) {
                //console.log('用户点击确定')
              } else {
                //console.log('用户点击取消')
              }

            }
          })

          return;
        }
      }

      //push into players
      appointments[i].players.push({

        "id": players.length,
        "nick": app.globalData.userInfo.nickName,
        "_openid": app.globalData.openid,
        "avatarUrl": app.globalData.userInfo.avatarUrl
      });

      //push to db
      wx.cloud.callFunction({
        name: 'appointPlayersUpdate',
        data: {
          docid: docid,
          players: appointments[i].players
        }, success: function (res) {
          //console.log(res)
        }, fail: function (res) {
          console.log(res)
        }
      })

      //no need to continue
      break;
    }

    this.setData({
      appointments
    });


  },

  moreClicked(e) {
    this.more_list(this);
  },

  //获取用户信息
  onGotUserInfo: function (e) {
    //console.log("getUserInfo: ", e);
    if (e.detail.userInfo) {
      var user = e.detail.userInfo;
      //console.log(user)
      app.userInfoReadyCallback(user);
    } else {
      console.log("用户拒绝了登陆");
      wx.switchTab({
        url: '/pages/appointment/appointment' // 希望跳转过去的页面
      })
    }
  },

  onGotUserInfoAddme: function (e) {
    //console.log("getUserInfo: ", e);
    if (e.detail.userInfo) {
      var user = e.detail.userInfo;
      //console.log(user)
      app.userInfoReadyCallback(user);

      this.addme(e.currentTarget.id);
    } else {
      console.log("用户拒绝了登陆");
      return;
    }
  }

})


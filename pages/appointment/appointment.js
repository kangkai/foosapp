
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

        if (that.dbTotalCallback) {
          that.dbTotalCallback(db_total);
        }

        that.setData({
          db_total: db_total
        });
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
                if (Date.parse(res.data[i].date + ' ' + res.data[i].time) > Date.now()) {
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

    collection
      .orderBy('date', 'desc')
      .orderBy('time', 'desc')
      .skip(that.data.db_done_read)
      .limit(PAGE_LIMIT)
      .get({
        success: function (res) {
          //console.log(res.data);

          if (res.data.length == 0) {
            wx.showModal({
              title: '提示',
              content: '没有更多了，谢谢。',
              showCancel: false,
              confirmText: "知道了",
              success: function (res) {
                if (res.confirm) {
                  //console.log('用户点击确定')
                } else {
                  //console.log('用户点击取消')
                }

              }
            });

            return;
          }

          var appointments = that.data.appointments
          //console.log(appointments);
          for (var i = 0; i < res.data.length; i++) {
            if (Date.parse(res.data[i].date + ' ' + res.data[i].time) > Date.now()) {
              res.data[i].due = false;
            } else {
              res.data[i].due = true;
            }
            appointments.push(res.data[i]);
          }
          //console.log(appointments);

          that.setData({
            db_done_read: that.data.db_done_read + res.data.length,
            appointments: appointments
          })
        },
        fail: function (err) {
          console.log(err);
        }
      })
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
    var index = e.currentTarget.id;
    var bar = app.globalData.bars[index];

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

    this.setData({
      bar_index: e.detail.value
    })
  },

  addme: function (e) {
    console.log('addme clicked.', e);
    var aid = e.currentTarget.id;
    var appointments = this.data.appointments;

    for (var i = 0; i < appointments.length; i++) {
      if (appointments[i]._id != aid)
        continue;

      if (appointments[i].due) {
        wx.showModal({
          title: '提示',
          content: '无法加入已经过期的约球',
          showCancel: false,
          confirmText: "好的",
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else {
              console.log('用户点击取消')
            }
          }
        })

        return;
      }

      var players = appointments[i].players;
      for (var j = 0; j < players.length; j++) {
        if (players[j]._openid == app.globalData.userInfo._openid) {
          // already in
          wx.showModal({
            title: '提示',
            content: '你已经加入',
            showCancel: false,
            confirmText: "好的",
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else {
                console.log('用户点击取消')
              }

            }
          })

          return;
        }
      }

      //push into players
      appointments[i].players.push = {

        "id": players.length,
        "nick": app.globalData.userInfo.nickName,
        "_openid": app.globalData.userInfo._openid,
        "avatarUrl": app.globalData.userInfo.avatarUrl
      }

      //push to db
      const db = wx.cloud.database();
      const collection = db.collection('foos_appointment');
      collection.doc('aid').update({
        data: {
          players: appointments[i].players
        },
        success: function (res) {
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
          console.log("db update success");
        },
        fail: function (err) {
          console.log(err);
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
    console.log("getUserInfo: ", e);
    if (e.detail.userInfo) {
      var user = e.detail.userInfo;
      console.log(user)
      app._saveUserInfo(user);
    } else {
      console.log("用户拒绝了登陆");
    }
  },

  bindGetUserInfo: function (e) {
    console.log(e)
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
    } else {
      //用户按了拒绝按钮
    }
  }

})


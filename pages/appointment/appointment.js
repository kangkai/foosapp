
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
          .orderBy('end_date', 'desc')
          .orderBy('end_time', 'desc')
          .skip(that.data.db_done_read)
          .limit(PAGE_LIMIT)
          .get({
            success: function (res) {
              //console.log(res.data);
              that.markAppointments(res.data);

              that.setData({
                db_done_read: that.data.db_done_read + res.data.length
              })

              wx.hideNavigationBarLoading() //完成停止加载
              wx.stopPullDownRefresh() //停止下拉刷新   
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
          .orderBy('end_date', 'desc')
          .orderBy('end_time', 'desc')
          .skip(that.data.db_done_read)
          .limit(local_read + PAGE_LIMIT)
          .get({
            success: function (res) {
              //console.log(res.data);
              that.markAppointments(res.data);

              that.setData({
                db_done_read: res.data.length
              });

              wx.hideNavigationBarLoading() //完成停止加载
            },
            fail: function (err) {
              console.log(err);
            }
          })
      }
    }
  },

  markAppointments(appointments) {

    for (var i = 0; i < appointments.length; i++) {

      /* check due */
      var mydate = appointments[i].end_date + ' ' + appointments[i].end_time;
      mydate = mydate.replace(/-/g, '/');

      if (Date.parse(mydate) > Date.now()) {
        appointments[i].due = false;
      } else {
        appointments[i].due = true;
      }

      /* check meAlreadyJoined */
      appointments[i].meAlreadyJoined = false;
      var players = appointments[i].players;
      for (var j = 0; j < players.length; j++) {
        if (players[j]._openid == app.globalData.openid) {
          appointments[i].meAlreadyJoined = true;
        }
      }
    }

    this.setData({
      appointments
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.refresh_list(this);

    wx.showShareMenu({
      withShareTicket: true
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
    console.log("on pulldown refresh.");
    wx.showNavigationBarLoading(); //在标题栏中显示加载

    this.refresh_list(this);
  },

  onReachBottom() {
    console.log("on reach bottom.");
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    this.more_list(this);
  },

  //以下为自定义点击事件
  getLocation(e) {
    var barid = e.currentTarget.id;
    var bar = app.globalData.idbars[barid];

    app.commonGetLocation(bar);
  },



  addDelMe: function (index, docid) {
    var appointment = this.data.appointments[index];

    if (appointment.due) {
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


    if (appointment.meAlreadyJoined) {
      // to del me
      console.warn("to del me");

      function matchopenid(element) {
        return element.openid == app.globalData.openid;
      }

      // console.log(appointment.players);
      var pindex = appointment.players.findIndex(matchopenid);
      // console.log("pindex: ", pindex);
      appointment.players.splice(pindex, 1);
      // console.log(appointment.players);

      /* Aliyun EMAS version */
      app.mpserverless.db.collection('foos_appointment').updateOne(
        {_id: appointment._id},
        {$set: {players: appointment.players}}
      )
      .then(res => {
        console.log("appointment del me done");
      })
      .catch(console.error);

      /* tencent cloud version */
      /*
      wx.cloud.callFunction({
        name: 'foosDB',
        data: {
          db: 'foos_appointment',
          type: 'update',
          indexKey: appointment._id,
          data: {
            players: appointment.players
          }
        },
        complete: res2 => {
          console.log("appointment del me done");
        }
      })
      */

      appointment.meAlreadyJoined = false;
    } else {
      //to add me
      appointment.players.push({
        "nick": app.globalData.userInfo.nickName,
        "_openid": app.globalData.openid,
        "avatarUrl": app.globalData.userInfo.avatarUrl
      });

      //push to db
      wx.cloud.callFunction({
        name: 'appointPlayersUpdate',
        data: {
          docid: appointment._id,
          players: appointment.players
        }, success: function (res) {
          //console.log(res)
        }, fail: function (res) {
          console.log(res)
        }
      })

      appointment.meAlreadyJoined = true;
    }

    var appointments = this.data.appointments;
    appointments[index] = appointment;
    this.setData({
      appointments
    });


  },

  moreClicked(e) {
    this.more_list(this);
  },

  //获取用户信息

  onGotUserInfoAddme: function (e) {
    // console.log("onGotUserInfoAddme: ", e);
    if (e.detail.userInfo) {
      var user = e.detail.userInfo;
      //console.log(user)
      app.userInfoReadyCallback(user);

      this.addDelMe(e.currentTarget.dataset.index, e.currentTarget.dataset.docid);
    } else {
      console.log("用户拒绝了登陆");
      return;
    }
  }

})


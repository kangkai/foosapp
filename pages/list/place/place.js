
var util = require('../../../utils/util.js');

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
    bar: {},
    barappointments: [],
    barlikediscussion: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    var bar = app.globalData.idbars[app.globalData.cur_barid];

    wx.showShareMenu({
      withShareTicket: true
    })

    this.setData({
      myopenid: app.globalData.openid,
      bar: bar
    });

    /* comment this out for now, cause Ali EMAS has cloud database
     * quota limit of 500/day, either we cache data, or comment out
     */
    //this.getBarAppointments(bar);
    //this.getBarLikeDiscussion(bar.barid);
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
    if (app.globalData.bar_refresh) {
      app.globalData.bar_refresh = false;

      //refresh
      this.setData({
        bar: app.globalData.idbars[app.globalData.cur_barid]
      })
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
    wx.stopPullDownRefresh() //停止下拉刷新 
  },

  markAppointments(appointments) {
    if (!appointments) {
      return;
    }
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
      barappointments: appointments
    })
  },

  getBarAppointments(bar) {
    var that = this;
    const collection = app.mpserverless.db.collection('foos_appointment');

    if (!bar) {
      return;
    }

    collection.find(
      { barid: bar.barid },
      {
        sort: {
          end_date: -1,
          end_time: -1
        }
      }
    )
      .then(res => {
        that.markAppointments(res.result);
      })
      .catch(console.error);
  },

  //以下为自定义点击事件
  getLocation(e) {
    var bar = this.data.bar;
    app.commonGetLocation(bar);
  },

  getBarLikeDiscussion(barid) {
    var that = this;
    const collection = app.mpserverless.db.collection('foos_barlikediscussion');

    if (!barid) {
      return;
    }

    /* TODO:
     * wx.setStorage...
     * and can share with likediscussion page.
     */

    collection.find(
      { barid: barid }
    )
      .then(res => {
        // console.log("res: ", res);

        if (res.result.length == 0) {
          console.log("no record!");
          // insert record, TODO: race and several records with same barid??
          collection.insertOne(
            {
              barid: barid,
              like: [],
              discussion: [],
              createTime: Date.now(),
              lastUpdateTime: Date.now()
            }
          )
            .then(res2 => {
              console.log("insertRecord insert: ", res2);
            })
        } else {

          res.result[0].likeNumber = res.result[0].like.length;
          res.result[0].discussionNumber = res.result[0].discussion.length;
          res.result[0].lastUpdateTime = util.formatDate(new Date(res.result[0].lastUpdateTime));
          that.setData({
            barlikediscussion: res.result[0]
          })
        }
      })
      .catch(console.error);
  },

  //TODO
  editBar(e) {
    // console.log(e);
    app.globalData.cur_barid = e.currentTarget.id;
    wx.navigateTo({
      url: "/pages/placeedit/placeedit"
    })
  },


  addDelMe: function (index, docid) {
    var appointment = this.data.barappointments[index];

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
        { _id: appointment._id },
        { $set: { players: appointment.players } }
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

      /* Aliyun EMAS version */
      app.mpserverless.db.collection('foos_appointment').updateOne(
        { _id: appointment._id },
        { $set: { players: appointment.players } }
      )
        .then(res => {
          console.log("appointment add me done");
        })
        .catch(console.error);

      /* tencent cloud version */
      /*
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
      */

      appointment.meAlreadyJoined = true;
    }

    var appointments = this.data.barappointments;
    appointments[index] = appointment;
    this.setData({
      barappointments: appointments
    });


  },


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
  },

  likeDiscussClicked(e) {
    // console.log(e);
    app.globalData.cur_barid = e.currentTarget.id;
    wx.navigateTo({
      url: "/pages/likediscussion/likediscussion"
    })
  },

})


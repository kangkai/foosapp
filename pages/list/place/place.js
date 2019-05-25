
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
    likeNumber: 0,
    discussionNumber: 0,
    lastUpdateTime: null,
    bar: {},
    barappointments: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    var bar = app.globalData.idbars[app.globalData.cur_barid];
    this.setData({
      myopenid: app.globalData.openid,
      bar: bar
    });

    this.getBarAppointments(bar);
    this.countLike(bar);
    this.countDiscussion(bar);
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

  },

  getBarAppointments(bar) {
    var that = this;
    const db = wx.cloud.database();
    const collection = db.collection('foos_appointment');

    collection
      .orderBy('date', 'desc')
      .orderBy('time', 'desc')
      .where({
        barid: bar.barid
      })
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
            barappointments: res.data
          })

        },
        fail: function (err) {
          console.log(err);
        }
      })
  },

  //以下为自定义点击事件
  getLocation(e) {
    var bar = this.data.bar;

    app.commonGetLocation(bar);
  },

  checkLiked(barid, openid) {
    /* check liked or not */
    var that = this;
    const db = wx.cloud.database();
    const collection = db.collection('foos_barlikediscussion');

    collection.where({
      barid: barid,
      "like.openid": openid
    })
      .get({
        success: function (res) {
          console.log("checkLiked: ", barid, res);
          if (res.data.length == 0) {
            /* false */
            that.insertRecord(barid);
          } else {
            /* true */
            console.log("already liked");
          }

        },
        fail: function (err) {
          console.log(err);
        }
      });
  },

  insertRecord(barid) {
    var that = this;
    const db = wx.cloud.database();
    const collection = db.collection('foos_barlikediscussion');

    /* insert record if not already there */
    collection
      .where({
        barid: barid
      })
      .get({
        success: function (res) {
          console.log("insertRecord: ", barid, res);
          if (res.data.length == 0) {
            /* false */
            wx.cloud.callFunction({
              name: 'foosDB',
              data: {
                db: 'foos_barlikediscussion',
                type: 'insert',
                data: {
                  barid: barid,
                  like: [],
                  discussion: [],
                  createTime: Date.now(),
                  lastUpdateTime: Date.now()
                }
              },
              complete: res2 => {
                console.log("insertRecord insert: ", res2);
                that.insertLike(barid);
              }
            })

          } else {
            /* true */
            console.log("already there");
            that.insertLike(barid);
          }

        },
        fail: function (err) {
          console.log(err);
        }
      });
  },


  insertLike(barid) {
    var that = this;
    const db = wx.cloud.database();
    const collection = db.collection('foos_barlikediscussion');


    collection
      .where({
        barid: barid
      })
      .get({
        success: function (res) {
          console.log("insertLike: ", barid, res);
          if (res.data.length == 0) {
            console.log("impossible, no record!");
            return;
          }

          var rid = res.data[0]._id;
          var like = res.data[0].like;
          like.push({
            openid: app.globalData.openid,
            nick: app.globalData.userInfo.nickName,
            avatarUrl: app.globalData.userInfo.avatarUrl,
            createTime: Date.now(),
          });

          wx.cloud.callFunction({
            name: 'foosDB',
            data: {
              db: 'foos_barlikediscussion',
              type: 'update',
              indexKey: rid,
              data: {
                like: like,
                lastUpdateTime: Date.now()
              }
            },
            complete: res2 => {
              console.log("like update done");
              that.countLike(that.data.bar);
            }
          })

        },
        fail: function (err) {
          console.log(err);
        }
      });

  },

  likeClicked(e) {
    /*
    bardetail[index].like = [];
    bardetail[index].like.push({
      openid: app.globalData.openid,
      nick: app.globalData.userInfo.nickName,
      avatarUrl: app.globalData.userInfo.avatarUrl
    });

    bardetail[index].discussion = [];
    bardetail[index].discussion.push({
      openid: app.globalData.openid,
      nick: app.globalData.userInfo.nickName,
      avatarUrl: app.globalData.userInfo.avatarUrl,
      createTime: 0,
      content: "I like this bar!"
    }); */

    this.checkLiked(this.data.bar.barid, app.globalData.openid);


  },

  discussClicked(e) {
    // console.log(e);
    app.globalData.cur_barid = e.currentTarget.id;
    wx.navigateTo({
      url: "/pages/likediscussion/likediscussion"
    })
  },

  countLike(bar) {
    var that = this;
    var barid = bar.barid;
    const db = wx.cloud.database();
    const collection = db.collection('foos_barlikediscussion');

    collection
      .where({
        barid: barid
      })
      .get({
        success: function (res) {
          // console.log(res);
          if (res.data.length == 0) {
            // console.log("no record!");
            return;
          }
          var like = res.data[0].like;

          that.setData({
            likeNumber: like.length,
            lastUpdateTime: util.formatDate(new Date(res.data[0].lastUpdateTime))
          })

        },
        fail: function (err) {
          console.log(err);
        }
      });
  },

  countDiscussion(bar) {
    var that = this;
    var barid = bar.barid;
    const db = wx.cloud.database();
    const collection = db.collection('foos_barlikediscussion');

    collection
      .where({
        barid: barid
      })
      .get({
        success: function (res) {
          // console.log(res);
          if (res.data.length == 0) {
            // console.log("no record!");
            return;
          }
          var discussion = res.data[0].discussion;
          // console.log("discussionNumber: ", discussion.length);
          that.setData({
            discussionNumber: discussion.length,
            lastUpdateTime: util.formatDate(new Date(res.data[0].lastUpdateTime))
          })

        },
        fail: function (err) {
          console.log(err);
        }
      });
  },

  editBar(e) {
    // console.log(e);
    app.globalData.cur_barid = e.currentTarget.id;
    wx.navigateTo({
      url: "/pages/placeedit/placeedit"
    })
  },


  addme: function (docid) {
    //console.log('addme clicked.', e);
    var appointments = this.data.barappointments;

    for (var i = 0; i < appointments.length; i++) {
      if (appointments[i]._id != docid)
        continue;

      if (appointments[i].due) {
        /* should not be here */
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
      barappointments: appointments
    });


  },

  // TODO
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


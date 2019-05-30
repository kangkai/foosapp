var util = require('/utils/util.js');

//app.js
App({
  globalData: {
    userInfo: null,
    openid: null,
    foobar: {},
    bars: null,
    idbars: null,
    cur_barid: "",
    map_height: 300,
    model: "",
    appointment_needs_refresh: false,
    bar_refresh: false
  },

  onLaunch: function () {
    // 展示本地存储能力
    var that = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.showShareMenu({
      withShareTicket: true
    })

    wx.cloud.init({
      env: 'foosball-test1',
      traceUser: true
    })

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //console.log("login code: ", res.code);
        that.getOpenid();
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              that.globalData.userInfo = res.userInfo
              //console.log(res.userInfo);

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(res.userInfo)
              }
            }
          })
        }
      }
    })

    wx.getSystemInfo({
      success: function (res) {
        //console.log(res);
        that.globalData.map_height = res.windowHeight;
        that.globalData.model = res.model;
      }
    })

    // get cached data
    wx.getStorage({
      key: "foobar",
      success: function (res) {
        // console.log("cached foobar: ", util.formatTime(new Date()), res);
        wx.getStorage({
          key: "bars",
          success: function (res2) {
            // console.log("cached bars: ", util.formatTime(new Date()), res);
            that.constructIdBars(res.data, res2.data, "cache");
          }
        })
      }
    });

    // 获取数据库内容
    that.getBarListDetail();
  },

  userInfoReadyCallback: function (user) {
    //console.log(user);
    this.globalData.userInfo = user;
    if (this.cb_userInfo_my) {
      this.cb_userInfo_my();
    }
  },

  bardetailDB: function () {
    var that = this;
    var bardetail = that.globalData.bars;
    const db = wx.cloud.database();

    for (var index = 0; index < bardetail.length; index++) {
      bardetail[index].admin_openid = that.globalData.openid;
      bardetail[index].admin_nick = that.globalData.userInfo.nickName;
      bardetail[index].admin_avatarUrl = that.globalData.userInfo.avatarUrl;
      /*
      bardetail[index].like = [];
      bardetail[index].like.push({
        openid: that.globalData.openid,
        nick: that.globalData.userInfo.nickName,
        avatarUrl: that.globalData.userInfo.avatarUrl
      });

      bardetail[index].discussion = [];
      bardetail[index].discussion.push({
        openid: that.globalData.openid,
        nick: that.globalData.userInfo.nickName,
        avatarUrl: that.globalData.userInfo.avatarUrl,
        createTime: 0,
        content: "I like this bar!"
      }); */


      db.collection('foos_bardetail').add({
        data: bardetail[index],
        success: function (res) {
          console.log(res);
        },
        fail: function (err) {
          console.log(err);
        }
      });
    }
  },

  // 获取用户openid
  getOpenid() {
    let that = this;
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {
        // console.log('云函数获取到的openid: ', res.result.openid)
        that.globalData.openid = res.result.openid;
        if (that.openidReadyCallback) {
          that.openidReadyCallback(res.result.openid);
        }
      }
    })
  },

  constructIdBars(foobar, bars, from) {
    var that = this;
    var idbars = {};

    // console.log("from: ", from, util.formatTime(new Date()));
    bars.sort(function (a, b) {
      return a.name.localeCompare(b.name, 'zh');
    })

    for (var i = 0; i < bars.length; i++) {
      var barid = bars[i].barid; //barid = Math.random().toString(36).substr(2, 15)
      idbars[barid] = bars[i];
    }

    that.globalData.foobar = foobar;
    that.globalData.bars = bars;
    that.globalData.idbars = idbars;

    if (from == "cloud") {
      /* setStorage cache to speed up launch time */
      // console.log("cache data: ", util.formatTime(new Date()));
      wx.setStorage({
        key: "foobar",
        data: foobar
      });

      wx.setStorage({
        key: "bars",
        data: bars
      });
    }

    /*
    console.log(foobar);
    console.log(bars);
    console.log(idbars);
    */
    if (that.dataReadyCallback) {
      that.dataReadyCallback();
    }

    if (that.dataReadyCallback_picker) {
      that.dataReadyCallback_picker();
    }

    if (that.dataReadyCallback_my) {
      that.dataReadyCallback_my(idbars);
    }

    if (that.dataReadyCallback_map) {
      that.dataReadyCallback_map();
    }

    /* foos_barlist
    var newfoobar = [];
    var newplaces = [];
    for (var i = 0; i < foobar.length; i++) {
      newfoobar[i] = foobar[i];
      var places = foobar[i].places;
      newplaces = [];
      for (var j = 0; j < places.length; j++) {
        var barid = places[j].barid; //barid = Math.random().toString(36).substr(2, 15)
  
        newplaces.push(barid);
      }
      newfoobar[i].places = newplaces;
  
      wx.cloud.callFunction({
        name: 'foosDB',
        data: {
          db: 'foos_barlist',
          type: 'insert',
          data: newfoobar[i]
        },
        complete: res2 => {
          
        }
      })
    }
    //console.log(newfoobar);
    */

  },

  getBarListDetail() {
    var that = this;
    wx.cloud.callFunction({
      name: 'foosDB',
      data: {
        db: 'foos_barlist',
        type: 'get',
        skip: 0,
        limit: 100
      },
      complete: res => {
        // console.log("res: ", res);
        wx.cloud.callFunction({
          name: 'foosDB',
          data: {
            db: 'foos_bardetail',
            type: 'get',
            skip: 0,
            limit: 100
          },
          complete: res2 => {
            // console.log("res2: ", res2)
            that.constructIdBars(res.result.data, res2.result.data, "cloud")
          }
        })
      }
    })
  },

  /* get location */
  commonGetLocation(bar) {

    // console.log("common: ", bar);

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
        // console.log("getlocation fail: ", err)

        wx.getSetting({


          success: function (res) {
            var status = res.authSetting;

            // console.log("getSetting: ", res)

            if (status['scope.userLocation']) {
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

            } else {
              wx.showModal({
                title: '是否授权当前位置',
                content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',

                success: function (tip) {
                  if (tip.confirm) {
                    wx.openSetting({
                      success: function (data) {
                        if (data.authSetting["scope.userLocation"] === true) {
                          wx.showToast({
                            title: '授权成功',
                            icon: 'success',
                            duration: 1000
                          })
                          //授权成功之后，再调用chooseLocation选择地方
                          wx.openLocation({//​使用微信内置地图查看位置。
                            latitude: bar.latitude,//要去的纬度-地址
                            longitude: bar.longitude,//要去的经度-地址
                            name: bar.name,
                            address: bar.address
                          })

                        } else {
                          wx.showToast({
                            title: '授权失败',
                            icon: 'success',
                            duration: 1000
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          },

          fail: function (res) {
            wx.showToast({
              title: '调用授权窗口失败',
              icon: 'success',
              duration: 1000
            })
          }
        })

      }
    })

  }

})
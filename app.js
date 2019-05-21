//app.js
App({
  globalData: {
    userInfo: null,
    openid: null,
    foobar: {},
    bars: null,
    idbars: {},
    cur_bar: 0,
    map_height: 300,
    appointment_needs_refresh: false
  },

  onLaunch: function () {
    // 展示本地存储能力
    var that = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
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
              this.globalData.userInfo = res.userInfo
              //console.log(res.userInfo);

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
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
      }
    })

    // 获取数据库内容
    const db = wx.cloud.database();

    db.collection('foos_place').get({
      success: function (res) {
        var foobar = res.data;
        var bars = [];
        var idbars = {};
        var index = 0;

        for (var i = 0; i < foobar.length; i++) {
          var places = foobar[i].places
          for (var j = 0; j < places.length; j++) {
            var barid = places[j].barid; //barid = Math.random().toString(36).substr(2, 15)

            bars.push(places[j]);

            bars[index].id = index;
            bars[index].iconPath = '/images/poi80.png';
            bars[index].width = 30;
            bars[index].height = 30;
            bars[index].callout = { content: bars[index].name };

            idbars[barid] = bars[index];

            index++;   
          }
        }

        that.globalData.foobar = foobar;
        that.globalData.bars = bars;
        that.globalData.idbars = idbars;
        //console.log(idbars);

        if (that.dataReadyCallback) {
          that.dataReadyCallback(res);
        }

        if (that.dataReadyCallback_picker) {
          that.dataReadyCallback_picker(res);
        }
      },
      fail: function (err) {
        console.error(err);
      }
    });


  },

  userInfoReadyCallback: function (user) {
    //console.log(user);
    this.globalData.userInfo = user;
  },

  // 获取用户openid
  getOpenid() {
    let that = this;
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {
        //console.log(res);
        //console.log('云函数获取到的openid: ', res.result.openid)
        that.globalData.openid = res.result.openid;
      }
    })
  }

})
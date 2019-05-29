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
    currentData: 0,
    winHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    var that = this;
    var query = wx.createSelectorQuery();

    // console.log("likediscussion onLoad: ", app.globalData.cur_barid);
    this.getBarLikeDiscussion(app.globalData.cur_barid);

    this.setData({
      userInfo: app.globalData.userInfo,
      winHeight: app.globalData.map_height
    })

    wx.getSystemInfo({
      success: function (res) {
        //console.log(res);
        query.select('#swipertab').boundingClientRect()
        query.exec(function (res2) {
          // console.log(res.windowHeight, res2[0].height);
          that.setData({
            winHeight: res.windowHeight - res2[0].height
          });
        });
      }
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
    wx.stopPullDownRefresh() //停止下拉刷新 
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
          // console.log(res);
          if (res.data.length == 0) {
            // console.log("no record!");
            // insert record, TODO: race and several records with same barid??
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
              }
            })
          }

          res.data[0].likeNumber = res.data[0].like.length;
          res.data[0].discussionNumber = res.data[0].discussion.length;
          res.data[0].lastUpdateTime = util.formatDate(new Date(res.data[0].lastUpdateTime));

          var barlikediscussion = res.data[0];

          barlikediscussion.meAlreadyLiked = false;
          for (var i = 0; i < barlikediscussion.like.length; i++) {
            if (barlikediscussion.like[i].openid == app.globalData.openid) {
              barlikediscussion.meAlreadyLiked = true;
              break;
            }
          }

          that.setData({
            barlikediscussion: barlikediscussion
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

    var barlikediscussion = that.data.barlikediscussion
    var rid = barlikediscussion._id;
    barlikediscussion.discussion.unshift({
      openid: app.globalData.openid,
      nick: app.globalData.userInfo.nickName,
      avatarUrl: app.globalData.userInfo.avatarUrl,
      createTime: util.formatTime(new Date()),
      content: content
    });
    barlikediscussion.discussionNumber++;

    that.setData({
      barlikediscussion
    });

    wx.cloud.callFunction({
      name: 'foosDB',
      data: {
        db: 'foos_barlikediscussion',
        type: 'update',
        indexKey: rid,
        data: {
          discussion: barlikediscussion.discussion,
          lastUpdateTime: Date.now()
        }
      },
      complete: res => {
        console.log("discussion update done");
      }
    })

  },

  addDelMe: function (docid) {
    //console.log('addme clicked.', e);
    var barlikediscussion = this.data.barlikediscussion;

    if (barlikediscussion._id != docid) {
      console.warn("docid not match: ", barlikediscussion, docid);

      wx.showModal({
        title: '提示',
        content: 'docid not match',
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

    if (barlikediscussion.meAlreadyLiked) {
      /* del */
      console.warn("to del me");

      function matchopenid(element) {
        return element.openid == app.globalData.openid;
      }

      // console.log(barlikediscussion.like);
      var index = barlikediscussion.like.findIndex(matchopenid);
      // console.log("index: ", index);
      barlikediscussion.like.splice(index, 1);
      // console.log(barlikediscussion.like);

      wx.cloud.callFunction({
        name: 'foosDB',
        data: {
          db: 'foos_barlikediscussion',
          type: 'update',
          indexKey: docid,
          data: {
            like: barlikediscussion.like,
            lastUpdateTime: Date.now()
          }
        },
        complete: res2 => {
          console.log("like del done");
        }
      })

      barlikediscussion.meAlreadyLiked = false;
      this.setData({
        barlikediscussion: barlikediscussion
      });

    } else {
      /* add */
      console.warn("to add me");
      barlikediscussion.like.push({
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
          indexKey: docid,
          data: {
            like: barlikediscussion.like,
            lastUpdateTime: Date.now()
          }
        },
        complete: res2 => {
          console.log("like update done");
        }
      })

      barlikediscussion.meAlreadyLiked = true;
      this.setData({
        barlikediscussion: barlikediscussion
      });
    }
  },

  onGotUserInfoAddme: function (e) {
    // console.log("onGotUserInfoAddme: ", e);
    if (e.detail.userInfo) {
      var user = e.detail.userInfo;
      //console.log(user)
      app.userInfoReadyCallback(user);

      this.addDelMe(e.currentTarget.id);
    } else {
      console.log("用户拒绝了登陆");
      return;
    }
  },

  // TODO to delete
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




})


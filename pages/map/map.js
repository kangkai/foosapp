
// 引入coolsite360交互配置设定
//require('coolsite.config.js');

// 获取全局应用程序实例对象
//var app = getApp();



// 创建页面实例对象
Page({
  /**
   * 页面名称
   */
  name: "map",
  /**
   * 页面的初始数据
   */

  data: {
  

  //map 标记数据
    
    wx_map_d6dafd71:{
      markers: [
        {
          iconPath: 'resources/map_marker.png',
          id: 0,
          latitude: 39.940690,
          longitude: 116.403350,
          width: 50,
          height: 50,
          callout: {
            content: "The Pool Bar"
          }
        },
        {
          iconPath: 'resources/map_marker.png',
          id: 1,
          latitude: 39.948530,
          longitude: 116.412900,
          width: 50,
          height: 50,
          callout: {
            content: "School Bar"
          }
        },
        {
          iconPath: 'resources/map_marker.png',
          id: 2,
          latitude: 31.235397,
          longitude: 121.453018,
          width: 50,
          height: 50,
          callout: {
            content: "Cages"
          }
        },
        {
          iconPath: 'resources/map_marker.png',
          id: 3,
          latitude: 40.048600,
          longitude: 116.276910,
          width: 50,
          height: 50,
          callout: {
            content: "智云球场"
          }
        },
        {
          iconPath: 'resources/map_marker.png',
          id: 4,
          latitude: 39.980578,
          longitude: 116.310239,
          width: 50,
          height: 50,
          callout: {
            content: "微软亚太研发集团"
          }
        },
        {
          iconPath: 'resources/map_marker.png',
          id: 5,
          latitude: 40.008600,
          longitude: 116.487560,
          width: 50,
          height: 50,
          callout: {
            content: "美团"
          }
        },
        {
          iconPath: 'resources/map_marker.png',
          id: 6,
          latitude: 40.039925,
          longitude: 116.332611,
          width: 50,
          height: 50,
          callout: {
            content: "小米6期"
          }
        },
        {
          iconPath: 'resources/map_marker.png',
          id: 7,
          latitude: 31.236030,
          longitude: 121.440640,
          width: 50,
          height: 50,
          callout: {
            content: "Coney's Bar"
          }
        },
        {
          iconPath: 'resources/map_marker.png',
          id: 8,
          latitude: 31.225350,
          longitude: 121.465810,
          width: 50,
          height: 50,
          callout: {
            content: "Park 91 Pub"
          }
        },
        {
          iconPath: 'resources/map_marker.png',
          id: 9,
          latitude: 38.874399,
          longitude: 121.558173,
          width: 50,
          height: 50,
          callout: {
            content: "大隐文化街区"
          }
        },
        {
          iconPath: 'resources/map_marker.png',
          id: 10,
          latitude: 39.086152,
          longitude: 121.720118,
          width: 50,
          height: 50,
          callout: {
            content: "大连金州区友好街87号"
          }
        },
        {
          iconPath: 'resources/map_marker.png',
          id: 11,
          latitude: 31.913440,
          longitude: 118.811330,
          width: 50,
          height: 50,
          callout: {
            content: "南京市江宁区九龙湖国际企业园"
          }
        },
        {
          iconPath: 'resources/map_marker.png',
          id: 12,
          latitude: 31.891291,
          longitude: 118.789302,
          width: 50,
          height: 50,
          callout: {
            content: "南京福特汽车研发中心"
          }
        },
        {
          iconPath: 'resources/map_marker.png',
          id: 13,
          latitude: 31.981689,
          longitude: 118.738631,
          width: 50,
          height: 50,
          callout: {
            content: "南京小米研发中心"
          }
        },
        {
          iconPath: 'resources/map_marker.png',
          id: 14,
          latitude: 30.259020,
          longitude: 120.124800,
          width: 50,
          height: 50,
          callout: {
            content: "COLLEGE(兰家湾店)"
          }
        },
        {
          iconPath: 'resources/map_marker.png',
          id: 15,
          latitude: 25.058749,
          longitude: 102.692168,
          width: 50,
          height: 50,
          callout: {
            content: "昆明醉龟酒吧"
          }
        },
        {
          iconPath: 'resources/map_marker.png',
          id: 16,
          latitude: 22.585291,
          longitude: 113.957522,
          width: 50,
          height: 50,
          callout: {
            content: "西丽小学"
          }
        },
        {
          iconPath: 'resources/map_marker.png',
          id: 17,
          latitude: 31.301620,
          longitude: 120.682530,
          width: 50,
          height: 50,
          callout: {
            content: "李公堤风情酒吧 乌托邦酒吧"
          }
        },
        {
          iconPath: 'resources/map_marker.png',
          id: 18,
          latitude: 31.313310,
          longitude: 120.671740,
          width: 50,
          height: 50,
          callout: {
            content: "蓝枪鱼西餐厅(星海店)"
          }
        },
        {
          iconPath: 'resources/map_marker.png',
          id: 19,
          latitude: 22.810556,
          longitude: 108.401346,
          width: 50,
          height: 50,
          callout: {
            content: "南宁候朋现场"
          }
        },
        {
          iconPath: 'resources/map_marker.png',
          id: 20,
          latitude: 21.978070,
          longitude: 108.626390,
          width: 50,
          height: 50,
          callout: {
            content: "钦州候朋现场,原石酒吧"
          }
        },
        {
          iconPath: 'resources/map_marker.png',
          id: 21,
          latitude: 21.977937,
          longitude: 108.649507,
          width: 50,
          height: 50,
          callout: {
            content: "豌豆竞技"
          }
        },
        {
          iconPath: 'resources/map_marker.png',
          id: 22,
          latitude: 21.653560,
          longitude: 108.359120,
          width: 50,
          height: 50,
          callout: {
            content: "防城港候朋现场"
          }
        },
        {
          iconPath: 'resources/map_marker.png',
          id: 23,
          latitude: 30.645680,
          longitude: 104.055140,
          width: 50,
          height: 50,
          callout: {
            content: "成都蒸汽旅舍"
          }
        },
        {
          iconPath: 'resources/map_marker.png',
          id: 24,
          latitude: 25.068453,
          longitude: 102.723680,
          width: 50,
          height: 50,
          callout: {
            content: "昆明MAO酒吧"
          }
        }
      ],
    },
    
  

  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    // 注册coolsite360交互模块
    //app.coolsite360.register(this);
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
  
})


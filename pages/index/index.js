//index.js

Page({
  data: {
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
        id: 1,
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
        id: 1,
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
        id: 1,
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
        id: 1,
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
        id: 1,
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
        id: 1,
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
        id: 1,
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
        id: 1,
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
        id: 1,
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
        id: 1,
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
        id: 1,
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
        id: 1,
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
        id: 1,
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
        id: 1,
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
        id: 1,
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
        id: 1,
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
        id: 1,
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
        id: 1,
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
        id: 1,
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
        id: 1,
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
        id: 1,
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
        id: 1,
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
        id: 1,
        latitude: 25.068453,
        longitude: 102.723680,
        width: 50,
        height: 50,
        callout: {
          content: "昆明MAO酒吧"
        }
      }
    ],
    // 地图上控件数组
    controls: [{
      // id号 方便找到是哪个控件
      id: 2000,
      // 图片路径
      iconPath: '',
      // 相对于地图的位置
      position: {
        left: 375 - 120,
        top: 50,
        width: 50,
        height: 50
      },
      // 是否可以点击
      clickable: true
    }]
  },
  // 地图相关动作的几个方法
  regionchange(e) {
    console.log(e.type)
  },
  // markers的点击事件
  markertap(e) {
    // 点击相应的坐标点取出相应的信息
    console.log(e.markerId)
  },
  // control的点击事件
  controltap(e) {
    console.log(e.controlId)
  },
})


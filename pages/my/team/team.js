//获取应用实例
var app = getApp()

Page({
  data: {
    user_list: {},
    activeIndex: 0,//默认选中第一个
    tabList: [   //tab切换分类列表
      {
        id: 0,
        listTit: '店主',
      },
      {
        id: 1,
        listTit: '顾客',
      },
      {
        id: 2,
        listTit: '访客',
      }
    ],
    shopkeeper: {
      num: 4,
      shopkeeperList: [//店主数据
        {
          header: '/image/dzjx_bg.png', //头像
          name: '微信昵称1'//微信昵称
        },
        {
          header: '/image/dzjx_bg.png', //头像
          name: '微信昵称2'
        },
        {
          header: '/image/dzjx_bg.png', //头像
          name: '微信昵称3'
        },
        {
          header: '/image/dzjx_bg.png', //头像
          name: '微信昵称4'
        }
      ]
    },
    customer: {
      num: 4,
      customerList: [//店主数据
        {
          header: '/image/dzjx_bg.png', //头像
          name: '顾客1'//微信昵称
        },
        {
          header: '/image/dzjx_bg.png', //头像
          name: '顾客2'
        },
        {
          header: '/image/dzjx_bg.png', //头像
          name: '顾客3'
        },
        {
          header: '/image/dzjx_bg.png', //头像
          name: '顾客4'
        }
      ]
    },
    visitor: {
      personNum: 1,//今日访问人数
      visitNum: 5, //今日访问量
      visitList: [{
          pic: '/image/dzjx_bg.png',
          name: '三九999感冒灵颗粒',   
        },
        {
          pic: '/image/dzjx_bg.png',
          name: '贝克海姆',
        }
      ]
    }
  },
  onLoad: function (options) {
    this.getTeam(0);
    this.getTeam(1);
    this.getTeam(2);
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  getTeam: function (id) {
    var that = this
    app.loading()
    app.checkLogin()
    var session_key = wx.getStorageSync('session_key')
    wx.request({
      url: app.globalData.config.host + '/home/my_team/' + id,
      data: {
        session_key: wx.getStorageSync('session_key')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        app.hide()
        console.log(res)
        if (res.data.type == 0) {
          that.setData({
            visitor: {
              personNum: 1,
              visitNum: 5,
              visitList: res.data.list
            }
          })
        } else if (res.data.type == 1) {
          that.setData({
            customer: {
              num: res.data.count,
              customerList: res.data.list
            }
          })
        } else if (res.data.type == 2) {
          that.setData({
            shopkeeper: {
              num: res.data.count,
              shopkeeperList: res.data.list
            }
          })
        }
      }
    })
  },
  tabClick: function (e) {
    var _this = this;
    var id = e.currentTarget.id;
    _this.setData({
      activeIndex: id,
    });
  },
  home: function () {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  selection: function () {
    wx.switchTab({
      url: '/pages/selection/selection'
    })
  },
  car: function () {
    wx.switchTab({
      url: '/pages/car/car'
    })
  },
  my: function () {
    wx.switchTab({
      url: '/pages/my/my'
    })
  }
})
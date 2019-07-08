//获取应用实例
var app = getApp()

Page({
  data: {
    activeIndex: 0,//默认选中第一个
    tabList: [   //tab切换分类列表
      {
        id: 0,
        listTit: '待使用',
      },
      {
        id: 1,
        listTit: '已失效',
      }
    ],
    ticketsList: []
  },
  onLoad: function (options) {
    var that = this
    this.getUserCoupon()
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  getUserCoupon() {
    var that = this
    app.checkLogin()
    var session_key = wx.getStorageSync('session_key')
    var t = that.data.activeIndex
    wx.request({
      url: app.globalData.config.host + '/home/coupon_list',
      data: {
        session_key: session_key,
        t: t
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log(res.data)
        that.setData({
          ticketsList: res.data.list
        })
      }
    })
  },
  usehelp:function(){
    wx:wx.navigateTo({
      url: '/pages/coupon/usehelp/usehelp'
    })
  },
  tabClick: function (e) {
    var _this = this;
    var id = e.currentTarget.id;
    _this.setData({
      activeIndex: id,
    });
    this.getUserCoupon()
  },
  home:function(){
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  selection:function(){
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
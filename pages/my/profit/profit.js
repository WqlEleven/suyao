//获取应用实例
var app = getApp()

Page({
  data: {
    profitTotal: 50,//累计收益
    profitMonth: 50,//本月收益
    profitDay: 50,//本日收益
    profitLastMonth: 50//上月收益
  },
  onLoad: function (options) {
    var that = this
    app.checkLogin()
    var session_key = wx.getStorageSync('session_key')
    wx.request({
      url: app.globalData.config.host + '/home/money_income',
      data: {
        session_key: session_key
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log(res.data)
        that.setData({
          profitTotal: res.data.money,
          profitMonth: res.data.money_month,
          profitDay: res.data.money_day,
          profitLastMonth: res.data.money_last
        })
      }
    })
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
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
//获取应用实例
var app = getApp()

Page({
  data: {
    pickUpList: []
  },
  onLoad: function (options) {
    this.getCashList()
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  getCashList: function () {
    var that = this
    app.checkLogin()
    var session_key = wx.getStorageSync('session_key')
    wx.request({
      url: app.globalData.config.host + '/home/cash_list',
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
          pickUpList: res.data.list
        })
      }
    })
  },

  cash: function () {
    var that = this
    //app.checkLogin()
    var session_key = wx.getStorageSync('session_key')
    wx.request({
      url: app.globalData.config.host + '/home/cash',
      data: {
        session_key: session_key
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log(res.data)
        if (res.data.status == 0) {
          app.success('提现成功！', 1500, '/pages/my/pickup/pickup')
        } else if (res.data.status == 1) {
          wx.navigateTo({
            url: '/pages/my/gift/writeMessage/writeMessage'
          })
        } else {
          app.error(res.data.message)
        }
      }
    })
  },

  cashTap: function (event) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要提现吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.cash()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
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
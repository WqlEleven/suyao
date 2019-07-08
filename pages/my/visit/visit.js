//获取应用实例
var app = getApp()

Page({
  data: {
    user: {},
    pickUpList: []
  },
  onLoad: function (options) {
    var that = this
    //app.checkLogin();
    that.getUserInfo();
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  onShareAppMessage: function (res) {
    console.log(res)
    var that = this
    var id = 1;
    var user_id = wx.getStorageSync('user_id')
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    //console.log(user_id)
    //console.log(that.data)
    var nickname = that.data.user.nickname;
    var parent_id = that.data.user.id;
    console.log(parent_id + '=' + nickname)
    var title = '速药大礼包';
    if (nickname !== undefined) {
      title = nickname + '的速药大礼包';
    }
    return {
      title: title,
      path: '/pages/my/gift/giftlist/giftlist?id=' + id + '&parent_id=' + user_id,
      success: function (res) {
        // 转发成功
        //console.log(that.data.user.id)
        console.log(res)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  back: function () {
    wx.navigateBack({
      //delta: 2
    })
  },
  cash_list: function () {
    var that = this
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
  getUserInfo: function () {
    var that = this
    //var user_id = wx.getStorageSync('user_id')
    var session_key = wx.getStorageSync('session_key')
    wx.request({
      url: app.globalData.config.host + '/home/user_info',
      data: {
        //user_id: user_id,
        session_key: session_key
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log(res.data)
        that.setData({
          user: res.data.info
        })
      }
    })
  }
})
// pages/my/visit/visitDetail.js
//获取应用实例
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    customer: [
      {
        avatar: '/image/dzjx_bg.png',
        nickname: "赵四"
      },
      {
        avatar: '/image/dzjx_bg.png',
        nickname: "何以琛"
      }
    ],
    num: 6
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTeam(2)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
            customer: res.data.list,
            num: res.data.count
          })
        } else if (res.data.type == 1) {
          that.setData({
            customer: res.data.list,
            num: res.data.count
          })
        } else if (res.data.type == 2) {
          that.setData({
            customer: res.data.list,
            num: res.data.count
          })
        }
      }
    })
  }
})
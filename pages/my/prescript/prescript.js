// pages/my/prescript/prescript.js
//获取应用实例
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderList()
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
  getOrderList: function () {
    app.loading()
    var that = this
    wx.request({
      url: app.globalData.config.host + '/home/prescript_list',
      method: 'post',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        session_key: wx.getStorageSync('session_key')
      },
      success: function (mes) {
        app.hide()
        if (mes.data.length) {
          that.setData({
            orderList: mes.data
          })
        }
      }
    })
  },
  showOrder: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/prescriptDetail/prescriptDetail?id=' + id
    })
  }
})
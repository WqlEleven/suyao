//获取应用实例
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    province_id: 0,
    cityList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    if (id !== undefined) {
      this.setData({
        province_id: id
      })
      this.getCityList()
    }
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
  getCityList: function () {
    var that = this
    var session_key = wx.getStorageSync('session_key')
    app.loading()
    wx.request({
      url: app.globalData.config.host + '/home/city',
      method: 'post',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        session_key: session_key,
        province_id: that.data.province_id
      },
      success: function (res) {
        app.hide()
        that.setData({
          cityList: res.data.list
        })
      }
    })
  },
  selectCity: function (e) {
    var that = this
    var id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/my/doctor/hospital/hospital?province_id=' + that.data.province_id + '&city_id=' + id,
    })
  }
})
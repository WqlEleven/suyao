// pages/search/search.js
//获取应用实例
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchKeyword: '',
    popSearch: [
      {
        name: '按摩按摩理疗按摩理疗按摩理疗理疗'
      },
      {
        name: '花疗'
      },
      {
        name: '按摩理疗'
      },
      {
        name: '花疗'
      }
    ],
    searchKeyword: '', //搜索关键字 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 获取并设置文本框内容
   */
  bindKeywordInput: function (e) {
    this.setData({
      searchKeyword: e.detail.value
    })
  },

  /**
   *  搜索
   */
  keywordSearch: function (e) {
    var keywords = this.data.searchKeyword
    wx.redirectTo({
      url: '/pages/goodsList/goodsList?keywords=' + keywords,
    })
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
    wx.stopPullDownRefresh()
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

  }
})
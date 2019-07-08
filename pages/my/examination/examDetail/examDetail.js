// pages/my/examination/examDetail/examDetail.js
//获取应用实例
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    info: {},
    paper: {},
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    if (id != undefined) {
      this.setData({
        id: id
      })
      this.getExamInfo(id)
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
  getExamInfo: function (id) {
    var that = this
    //app.checkLogin()
    var session_key = wx.getStorageSync('session_key')
    wx.request({
      url: app.globalData.config.host + '/home/exam_info',
      method: 'post',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        session_key: session_key,
        id: that.data.id
      },
      success: function (res) {
        //console.log(res)
        var list = res.data.data.list
        for (var i = 0; i < list.length; i++) {
          for (var j = 0; j < list[i].option_list.length; j++) {
            //if (list[i].answer.split(',').indexOf(String.fromCharCode(65 + j)) != -1) {
            if (list[i].answer.split(',').indexOf(list[i].option_list[j].key) != -1) {
              list[i].option_list[j].isAnswer = true
            } else if (list[i].select.split(',').indexOf(list[i].option_list[j].key) != -1) {
              list[i].option_list[j].isCheck = true
            }
          }
        }
        that.setData({
          info: res.data.data.info,
          paper: res.data.data.paper,
          list: list
        })
      }
    })
  }
})
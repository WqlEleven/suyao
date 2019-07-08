// pages/my/doctor/hospital/hospital.js
//获取应用实例
var app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 0,//默认选中第一个
    department: [],
    departmentList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getList()
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
  getList: function (parent_id = 0) {
    var that = this
    var session_key = wx.getStorageSync('session_key')
    app.loading()
    wx.request({
      url: app.globalData.config.host + '/home/department',
      method: 'post',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        session_key: session_key,
        parent_id: parent_id
      },
      success: function (res) {
        app.hide()
        if (parent_id == 0) {
          that.setData({
            departmentList: res.data.list
          })
          that.getList(res.data.list[0].id)
        } else {
          that.setData({
            department: res.data.list
          })
        }
      }
    })
  },
  // 科室列表
  changeDepartment: function (e) {
    var that = this
    var id = e.currentTarget.id
    var departmentList = that.data.departmentList
    var status = e.currentTarget.dataset.id
    this.setData({
      activeIndex: status
    })
    that.getList(id)
  },
  // 选择科室
  selectDepartment: function (e) {
    var that = this
    var id = e.currentTarget.id
    var value = e.currentTarget.dataset.name
    wx.setStorage({
      key: 'department',
      data: [{ id: id, value: value }],
      success: function () {
        wx.navigateBack({
          delta: 1
        })
      }
    })
  }
})
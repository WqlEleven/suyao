// pages/my/doctor/visitTime/visitTime.js
//获取应用实例
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    visitTime: [{
      day: '周一',
      morning: 0,
      afternoon: 0,
      night: 0
    },
    {
      day: '周二',
      morning: 0,
      afternoon: 0,
      night: 0
    },
    {
      day: '周三',
      morning: 0,
      afternoon: 0,
      night: 0
    },
    {
      day: '周四',
      morning: 0,
      afternoon: 0,
      night: 0
    },
    {
      day: '周五',
      morning: 0,
      afternoon: 0,
      night: 0
    }, {
      day: '周六',
      morning: 0,
      afternoon: 0,
      night: 0
    },
    {
      day: '周日',
      morning: 0,
      afternoon: 0,
      night: 0
    }]
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
    var that = this
    wx.getStorage({
      key: 'visitTime',
      success: function (res) {
        var data = res.data;
        var visitTime = that.data.visitTime
        for (var i = 0; i < data.length; i++) {
          if (data[i].morning) {
            visitTime[i].morning = 1
          }
          if (data[i].afternoon) {
            visitTime[i].afternoon = 1
          }
          if (data[i].night) {
            visitTime[i].night = 1
          }
        }
        that.setData({
          visitTime: visitTime
        });
      }
    });
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
  changeStatu1: function (e) {
    var that = this;
    var value = e.currentTarget.dataset.value == 0 ? 1 : 0;
    var index = e.currentTarget.dataset.index;
    var up = "visitTime[" + index + "].morning";
    that.setData({
      [up]: value
    });
  },
  changeStatu2: function (e) {
    var that = this;
    var value = e.currentTarget.dataset.value == 0 ? 1 : 0;
    var index = e.currentTarget.dataset.index;
    var up = "visitTime[" + index + "].afternoon";
    that.setData({
      [up]: value
    });
  },
  changeStatu3: function (e) {
    var that = this;
    var value = e.currentTarget.dataset.value == 0 ? 1 : 0;
    var index = e.currentTarget.dataset.index;
    var up = "visitTime[" + index + "].night";
    that.setData({
      [up]: value
    });
  },
  submit: function () {
    var that = this
    var data = that.data.visitTime
    //console.log(data)
    var list = []
    for (var i = 0; i < data.length; i++) {
      if (data[i].morning || data[i].afternoon || data[i].night) {
        list.push(data[i].day)
      }
    }
    //console.log(list)
    wx.setStorage({
      key: 'visitTime',
      data: data,
      success: function () {
        wx.navigateBack({
          delta: 1
        })
      }
    })
  }
})
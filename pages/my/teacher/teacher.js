//获取应用实例
var app = getApp()

Page({
  data: {
    filePath: ''
  },
  onLoad: function (options) {
    this.getTeacher()
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  getTeacher() {
    var that = this
    app.checkLogin()
    var session_key = wx.getStorageSync('session_key')
    wx.request({
      url: app.globalData.config.host + '/home/my_teacher',
      data: {
        session_key: session_key
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        //console.log(res)
        that.setData({
          filePath: res.data.url
        })
      }
    })
  },
  download: function () {
    var that = this
    var url = that.data.filePath
    if (url == '') {
      wx.showToast({
        title: '没有培训老师!',
        image: '/image/error.png',
        duration: 1000
      })
    } else {
      wx.downloadFile({
        url: url,
        success: function (res) {
          var filePath = res.tempFilePath
          that.saveQrcode(filePath)
        },
        fail: function (res) {
          console.log(res)
          app.error(res.errMsg)
        }
      })
    }
  },
  saveQrcode: function (filePath) {
    var that = this;
    wx.saveImageToPhotosAlbum({
      filePath: filePath,
      success(res) {
        wx.showToast({
          title: '保存成功!',
          duration: 1000
        })
      },
      fail(res) {
        wx.showToast({
          title: '保存失败!',
          image: '/image/error.png',
          duration: 1000
        })
      }
    });
  }
})
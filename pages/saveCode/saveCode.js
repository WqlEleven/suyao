// pages/goodsDetail/savePageCode/savePageCode.js
//获取应用实例
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    filePath: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    this.setData({
      id: id
    })
    this.qrcode()
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
  //二维码
  qrcode: function () {
    var that = this
    //app.checkLogin()
    var session_key = wx.getStorageSync('session_key')
    var id = this.data.id
    wx.request({
      url: app.globalData.config.host + '/home/qrcode_goods',
      data: {
        session_key: session_key,
        id: id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log(res)
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
      app.error('图片为空！')
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
        app.error('保存成功！')
      },
      fail(res) {
        app.error('保存失败！')
      }
    });
  }
})
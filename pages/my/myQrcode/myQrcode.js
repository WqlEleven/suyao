// pages/my/myQrcode/myQrcode.js
//获取应用实例
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    filePath: '/image/qrcode.png',
    picture: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo()
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
  getUserInfo: function () {
    var that = this
    //app.checkLogin()
    var session_key = wx.getStorageSync('session_key')
    wx.request({
      url: app.globalData.config.host + '/home/user_info',
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
          userInfo: res.data.info,
          filePath: res.data.info.teacher
        })
      }
    })
  },

  chooseImage: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths[0]
        that.setData({
          filePath: tempFilePaths,
        })
        app.loading()
        wx.uploadFile({
          url: app.globalData.config.host + '/home/upload',
          filePath: tempFilePaths,
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function (res) {
            console.log(res)
            app.hide()
            if (res.statusCode == 200) {
              var data = JSON.parse(res.data)
              if (data.code == 0) {
                var fileName = data.data.file_name
                that.setData({
                  picture: fileName
                })
                that.saveQrcode(fileName)
              } else {
                app.error(data.message)
              }
            } else {
              app.error(res.errMsg)
            }
          }
        })
      }
    })
  },
  saveQrcode: function (picture) {
    var that = this

    app.loading()
    var session_key = wx.getStorageSync('session_key')
    wx.request({
      url: app.globalData.config.host + '/home/qrcode_save',
      data: {
        session_key: session_key,
        picture: picture
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log(res.data)
        app.hide()
        if (res.data.code == 0) {
          app.success('保存成功！', 1500, '/pages/my/my', 'navigateBack')
        } else {
          app.error(res.data.message)
        }
      }
    })
  }
})
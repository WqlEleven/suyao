// pages/my/doctor/workerCard/workerCard.js
//获取应用实例
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    workerImg: '/image/zhicheng.png', // 默认身份证照片正面
    picture: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'credentials',
      success: function (res) {
        if (res.data) {
          that.setData({
            workerImg: app.globalData.config.sinaHost + '/picture/' + res.data,
            picture: res.data
          });
        }
      }
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
  chooseImage: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths[0]
        that.setData({
          workerImg: tempFilePaths,
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
  submit: function () {
    var that = this
    if (that.data.picture == '') {
      app.error('请上传职称证书')
      return;
    }
    wx.setStorage({
      key: 'credentials',
      data: that.data.picture,
      success: function () {
        wx.navigateBack({
          delta: 1
        })
      }
    })
  }
})
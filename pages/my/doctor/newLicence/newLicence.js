// pages/my/doctor/workerCard/workerCard.js
//获取应用实例
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    licenceId: '',
    licenceInfoImg: '/image/newLicence.png', // 默认身份证照片正面
    version: 'new',
    curVersion: '',
    picture: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'version',
      success: function (res) {
        that.setData({
          curVersion: res.data
        });
        if (that.data.curVersion == 'new') {
          wx.getStorage({
            key: 'licenceId',
            success: function (res) {
              if (res.data) {
                that.setData({
                  licenceId: res.data
                });
              }
            }
          })
          wx.getStorage({
            key: 'licenceInfoImg',
            success: function (res) {
              if (res.data) {
                that.setData({
                  licenceInfoImg: app.globalData.config.sinaHost + '/picture/' + res.data,
                  picture: res.data
                });
              }
            }
          })
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
          licenceInfoImg: tempFilePaths,
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
  licenceInput: function (e) {
    this.setData({
      licenceId: e.detail.value
    })
  },
  submit: function () {
    var that = this
    if (that.data.licenceId == '') {
      app.error('请输入医师资格证书编号')
      return;
    }
    if (that.data.picture == '') {
      app.error('请上传新版医师执业信息页')
      return;
    }
    wx.setStorage({
      key: "licenceId",
      data: that.data.licenceId
    })
    wx.setStorage({
      key: "version",
      data: that.data.version
    })
    wx.setStorage({
      key: "licenceInfoImg",
      data: that.data.picture
    })
    wx.navigateBack({
      delta: 2
    })
  }
})
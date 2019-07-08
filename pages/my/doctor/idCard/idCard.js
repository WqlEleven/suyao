// pages/my/doctor/workerCard/workerCard.js
//获取应用实例
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    idcard: '',
    image: '/image/bg1.jpg', // 默认身份证照片正面
    backimage: '/image/bg2.jpg', // 默认身份证照片背面,
    picture: '',
    photo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'idcard',
      success: function (res) {
        if (res.data) {
          that.setData({
            idcard: res.data
          });
        }
      }
    })
    wx.getStorage({
      key: 'idCardsImg',
      success: function (res) {
        if (res.data) {
          that.setData({
            image: app.globalData.config.sinaHost + '/picture/' + res.data,
            photo: res.data
          });
        }
      }
    })
    wx.getStorage({
      key: 'idCardsBackImg',
      success: function (res) {
        if (res.data) {
          that.setData({
            backimage: app.globalData.config.sinaHost + '/picture/' + res.data,
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
          image: tempFilePaths,
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
                  photo: fileName
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
  chooseBackImage: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths[0]
        that.setData({
          backimage: tempFilePaths,
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
  // 身份证号绑定
  idcardInput: function (e) {
    this.setData({
      idcard: e.detail.value
    })
  },
  setImg: function () {
    var that = this
    if (that.data.idcard == '') {
      app.error('请输入身份证号码')
      return;
    }
    if (!/(^\d{15}$)|(^\d{17}([0-9]|X))$/i.test(that.data.idcard)) {
      app.error('身份证号格式不正确')
      return;
    }
    if (that.data.photo == '') {
      app.error('请上传身份证正面')
      return;
    }
    if (that.data.picture == '') {
      app.error('请上传身份证背面')
      return;
    }
    wx.setStorage({
      key: "idcard",
      data: that.data.idcard
    })
    wx.setStorage({
      key: "idCardsImg",
      data: that.data.photo
    })
    wx.setStorage({
      key: "idCardsBackImg",
      data: that.data.picture
    })
    wx.navigateBack({
      delta: 1
    })
  }
})
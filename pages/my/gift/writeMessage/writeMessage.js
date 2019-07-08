//获取应用实例
var app = getApp()

//计时器
var timer

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    real_name: '',
    mobile: '',
    code: '',
    sending: false,
    second: 60
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    if (id !== undefined) {
      this.setData({
        id: id
      })
    }
    //app.checkLogin()
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
  getPhoneNumber: function (e) {
    console.log(e.detail)
    var that = this
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      //app.checkLogin()
      var session_key = wx.getStorageSync('session_key')
      wx.request({
        url: app.globalData.config.host + '/home/user_phone',
        data: {
          session_key: session_key,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' //application/json
        },
        method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        success: function (res) {
          console.log(res.data)
          that.setData({
            mobile: res.data.data.phoneNumber
          })
        }
      })
    }
  },
  nameInput: function (e) {
    this.setData({
      real_name: e.detail.value
    })
  },
  mobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  codeInput: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  codeTap: function (event) {
    var that = this
    var mobile = this.data.mobile
    if (mobile != '' && mobile.length == 11) {
      //app.checkLogin()
      var session_key = wx.getStorageSync('session_key')
      wx.request({
        url: app.globalData.config.host + '/home/sms_code',
        data: {
          session_key: session_key,
          mobile: mobile
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' //application/json
        },
        method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        success: function (res) {
          console.log(res.data)
          that.setData({
            sending: true
          })
          timer = setInterval(function () {
            var num = that.data.second - 1
            that.setData({
              second: num
            })
            if (num < 1) {
              clearInterval(timer)
              that.setData({
                sending: false,
                second: 60
              })
            }
          }, 1000)
        }
      })
    } else {
      app.error('手机号格式错误！')
    }
  },
  submitTap: function (event) {
    var that = this
    var real_name = this.data.real_name
    var mobile = this.data.mobile
    var code = this.data.code
    if (real_name == '') {
      app.error('请输入真实姓名！')
    } else if (mobile == '' || mobile.length != 11) {
      app.error('手机号格式错误！')
    } else if (code == '') {
      app.error('请输入验证码！')
    } else {
      //app.checkLogin()
      var session_key = wx.getStorageSync('session_key')
      wx.request({
        url: app.globalData.config.host + '/home/sms_check',
        data: {
          session_key: session_key,
          real_name: that.data.real_name,
          mobile: that.data.mobile,
          code: that.data.code
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' //application/json
        },
        method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        success: function (res) {
          console.log(res.data)
          if (res.data.status == 0) {
            if (that.data.id == 0) {
              wx.redirectTo({
                url: '/pages/my/pickup/pickup'
              })
            } else {
              wx.redirectTo({
                url: '/pages/my/gift/giftOrder/giftOrder?id=' + that.data.id
              })
            }
          } else {
            app.error(res.data.message)
          }
        }
      })
    }
  }
})
//导入WxParse
var WxParse = require('../../../wxParse/wxParse.js')

//获取应用实例
var app = getApp()

Page({
  data: {
    id: 0,
    pid: 0,
    user: {},
    goods: {},
    imgs: [{
      img: '/image/dzjx_bg.png'
    },
    {
      img: '/image/dzjx_bg.png'
    }
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    circular: true,
    openPicker: false,
    needAnimation: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this
    //转发参数
    var id = options.id
    var parent_id = options.parent_id
    //id = 1
    //parent_id = 2
    console.log('id:' + id + ',parent_id:' + parent_id)
    if (id !== undefined) {
      that.setData({
        id: id
      })
    }
    if (parent_id !== undefined) {
      that.setData({
        pid: parent_id
      })
      wx.setStorageSync('parent_id', parent_id)
      this.updateParentId(parent_id);
      this.getUserInfo(parent_id);
    }
    //获取产品详情
    this.getPackageDetail(id)
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
    wx.stopPullDownRefresh()
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

  updateParentId: function (id) {
    var that = this
    app.checkLogin()
    var session_key = wx.getStorageSync('session_key')
    wx.request({
      url: app.globalData.config.host + '/home/user_parent',
      data: {
        session_key: session_key,
        parent_id: id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log(res)
      }
    })
  },
  getPackageDetail: function (id) {
    var that = this
    wx.request({
      url: app.globalData.config.host + '/home/package_detail',
      data: {
        id: id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        that.setData({
          goods: res.data.info
        })
        WxParse.wxParse('introduction', 'html', res.data.info.introduction, that)
      }
    })
  },
  getUserInfo: function (user_id) {
    var that = this
    wx.request({
      url: app.globalData.config.host + '/home/userinfo',
      data: {
        user_id: user_id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log(res.data)
        that.setData({
          user: res.data.info
        })
      }
    })
  },
  buyTap: function (event) {
    var that = this
    var id = event.currentTarget.id
    app.checkLogin()
    var session_key = wx.getStorageSync('session_key')
    wx.request({
      url: app.globalData.config.host + '/home/check_package',
      data: {
        session_key: session_key
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        if (res.data.status == 0) {
          wx.navigateTo({
            url: '/pages/my/gift/giftOrder/giftOrder?id=' + id
          })
        } else {
          wx.navigateTo({
            url: '/pages/my/gift/writeMessage/writeMessage?id=' + id
          })
        }
      }
    })
  }
})
//获取应用实例
var app = getApp()

Page({
  data: {
    userInfo: {},           //微信获取的用户信息
    user: {},                //后台查询出用户信息
    shopkeeperInfo: {},
    userLevel: false,        //用户身份
    shopholder: true,
    shoptype: '速药旗舰店',           //店名
    tabIndex: 0,
    conIndex: 0,
    type: 1,
    isVideo: false,
    videoUrl: '',
    videoList: [],
    pptList: [],
    wordList: []
  },
  onLoad: function () {

  },

  onShow: function () {
    app.checkLogin()
    this.getUserInfo()
    this.checkUserInfo()
    this.getShopKeeper()
    this.getVideoList()
    this.getWordList()
    this.getPPTList()
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  onShareAppMessage: function (res) {
    var that = this
    var user_id = wx.getStorageSync('user_id')
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: that.data.shopkeeperInfo.nickname + '的店铺',
      path: '/pages/index/index?id=' + that.data.shopkeeperInfo.id,
      success: function (res) {
        // 转发成功
        //console.log(that.data.user.id)
        console.log(res)
      },
      fail: function (res) {
        // 转发失败
        console.log(res)
      }
    }
  },
  getUserInfo: function () {
    var that = this
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            lang: 'zh_CN',
            success: function (res) {
              //console.log(res.userInfo)
              that.setData({
                userInfo: res.userInfo
              })
            }
          })
        } else {
          //that.setData({
          //  authUserinfo: false
          //})
          //wx.hideTabBar()
        }
      }
    })
  },
  getUserInfos: function () {
    var that = this
    wx.getSetting({
      success(res) {
        console.log('wx.getSetting')
        console.log(res)
        if (!res.authSetting['scope.userInfo']) {
          wx.openSetting({
            success(res) {
              console.log('wx.openSetting')
              console.log(res)
              if (res.authSetting['scope.userInfo']) {
                wx.authorize({
                  scope: 'scope.userInfo',
                  success() {
                    wx.getUserInfo({
                      withCredentials: true,
                      lang: 'zh_CN',
                      success: function (res) {
                        that.setData({
                          userInfo: res.userInfo,
                        })
                        //app.checkLogin()
                        app.wxLogin()
                        //that.getShopKeeper()
                      },
                      fail: function () {
                        console.log('wx.getUserInfo fail')
                      },
                      complete: function () {
                        console.log('wx.getUserInfo complete')
                      }
                    })
                  },
                  fail: function (res) {
                    console.log(res)
                  }
                })
              } else {
                console.log('wx.openSetting no')
              }
            }
          })
        } else {
          wx.getUserInfo({
            withCredentials: true,
            lang: 'zh_CN',
            success: function (res) {
              that.setData({
                userInfo: res.userInfo,
              })
              //app.checkLogin()
              //app.wxLogin()
              //that.getShopKeeper()
            },
            fail: function () {
              console.log('wx.getUserInfo fail')
            },
            complete: function () {
              console.log('wx.getUserInfo complete')
            }
          })
        }
      }
    })
  },

  getShopKeeper: function () {
    var that = this
    //app.checkLogin()
    var session_key = wx.getStorageSync('session_key')
    wx.request({
      url: app.globalData.config.host + '/home/shopkeeper_info',
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
          shopkeeperInfo: res.data.info
        })
      }
    })
  },

  checkUserInfo: function () {
    var that = this
    app.checkLogin()
    var session_key = wx.getStorageSync('session_key')
    wx.request({
      url: app.globalData.config.host + '/home/check_userInfo',
      method: 'post',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        session_key: session_key
      },
      success: function (res) {
        //console.log(res)
        that.setData({
          available: res.data.money_cash,
          received: res.data.money - res.data.money_cashed,
          gain: res.data.money,
          currency: res.data.currency_cash
        })
        if (res.data.level_id >= 2) {
          that.setData({
            userLevel: true,
          })
        } else {
          that.setData({ userLevel: false })
        }
        that.setData({
          userInfo: res.data,
          user: res.data
        })
      }
    })
  },
  shareShow() {
    var that = this;
    that.setData({
      shareBtn: true
    })
  },
  closeShare(e) {
    var that = this;
    that.setData({
      shareBtn: false,
      isVideo: false
    })
  },
  navClick: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    that.setData({
      tabIndex: index
    })
  },
  nav1Click: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index
    var id = e.currentTarget.id
    that.setData({
      conIndex: index,
      type: id
    })
    that.getVideoList()
    that.getWordList()
    that.getPPTList()
  },
  // 视频赋值
  videoShow: function (e) {
    var that = this;
    console.log(e);
    var url = e.currentTarget.dataset.url;
    that.setData({
      videoUrl: url,
      isVideo: true
    })
  },
  getVideoList: function () {
    var that = this
    //app.checkLogin()
    var session_key = wx.getStorageSync('session_key')
    wx.request({
      url: app.globalData.config.host + '/home/train_list',
      data: {
        session_key: session_key,
        type: that.data.type,
        extend: 1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log(res.data)
        that.setData({
          videoList: res.data.list
        })
      }
    })
  },
  getWordList: function () {
    var that = this
    //app.checkLogin()
    var session_key = wx.getStorageSync('session_key')
    wx.request({
      url: app.globalData.config.host + '/home/train_list',
      data: {
        session_key: session_key,
        type: that.data.type,
        extend: 2
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log(res.data)
        that.setData({
          wordList: res.data.list
        })
      }
    })
  },
  getPPTList: function () {
    var that = this
    //app.checkLogin()
    var session_key = wx.getStorageSync('session_key')
    wx.request({
      url: app.globalData.config.host + '/home/train_list',
      data: {
        session_key: session_key,
        type: that.data.type,
        extend: 3
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log(res.data)
        that.setData({
          pptList: res.data.list
        })
      }
    })
  },
  viewTap: function (e) {
    var url = e.currentTarget.dataset.url
    wx.downloadFile({
      url: url,
      success: function (res) {
        var filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
          }
        })
      }
    })
  },
  downloadTap: function (e) {
    var url = e.currentTarget.dataset.url
    wx.downloadFile({
      url: url,
      success: function (res) {
        if (res.statusCode === 200) {
          wx.saveFile({
            tempFilePath: res.tempFilePath,
            success: function (res) {
              var savedFilePath = res.savedFilePath
              console.log(savedFilePath)
            }
          })
        }
      }
    })
  }
})
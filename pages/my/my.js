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
    available: 20,                   //可用余额
    received: 35.5,                  //待收收益
    gain: 900,                       //累计收益
    currency: 5,
    shareBtn: false                     //我的健康币
  },
  onLoad: function () {
    this.getCouponCount()
  },

  onShow: function () {
    app.checkLogin()
    this.getUserInfo()
    this.checkUserInfo()
    this.getShopKeeper()
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

  getCouponCount: function () {
    var that = this;
    app.checkLogin()
    var session_key = wx.getStorageSync('session_key')
    wx.request({
      url: app.globalData.config.host + '/home/coupon_count',
      data: {
        session_key: session_key
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        that.setData({
          mycoupon: res.data.count
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
          received: (res.data.money - res.data.money_cash - res.data.money_cashed).toFixed(2),
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

  /**
   * 货架管理
   */
  shelfManagement: function () {
    wx.navigateTo({
      url: '/pages/my/myShop/myShop',
    })
  },

  prescriptTap: function () {
    wx.navigateTo({
      url: '/pages/my/prescript/prescript',
    })
  },

  /**
   * 我的团队
   */
  myTeam: function () {
    wx.navigateTo({
      url: '/pages/my/team/team',
    })
  },

  /**
   * 发展店主
   */
  makeOwner: function () {
    wx.navigateTo({
      url: '/pages/my/visit/visit',
    })
  },

  /**
   * 我的培训老师
   */
  myTeacher: function () {
    wx.navigateTo({
      url: '/pages/my/teacher/teacher',
    })
  },

  /**
   * 我的优惠券
   */
  myCoupon: function () {
    wx.navigateTo({
      url: '/pages/coupon/coupon',
    })
  },

  /**
   * 客户服务
   */
  customerService: function () {
    wx.navigateTo({
      url: '',
    })
  },

  /**
   * 地址管理
   */
  addressManage: function () {
    wx.navigateTo({
      url: '/pages/addressManage/addressManage?enter=my',
    })
  },
  /**
   * 我的培训老师
   */
  materialTraining: function () {
    wx.navigateTo({
      url: '/pages/my/materialtraining/materialtraining',
    })
  },
  /**
  * 我的培训考试
  */
  examTraining: function () {
    wx.navigateTo({
      url: '/pages/my/examination/examination',
    })
  },
  /**
   * 我的二维码
   */
  myQrcode: function () {
    wx.navigateTo({
      url: '/pages/my/myQrcode/myQrcode',
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
      shareBtn: false
    })
  },
  saveCode: function () {
    wx.navigateTo({
      url: '/pages/saveShopCode/saveShopCode'
    })
  },
  doctorTap: function () {
    var that = this
    if (that.data.user.is_doctor == 1) {
      app.error('您已经是医师了')
    } else {
      var session_key = wx.getStorageSync('session_key')
      wx.request({
        url: app.globalData.config.host + '/home/doctor_check',
        method: 'post',
        header: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: {
          session_key: session_key
        },
        success: function (res) {
          //console.log(res)
          if (res.data.code == 0) {
            wx.navigateTo({
              url: '/pages/my/doctor/doctor'
            })
          } else {
            app.error(res.data.message)
          }
        }
      })
    }
  }
})
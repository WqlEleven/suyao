//app.js
//导入配置文件
var config = require('config.js')

App({
  onLaunch: function (options) {
    // Do something initial when launch.
    console.log('app onLaunch')

    //调用API从本地缓存中获取数据
    //var logs = wx.getStorageSync('logs') || []
    //logs.unshift(Date.now())
    //wx.setStorageSync('logs', logs)

    this.globalData.config = config
    this.checkLogin()
  },
  onShow: function (options) {
    // Do something when show.
    console.log('app onShow')
  },
  onHide: function () {
    // Do something when hide.
    console.log('app onHide')
  },
  onError: function (msg) {
    console.log('app onError')
    console.log(msg)
  },
  globalData: {
    config: {},
    user: {},
    userInfo: null,
    //header: { 'Cookie': '' }
  },
  checkLogin: function () {
    var that = this
    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
        console.log('wx.checkSession success')
        //that.wxLogin()
        that.ckLogin()
      },
      fail: function () {
        //登录态过期
        //wx.login() //重新登录
        console.log('wx.checkSession fail')
        that.wxLogin()
      },
      complete: function () {
        console.log('wx.checkSession complete')
      }
    })
  },
  ckLogin: function () {
    var that = this

    //获取session_key
    var session_key = wx.getStorageSync('session_key')
    if (session_key == '') {
      that.wxLogin()
    } else {
      wx.request({
        url: config.host + '/home/check_login',
        data: {
          session_key: session_key
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' //application/json
        },
        method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        success: function (res) {
          console.log('ckLogin success')
          //console.log(res.data)
          if (res.data.status == 0) {
            that.wxLogin()
          } else {
            //that.getUser()
            if (that.userInfoReadyCallback) {
              that.userInfoReadyCallback(res)
            }
          }
        }
      })
    }
  },
  wxLogin: function () {
    var that = this
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: config.host + '/home/login',
            data: {
              code: res.code
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' //application/json
            },
            method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            success: function (res) {
              console.log('wxLogin success')
              console.log(res.data)
              //that.globalData.header.Cookie = 'session_id=' + res.data.session_id;
              var session_key = res.data.session_key
              that.globalData.session_key = session_key
              wx.setStorageSync('session_key', session_key)

              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(res)
              }
              
              //that.getUserInfo(function (userInfo) {
              //  that.globalData.userInfo = userInfo
              //  console.log(that.globalData.userInfo)
              //})
              /*
              wx.getUserInfo({
                //withCredentials: false,
                lang: 'zh_CN',
                success: function (res) {
                  console.log('getUserInfo success')
                  wx.request({
                    url: config.host + '/home/user_save',
                    data: {
                      session_key: session_key,
                      encryptedData: res.encryptedData,
                      iv: res.iv
                    },
                    header: {
                      'content-type': 'application/x-www-form-urlencoded' //application/json
                    },
                    method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                    success: function (res) {
                      console.log('user_save success')
                      console.log(res.data)
                      //that.getUser()
                      if (that.userInfoReadyCallback) {
                        that.userInfoReadyCallback(res)
                      }
                    }
                  })
                }
              })
              */
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      },
      fail: function () {
        console.log('wx.login fail')
      },
      complete: function () {
        console.log('wx.login complete')
      }
    });
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              withCredentials: false,
              success: function (res) {
                that.globalData.userInfo = res.userInfo
                typeof cb == "function" && cb(that.globalData.userInfo)
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
    }
  },
  getUser: function () {
    var that = this
    //that.checkLogin()
    var session_key = wx.getStorageSync('session_key')
    wx.request({
      url: config.host + '/home/user_info',
      data: {
        session_key: session_key,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log('getUser success')
        console.log(res.data)
        that.globalData.user = res.data.info
        wx.setStorageSync('user_id', res.data.info.id)
        //that.checkLevel()
        if (res.data.info.level_id >= 2) {

        } else {
          if (res.data.info.parent_id == 0) {
            var parent_id = wx.getStorageSync('parent_id')
            if (parent_id == 0) {
              that.error('您没有推荐人或您还不是店主！', 1500, '/pages/guest/guest')
            }
          }
        }
      }
    })
  },
  checkLevel: function () {
    var that = this
    var session_key = wx.getStorageSync('session_key')
    wx.request({
      url: config.host + '/home/user_info',
      data: {
        session_key: session_key,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log('checkLevel success')
        console.log(res.data)
        if (res.data.info.level_id >= 2) {

        } else {
          if (res.data.info.parent_id == 0) {
            var parent_id = wx.getStorageSync('parent_id')
            if (parent_id == 0) {
              that.error('您没有推荐人或您还不是店主！', 1500, '/pages/guest/guest')
            }
          }
        }
      }
    })
  },
  success: function (msg, time = 1500, url = '', urlType = 'redirectTo', navigateBackDelta = 1) {
    wx.showToast({
      title: msg,  //提示的内容
      icon: msg.length <= 7 ? 'success' : 'none',  //图标，有效值 "success", "loading", "none"
      //image: '/image/success.png',  //自定义图标的本地路径，image 的优先级高于 icon
      duration: time,  //提示的延迟时间，单位毫秒，默认：1500
      mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false
      success: function (res) {//接口调用成功的回调函数
        //console.log(res)
        if (typeof url == 'function') {
          setTimeout(function () {
            url()
          }, time)
        } else {
          if (url != '' || urlType == 'navigateBack') {
            setTimeout(function () {
              if (urlType == 'navigateTo') {
                //保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面。
                wx.navigateTo({
                  url: url
                })
              } else if (urlType == 'redirectTo') {
                //关闭当前页面，跳转到应用内的某个页面。
                wx.redirectTo({
                  url: url
                })
              } else if (urlType == 'switchTab') {
                //跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
                wx.switchTab({
                  url: '/index'
                })
              } else if (urlType == 'navigateBack') {
                //关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages()) 获取当前的页面栈，决定需要返回几层。
                wx.navigateBack({
                  delta: navigateBackDelta
                })
              } else if (urlType == 'reLaunch') {
                //关闭所有页面，打开到应用内的某个页面。
                wx.reLaunch({
                  url: url
                })
              }
              /*
              switch (urlType) {
                case 'navigateTo':
                  //保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面。
                  wx.navigateTo({
                    url: url
                  })
                  break;
                case 'redirectTo':
                  //关闭当前页面，跳转到应用内的某个页面。
                  wx.redirectTo({
                    url: url
                  })
                  break;
                case 'switchTab':
                  //跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
                  wx.switchTab({
                    url: url
                  })
                  break;
                case 'navigateBack':
                  //关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages()) 获取当前的页面栈，决定需要返回几层。
                  wx.navigateBack({
                    delta: navigateBackDelta
                  })
                  break;
                case 'reLaunch':
                  //关闭所有页面，打开到应用内的某个页面。
                  wx.reLaunch({
                    url: url
                  })
                  break;
                default:
                  //关闭当前页面，跳转到应用内的某个页面。
                  wx.redirectTo({
                    url: url
                  })
              }
              */
            }, time)
          }
        }
      },
      fail: function (res) {//接口调用失败的回调函数
        //console.log(res)
      },
      complete: function (res) {//接口调用结束的回调函数（调用成功、失败都会执行）
        //console.log(res)
      }
    })
  },
  error: function (msg, time = 1500, url = '', urlType = 'redirectTo', navigateBackDelta = 1) {
    wx.showToast({
      title: msg,  //提示的内容
      icon: msg.length <= 7 ? '' : 'none',  //图标，有效值 "success", "loading", "none"
      image: msg.length <= 7 ? '/image/error.png' : '',  //自定义图标的本地路径，image 的优先级高于 icon
      duration: time,  //提示的延迟时间，单位毫秒，默认：1500
      mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false
      success: function (res) {//接口调用成功的回调函数
        //console.log(res)
        if (typeof url == 'function') {
          setTimeout(function () {
            url()
          }, time)
        } else {
          if (url != '' || urlType == 'navigateBack') {
            setTimeout(function () {
              if (urlType == 'navigateTo') {
                //保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面。
                wx.navigateTo({
                  url: url
                })
              } else if (urlType == 'redirectTo') {
                //关闭当前页面，跳转到应用内的某个页面。
                wx.redirectTo({
                  url: url
                })
              } else if (urlType == 'switchTab') {
                //跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
                wx.switchTab({
                  url: url
                })
              } else if (urlType == 'navigateBack') {
                //关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages()) 获取当前的页面栈，决定需要返回几层。
                wx.navigateBack({
                  delta: navigateBackDelta
                })
              } else if (urlType == 'reLaunch') {
                //关闭所有页面，打开到应用内的某个页面。
                wx.reLaunch({
                  url: url
                })
              }
            }, time)
          }
        }
      },
      fail: function (res) {//接口调用失败的回调函数
        //console.log(res)
      },
      complete: function (res) {//接口调用结束的回调函数（调用成功、失败都会执行）
        //console.log(res)
      }
    })
  },
  message: function (msg, time = 1500, url = '', urlType = 'redirectTo', navigateBackDelta = 1) {
    wx.showToast({
      title: msg,  //提示的内容
      icon: 'none',  //图标，有效值 "success", "loading", "none"
      duration: time,  //提示的延迟时间，单位毫秒，默认：1500
      mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false
      success: function (res) {//接口调用成功的回调函数
        //console.log(res)
        if (typeof url == 'function') {
          setTimeout(function () {
            url()
          }, time)
        } else {
          if (url != '' || urlType == 'navigateBack') {
            setTimeout(function () {
              if (urlType == 'navigateTo') {
                //保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面。
                wx.navigateTo({
                  url: url
                })
              } else if (urlType == 'redirectTo') {
                //关闭当前页面，跳转到应用内的某个页面。
                wx.redirectTo({
                  url: url
                })
              } else if (urlType == 'switchTab') {
                //跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
                wx.switchTab({
                  url: '/index'
                })
              } else if (urlType == 'navigateBack') {
                //关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages()) 获取当前的页面栈，决定需要返回几层。
                wx.navigateBack({
                  delta: navigateBackDelta
                })
              } else if (urlType == 'reLaunch') {
                //关闭所有页面，打开到应用内的某个页面。
                wx.reLaunch({
                  url: url
                })
              }
            }, time)
          }
        }
      },
      fail: function (res) {//接口调用失败的回调函数
        //console.log(res)
      },
      complete: function (res) {//接口调用结束的回调函数（调用成功、失败都会执行）
        //console.log(res)
      }
    })
  },
  confirm: function (title = '提示', content = '', func_confirm = null, func_cancel = null) {
    wx.showModal({
      title: title,
      content: content,
      success: function (res) {
        if (res.confirm) {
          typeof func_confirm == 'function' && func_confirm()
        } else if (res.cancel) {
          typeof func_cancel == 'function' && func_cancel()
        }
      }
    })
  },
  close: function () {
    wx.hideToast()
  },
  loading: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
  },
  hide: function () {
    wx.hideLoading()
  },
  vibrate: function (types = 'long') {
    if (types == 'long') {
      wx.vibrateLong({
        success: function (res) {
          console.log(res)
        }
      })
    } else {
      wx.vibrateShort({
        success: function (res) {
          console.log(res)
        }
      })
    }
  },
  setBar: function (index, text) {
    wx.setTabBarBadge({
      index: index,
      text: text.toString()
    })
  },
  removeBar: function (index) {
    wx.removeTabBarBadge({
      index: index
    })
  },
  showBar: function (index) {
    wx.showTabBarRedDot({
      index: index
    })
  },
  hideBar: function (index) {
    wx.hideTabBarRedDot({
      index: index
    })
  }
})

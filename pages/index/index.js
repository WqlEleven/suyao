//导入
var util = require('../../utils/util.js')
var update = require('../../utils/update.js')

//获取应用实例
var app = getApp()

//var secondTimer

Page({
  data: {
    title: '',
    user: {},
    userInfo: {},
    shopkeeperInfo: {},
    category_id: 0,
    page: 1,
    pageCount: 0,
    productList: [],
    navItem: [],
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    circular: true,
    openPicker: false,
    needAnimation: false,
    contentHeight: 0,
    curIndex: 0,
    slideHidden: true,          //是否隐藏轮播图
    newOrder: {},//最新订单信息
    newOrder_show: false,
    seckill: false,
    seckillInfo: {},
    seckillGoods: [],
    hour: '',
    minute: '',
    second: '',
    authUserinfo: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function (options) {
    var that = this;
    // Do some initialize when page load.
    //转发参数
    var id = options.id
    console.log('转发者id:' + id)
    if (id !== undefined) {
      wx.setStorageSync('parent_id', id)
    }

    //扫码参数
    var scene = options.scene
    console.log('scene:' + scene)
    if (scene !== undefined) {
      var scene_id = decodeURIComponent(options.scene)
      wx.setStorageSync('parent_id', scene_id)
    }
    
    app.userInfoReadyCallback = res => {
      //app.checkLevel()
      that.getUser()
      this.getShopkeeperInfo(id)
    }
    
    that.getUser()
    this.getShopkeeperInfo(id)

    this.getCategory();
    this.getSlide();
    this.getProductHot();
    this.getProductSeckill();
    this.newOrder();
    this.getUserInfo()
  },
  onReady: function () {
    // Do something when page ready.
    console.log('index onReady')
  },
  onShow: function () {
    // Do something when page show.
    console.log('index onShow')
  },
  onHide: function () {
    // Do something when page hide.
    console.log('index onHide')
  },
  onUnload: function () {
    // Do something when page close.
    console.log('index onUnload')
  },
  onPullDownRefresh: function () {
    // Do something when pull down.
    console.log('index onPullDownRefresh')
    this.setData({
      page: 1,
      pageCount: 0,
      productList: []
    })
    this.getUser()
    this.getShopkeeperInfo()
    this.getCategory()
    this.getSlide()
    if (this.data.category_id == 0) {
      this.getProductHot()
    } else {
      this.getProductList()
    }
    wx.stopPullDownRefresh()
  },
  onReachBottom: function () {
    // Do something when page reach bottom.
    console.log('index onReachBottom')
    var that = this
    var page = parseInt(that.data.page) + 1
    if (page > parseInt(that.data.pageCount)) {
      return
    }
    this.setData({
      page: page
    })
    if (this.data.category_id == 0) {
      this.getProductHot()
    } else {
      this.getProductList()
    }
  },
  onShareAppMessage: function (res) {
    // return custom share data when user share.
    console.log('index onShareAppMessage')
    var that = this
    var user_id = wx.getStorageSync('user_id')
    //console.log(user_id)
    console.log(that.data.shopkeeperInfo)
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
  onPageScroll: function () {
    // Do something when page scroll
    //console.log('index onPageScroll')
  },
  bindGetUserInfo: function (e) {
    console.log(e)
    var that = this
    if (e.detail.errMsg == 'getUserInfo:ok') {
      console.log(e.detail)
      that.setData({
        authUserinfo: true,
        userInfo: e.detail.userInfo
      })
      wx.showTabBar()

      //保存用户信息
      var session_key = wx.getStorageSync('session_key')
      wx.request({
        url: app.globalData.config.host + '/home/user_save',
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
          console.log('bindGetUserInfo user_save success')
          console.log(res.data)
          //that.getUser()
        }
      })
    } else {
      console.log(e.detail.errMsg)
    }
  },
  /**
   * 获取用户信息
   */
  getUserInfo: function () {
    var that = this
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            lang: 'zh_CN',
            success: function (res) {
              console.log(res.userInfo)
              that.setData({
                userInfo: res.userInfo
              })
            }
          })
        } else {
          that.setData({
            authUserinfo: false
          })
          wx.hideTabBar()
        }
      }
    })
  },

  getShopkeeperInfo: function (user_id = null) {
    var that = this
    if (user_id == null || user_id === undefined) {
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.request({
              url: app.globalData.config.host + '/home/login',
              data: {
                code: res.code
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded' //application/json
              },
              method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              success: function (res) {
                //console.log(res.data)
                var session_key = res.data.session_key;
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
              }
            })
          }
        }
      })
    } else {
      wx.request({
        url: app.globalData.config.host + '/home/shopkeeperinfo',
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
            shopkeeperInfo: res.data.info
          })
          if (res.data.info.id) {

          } else {
            app.error('您的推荐人还不是店主！', 1500, '/pages/guest/guest')
          }
        }
      })
    }
  },

  getUser: function () {
    var that = this
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
          user: res.data.info
        })
        wx.setStorageSync('user_id', res.data.info.id)
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

  /**
   * 获取分类
   */
  getCategory: function () {
    var that = this
    wx.request({
      url: app.globalData.config.host + '/home/get_category',
      method: 'post',
      header: { 'Content-Type': 'application/x-www-from-urlencoded' },
      data: { parent_id: 0 },
      success: function (mes) {
        var category = []
        category[0] = { id: 0, name: '热门推荐' }
        for (var i = 0; i < mes.data.length; i++) {
          category[i + 1] = mes.data[i]
        }
        that.setData({
          navItem: category
        })
      }
    })
  },

  /**
   * 获取轮播图
   */
  getSlide: function () {
    var that = this
    wx.request({
      url: app.globalData.config.host + '/home/slide',
      success: function (res) {
        that.setData({
          imgUrls: res.data.list
        })
      }
    })
  },

  //获取秒杀商品
  getProductSeckill: function () {
    var that = this
    app.loading()
    wx.request({
      url: app.globalData.config.host + '/home/product_seckill',
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        app.hide()
        that.setData({
          seckillInfo: res.data.info,
          seckillGoods: res.data.list
        })

        //倒计时
        //var leave = that.data.leave
        var start_time = util.formatTime(new Date())
        var end_time = that.data.seckillInfo.end
        //console.log(start_time)
        //console.log(end_time)
        if (end_time != null) {
          var leave = that.GetDateDiff(start_time, end_time, 'second')

          var time = that.sec_to_time(leave)
          that.setData({
            seckill: true,
            hour: time.hour,
            minute: time.min,
            second: time.sec
          })

          var secondTimer = setInterval(function () {
            leave--
            var time = that.sec_to_time(leave)
            that.setData({
              hour: time.hour,
              minute: time.min,
              second: time.sec
            })
            if (that.data.hour == '00' && that.data.minute == '00' && that.data.second == '00') {
              clearInterval(secondTimer)
              that.getProductSeckill()
            }
          }, 1000)
        } else {
          that.setData({
            seckill: false
          })
        }
      }
    })
  },

  //获取首页热门推荐
  getProductHot: function () {
    var that = this
    var page = that.data.page
    var pageCount = that.data.pageCount
    console.log('page:' + page + ',pageCount:' + pageCount)
    app.loading()
    wx.request({
      url: app.globalData.config.host + '/home/product_hot',
      data: {
        page: page
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        app.hide()
        that.setData({
          page: res.data.page,
          pageCount: res.data.page_count,
          productList: that.data.productList.concat(res.data.list)
        })
      }
    })
  },

  //获取首页产品列表
  getProductList: function () {
    var that = this
    var category_id = that.data.category_id
    var page = that.data.page
    var pageCount = that.data.pageCount
    console.log('category_id:' + category_id + 'page:' + page + ',pageCount:' + pageCount)
    app.loading()
    wx.request({
      url: app.globalData.config.host + '/home/product_index',
      data: {
        category_id: category_id,
        page: page
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        app.hide()
        that.setData({
          page: res.data.page,
          pageCount: res.data.page_count,
          productList: that.data.productList.concat(res.data.list)
        })
      }
    })
  },

  /**
   * 切换分类显示商品
   */
  sletap(e) {
    var index = parseInt(e.currentTarget.id)
    var cateory_id = e.currentTarget.dataset.id
    this.setData({
      curIndex: index,
      category_id: cateory_id,
      page: 1,
      pageCount: 0,
      productList: []
    })

    if (cateory_id != 0) {
      this.getProductList()
      this.setData({
        slideHidden: false
      })
    } else {
      this.getProductHot()
      this.setData({
        slideHidden: true
      })
    }
  },
  getLocation: function () {
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
      }
    })
  },
  chooseLocation: function () {
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
      }
    })
  },
  openLocation: function () {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28
        })
      }
    })
  },
  //拨打电话
  freeConsult: function (e) {
    wx.makePhoneCall({
      phoneNumber: '4007089000'
    })
  },
  scan: function () {
    wx.scanCode({
      onlyFromCamera: true,
      success: function (res) {
        console.log(res)
      }
    })
  },
  bindViewTap: function (e) {

  },
  // 最新订单信息
  newOrder: function () {
    var that = this
    var session_key = wx.getStorageSync('session_key')
    wx.request({
      url: app.globalData.config.host + '/home/new_message',
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
          newOrder: {
            head: res.data.info.avatar,
            user: res.data.info.nickname,
            time: res.data.info.time
          },
          newOrder_show: true
        })
        setTimeout(function () {
          that.setData({
            newOrder_show: false
          })
        }, 10000)
      }
    })
  },
  GetDateDiff: function (startTime, endTime, diffType) {
    //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式 
    startTime = startTime.replace(/\-/g, "/");
    endTime = endTime.replace(/\-/g, "/");
    //将计算间隔类性字符转换为小写
    diffType = diffType.toLowerCase();
    var sTime = new Date(startTime); //开始时间
    var eTime = new Date(endTime); //结束时间
    //作为除数的数字
    var timeType = 1;
    switch (diffType) {
      case "second":
        timeType = 1000;
        break;
      case "minute":
        timeType = 1000 * 60;
        break;
      case "hour":
        timeType = 1000 * 3600;
        break;
      case "day":
        timeType = 1000 * 3600 * 24;
        break;
      default:
        break;
    }
    return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(timeType));
  },
  // 秒转换时分秒
  sec_to_time: function (s) {
    var hour, min, sec;
    if (s > 0) {
      var hour = Math.floor(s / 3600);
      var min = Math.floor(s / 60) % 60;
      var sec = s % 60;
      if (hour < 10) {
        hour = '0' + hour;
      } else {
        hour = hour + ":";
      }

      if (min < 10) {
        min = "0" + min;
      } else {
        min = min;
      }

      if (sec < 10) {
        sec = "0" + sec;
      } else {
        sec = sec;
      }
    } else {
      var hour = '00';
      var min = '00';
      var sec = '00';
    }
    return { hour: hour, min: min, sec: sec };
  }
})
//导入WxParse
var WxParse = require('../../wxParse/wxParse.js')

//获取应用实例
var app = getApp()

Page({
  data: {
    id: 0,
    sid: 0,
    pid: 0,
    parent: {},
    scene: '',
    scene_id: '',
    split_sid: '',
    split_pid: '',
    goods: {},
    userInfo: {},
    shopkeeperInfo: {},
    indicatorDots: true,//是否显示面板指示点
    duration: 1000,  //滑动时间
    circular: true,
    buyCount: 0,
    num: 1,
    pruTap: 0,
    showSpecy: true,
    regular: "数量：1，" + '选择规格...',
    current: 0,
    currentIndex: 0,
    shareBtn: false,
    isgoods: 0,
    material: []
  },
  onLoad: function (options) {
    var that = this

    //转发参数
    var id = options.id
    var parent_id = options.parent_id
    console.log('id:' + id + ',parent_id:' + parent_id)
    if (id !== undefined) {
      this.setData({
        id: id,
        sid: id
      })
    }
    if (parent_id !== undefined) {
      this.setData({
        pid: parent_id
      })
      wx.setStorageSync('parent_id', parent_id)
      that.getParentInfo(parent_id)
      that.getUserInfo()
    }

    //扫码参数
    var scene = options.scene
    console.log('scene:' + scene)
    if (scene !== undefined) {
      var scene_id = decodeURIComponent(options.scene)
      console.log('scene_id:' + scene_id)
      this.setData({
        scene: scene,
        scene_id: scene_id
      })
      var params = scene_id.split(',')
      var sid = params[0]
      var pid = params[1]
      this.setData({
        split_sid: sid,
        split_pid: pid
      })
      if (sid) {
        id = sid
        this.setData({
          id: sid,
          sid: sid
        })
      }
      if (pid) {
        this.setData({
          pid: pid
        })
        wx.setStorageSync('parent_id', pid)
        that.getParentInfo(pid);
      }
    }

    //验证登录
    app.checkLogin()

    //获取session_key
    var session_key = wx.getStorageSync('session_key')

    this.getUserInfo()
    //获取产品详情
    this.getProductDetail(id)

    this.getProductMatter(id)
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  onShareAppMessage: function (res) {
    // return custom share data when user share.
    console.log('goodsdetail onShareAppMessage')
    var that = this
    var user_id = wx.getStorageSync('user_id')
    //console.log(user_id)
    //console.log(that.data.shopkeeperInfo)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: that.data.shopkeeperInfo.nickname + '的店铺',
      path: '/pages/recipegoodsDetail/recipegoodsDetail?id=' + that.data.goods.id + '&parent_id=' + that.data.shopkeeperInfo.id,
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

  getUserInfo: function (user_id = null) {
    var that = this
    if (user_id == null) {
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
                console.log(res.data)
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
        }
      })
    }
  },
  getParentInfo: function (user_id) {
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
          parent: res.data.info
        })
        wx.setNavigationBarTitle({
          title: res.data.info.nickname + '的店铺 - 商品详情'
        })
      }
    })
  },
  getUserInfo: function () {
    var that = this
    var user_id = wx.getStorageSync('user_id')
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
          userInfo: res.data.info
        })
      }
    })
  },
  getProductDetail: function (id) {
    var that = this
    wx.request({
      url: app.globalData.config.host + '/home/product_detail',
      data: {
        id: id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log(res.data)
        that.setData({
          goods: res.data.info,
          current: res.data.info.id,
          regular: "数量：" + that.data.num + "，" + "规格：" + res.data.info.model
        })
        WxParse.wxParse('introduction', 'html', res.data.info.introduction, that)
        WxParse.wxParse('manual', 'html', res.data.info.manual, that)
      }
    })
  },

  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      pruTap: index
    })
  },

  buyNow: function (e) {
    var id = this.data.goods.id;    // 产品ID
    var num = this.data.num;
    if (this.data.goods.stock >= num) {
      wx.navigateTo({
        url: '/pages/recipesubmitOrder/recipesubmitOrder?id=' + this.data.current + '&num=' + num + '&type=0'
      })
    } else {
      app.error('库存不足！')
    }
  },

  add: function () {
    let num = this.data.num;
    num++;
    this.setData({
      num: num
    })
  },

  reduce() {
    let num = this.data.num;
    num--;
    this.setData({
      num: num
    })
  },
  selectspecy() {
    this.setData({
      showSpecy: false
    })
  },
  close(e) {
    let num = this.data.num;
    var id = this.data.currentIndex;
    let model = this.data.goods.models[id].model;
    this.setData({
      showSpecy: true,
      regular: "数量：" + num + "，" + "规格：" + model
    })
  },
  sltSpe(e) {
    console.log(e);
    this.setData({
      current: e.currentTarget.id,
      currentIndex: e.currentTarget.dataset.index
    });
    this.getProductDetail(this.data.current)
  },

  /**
   *  加入购物车
   */
  addcars() {
    if (this.data.goods.stock >= this.data.num) {
      app.loading()
      app.checkLogin()
      var session_key = wx.getStorageSync('session_key')
      let num = this.data.num
      var id = this.data.currentIndex
      var that = this
      wx.request({
        url: app.globalData.config.host + '/home/recipe_cart_add',
        data: {
          'session_key': session_key,
          'product_id': this.data.current,
          'num': this.data.num
        },
        method: 'post',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        success: function (mes) {
          app.hide()
          if (!mes.data.errCode) {
            that.setData({ showSpecy: true });
            app.success(mes.data.msg)
          } else {
            app.error(mes.data.msg)
          }
        }
      })
    } else {
      app.error('库存不足！')
    }
  },

  car(e) {
    var id = this.data.goods.id;
    var num = this.data.num;
    wx.navigateTo({
      url: '/pages/recipecar/recipecar'
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
  savePageCode: function () {
    var id = this.data.id
    wx.navigateTo({
      url: '/pages/savePageCode/savePageCode?id=' + id
    })
  },
  saveCode: function () {
    var id = this.data.id
    wx.navigateTo({
      url: '/pages/saveCode/saveCode?id=' + id
    })
  },
  tabclick: function (e) {
    console.log(e);
    var that = this;
    var index = e.currentTarget.dataset.index;
    that.setData({
      isgoods: index
    })
    console.log(that.data.isgoods);
  },
  getProductMatter: function (id) {
    var that = this
    app.loading()
    var session_key = wx.getStorageSync('session_key')
    wx.request({
      url: app.globalData.config.host + '/home/product_matter',
      data: {
        session_key: session_key,
        product_id: id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log(res.data)
        app.hide()
        if (res.data.code == 0) {
          that.setData({
            material: res.data.data.list
          })
        } else {
          app.error(res.data.message)
        }
      }
    })
  },
  saveImageTap: function (e) {
    var images = e.currentTarget.dataset.images
    console.log(images)
    for (var i = 0; i < images.length; ++i) {
      wx.downloadFile({
        url: images[i],
        success: function (res) {
          var filePath = res.tempFilePath
          wx.saveImageToPhotosAlbum({
            filePath: filePath,
            success(res) {
              app.error('保存成功！')
            },
            fail(res) {
              app.error('保存失败！')
            }
          })
        },
        fail: function (res) {
          console.log(res)
          app.error(res.errMsg)
        }
      })
    }
  },
  copyContentTap: function (e) {
    var data = e.currentTarget.dataset.data
    wx.setClipboardData({
      data: data,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data)
          }
        })
      }
    })
  },
  clickImage: function (e) {
    var that = this
    var current = e.target.dataset.src
    var index = e.target.dataset.index
    wx.previewImage({
      current: current,
      urls: that.data.material[index].images
    })
  }
})
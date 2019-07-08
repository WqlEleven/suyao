//获取应用实例
var app = getApp()

Page({
  data: {
    allGoods: {},
    sumPrice: 0,
    address: {},
    goods: {},
    parent_id: 0,
    id: 0,
    num: 1,
    money: 0,
    freight: 0,
    discount: 0,
    total: 0,
    goodsNum: 0,
    cartId: '',
    currencyIndex: 0,
    currencyValue: 0,
    currency: [],
    couponIndex: 0,
    couponValue: 0,
    couponId: 0,
    coupon: [],
    addressId: 0,
    chooseImageFlage: true,
    distribution: 0,
    imageList: '',
    picture: '',
    count: 1,
    isImageList: false,
    store_id: 0,
    sitelist: []
  },
  onLoad: function (options) {
    var that = this
    //wx.setStorageSync('addressId', 0)    //默认收货地址ID置空
    this.getUserCurrency()
    this.getUserCoupon()
    var addressId = options.addressId
    if (addressId !== undefined) {
      that.setData({
        addressId: addressId
      })
    }
    var parent_id = wx.getStorageSync('parent_id')
    that.setData({
      goods: {},
      parent_id: parent_id
    })
    var id = options.id;
    if (options.type == 'cart') {       //判断是从购物车跳转过来的
      this.getSubmitCart(id)
      this.setData({
        cartId: '[' + id + ']'
      })
    } else {                            //正常流程购买
      var num = options.num;
      this.getProductDetail(id, num);
    }
    wx.setStorageSync('urlId', options.id);
    wx.setStorageSync('urlNum', options.num);
    wx.setStorageSync('urlType', options.type);
    //app.checkLogin()
    this.getStoreList()
  },

  onShow: function () {
    // var addressId = wx.getStorageSync('addressId')
    if (!this.data.addressId) {
      this.data.addressId = 0
    }
    this.getAddress(this.data.addressId)
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  getAddress: function (addressId = 0) {
    var that = this
    //app.checkLogin()
    var session_key = wx.getStorageSync('session_key')
    wx.request({
      url: app.globalData.config.host + '/home/address',
      data: {
        session_key: session_key,
        id: addressId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        that.setData({
          address: res.data.info
        })
        wx.setStorageSync('addressId', res.data.info.id)
        //that.getFreight()
      }
    })
  },

  getProductDetail: function (id, num) {
    var that = this
    app.loading()
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
        app.hide()
        var goods = []
        goods[0] = res.data.info
        goods[0].num = num
        that.setData({
          goods: goods
        })
        //that.getFreight()
      },
      complete: function () {
        that.countPrice()
      }
    })
  },

  getUserCurrency: function () {
    var that = this
    app.loading()
    //app.checkLogin()
    var session_key = wx.getStorageSync('session_key')
    wx.request({
      url: app.globalData.config.host + '/home/user_currency',
      data: {
        session_key: session_key
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log(res.data)
        app.hide()
        that.setData({
          currency: res.data.currency
        })
      }
    })
  },

  getUserCoupon: function () {
    var that = this
    var couponInit = [{ id: 0, name: '无', names: '无', money: 0 }]
    app.loading()
    //app.checkLogin()
    var session_key = wx.getStorageSync('session_key')
    wx.request({
      url: app.globalData.config.host + '/home/user_coupon',
      data: {
        session_key: session_key
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log(res.data)
        app.hide()
        that.setData({
          coupon: couponInit.concat(res.data.list)
        })
      }
    })
  },

  /**
   * 获取购物车提交过来的信息
   */
  getSubmitCart: function (cartId) {
    var that = this
    app.loading()
    wx.request({
      url: app.globalData.config.host + '/home/recipe_cart_submit',
      data: {
        cart_id: '[' + cartId + ']',
        imgPath: app.globalData.config.sinaHost + '/product/'
      },
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (mes) {
        app.hide()
        that.setData({
          goods: mes.data
        })
        //that.getFreight()
      },
      complete: function () {
        that.countPrice()
      }
    })
  },

  /**
   * 计算商品总价
   */
  countPrice: function () {
    var goods = this.data.goods
    var goodsNum = 0              //商品个数
    var totalPrice = 0            //商品总价
    var favorablePrice = 0        //优惠价格
    var freight = this.data.freight
    for (var i = 0; i < goods.length; i++) {
      goodsNum += parseInt(goods[i].num)
      totalPrice += parseFloat(goods[i].price) * parseInt(goods[i].num)
    }
    favorablePrice = parseFloat(this.data.currencyValue) + parseFloat(this.data.couponValue)
    this.setData({
      goodsNum: goodsNum,
      money: totalPrice,
      discount: favorablePrice,
      total: parseFloat(totalPrice) + parseFloat(freight) - favorablePrice
    })
  },

  toAddress: function () {
    wx.navigateTo({ url: '/pages/addressManage/addressManage' })
  },

  wxAddress: function () {
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.address']) {
          wx.authorize({
            scope: 'scope.address',
            success() {
              wx.chooseAddress({
                success: function (res) {
                  console.log('name======' + res.userName)
                  console.log(res.postalCode)
                  console.log(res.provinceName)
                  console.log(res.cityName)
                  console.log(res.countyName)
                  console.log(res.detailInfo)
                  console.log(res.nationalCode)
                  console.log(res.telNumber)
                },
                fail: function (res) {
                  console.log(res)
                }
              })
            },
            fail: function (res) {
              console.log(res)
            }
          })
        }
      }
    })
  },

  settlement: function () {
    var that = this

    //app.checkLogin()
    app.loading()
    if (that.data.address.id) {

    } else {
      app.error('请选择地址！')
      return;
    }
    if (that.data.distribution == 0) {
      app.error('请选择配送方式！')
      return;
    }
    if (that.data.distribution == 2 && that.data.store_id == 0) {
      app.error('请选择门店！')
      return;
    }
    var session_key = wx.getStorageSync('session_key')
    var orderGoods = this.getOrderGoods()
    wx.request({
      url: app.globalData.config.host + '/home/recipe_order',
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        cartId: that.getCartId(),            //购物车ID
        session_key: session_key,           //用户信息
        parent_id: that.data.parent_id,     //父级ID
        address_id: that.data.address.id,   //收货地址ID
        detail: orderGoods,                 //商品信息
        money: that.data.money,             //商品总价
        discount: that.data.discount,       //优惠
        currency: that.data.currencyValue,  //健康币
        user_coupon_id: that.data.couponId, //优惠券
        total: that.data.total,              //优惠后的总价
        message: '',                         //留言
        remark: '',                           //备注
        deliver_type: that.data.distribution,
        store_id: that.data.store_id,
        picture: that.data.picture
      },
      success: function (res) {
        app.hide()
        if (!res.data.errCode) {
          wx.redirectTo({ url: '/pages/recipepay/recipepay?id=' + res.data.order_id })
        } else {
          app.error(res.data.msg, 2000)
        }
      }
    })

  },

  /**
   * 获取订单商品详情
   */
  getOrderGoods: function () {
    var goods = this.data.goods
    var orderGoods = []
    for (var i = 0; i < goods.length; i++) {
      orderGoods[i] = {
        id: goods[i].id,
        num: goods[i].num,
        price: goods[i].price
      }
    }
    return JSON.stringify(orderGoods)
  },

  /**
   * 获取购物车ID
   */
  getCartId: function () {
    if (this.data.cartId) {
      return this.data.cartId
    } else {
      return 0
    }
  },
  bindPickerChange: function (e) {
    var that = this
    var index = e.detail.value
    var value = this.data.currency[index]
    console.log('index:' + index + ',value:' + value)
    if (this.data.money > parseFloat(this.data.couponValue) + parseFloat(value)) {
      this.setData({
        currencyIndex: index,
        currencyValue: value
      })
      this.countPrice()
    } else {
      app.error('订单金额小于健康币数量，无法使用！')
    }
  },
  bindPickerChangeCoupon: function (e) {
    var that = this
    var index = e.detail.value
    var id = this.data.coupon[index].id
    var name = this.data.coupon[index].name
    var value = this.data.coupon[index].money
    console.log('index:' + index + ',id:' + id + ',name:' + name + ',value:' + value)
    if (this.data.money > parseFloat(this.data.currencyValue) + parseFloat(value)) {
      this.setData({
        couponIndex: index,
        couponValue: value,
        couponId: id
      })
      this.countPrice()
    } else {
      app.error('订单金额小于优惠券金额，无法使用！')
    }
  },
  getFreight: function () {
    var that = this
    app.loading()
    //app.checkLogin()
    var session_key = wx.getStorageSync('session_key')
    var orderGoods = this.getOrderGoods()
    wx.request({
      url: app.globalData.config.host + '/home/freight',
      data: {
        session_key: session_key,
        detail: orderGoods,
        address_id: that.data.address.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log(res.data)
        app.hide()
        that.setData({
          freight: res.data.freight
        })
        that.countPrice()
      }
    })
  },
  /**
   *  图片上传
   */
  chooseImage: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths[0]
        console.log(tempFilePaths)

        var filePath = tempFilePaths
        //console.log(filePath)
        that.setData({
          imageList: tempFilePaths,
          isImageList: true
        })
        wx.uploadFile({
          url: app.globalData.config.host + '/home/upload',
          filePath: filePath,
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function (res) {
            console.log(res)
            app.hide()
            if (res.statusCode == 200) {
              var data = JSON.parse(res.data)
              //console.log(data)
              if (data.code == 0) {
                var picture = data.data.file_name
                that.setData({
                  picture: picture
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
  choosedistribution: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    that.setData({
      distribution: index
    })
    if (index == 2) {
      that.setData({
        freight: 0
      })
      that.countPrice()
    } else {
      that.getFreight()
    }
  },
  clicksitelist: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var id = e.currentTarget.id
    var sitelist = that.data.sitelist
    for (var i = 0; i < sitelist.length; i++) {
      sitelist[i].isCheck = false
    }
    sitelist[index].isCheck = true
    that.setData({
      sitelist: sitelist,
      store_id: id
    })
  },
  getStoreList: function () {
    var that = this
    app.loading()
    //app.checkLogin()
    var session_key = wx.getStorageSync('session_key')
    wx.request({
      url: app.globalData.config.host + '/home/store_list',
      data: {
        session_key: session_key
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log(res.data)
        app.hide()
        that.setData({
          sitelist: res.data.list
        })
      }
    })
  }
})

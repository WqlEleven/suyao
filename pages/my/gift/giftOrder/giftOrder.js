//获取应用实例
var app = getApp()

Page({
  data: {
    allGoods: {},
    sumPrice: 0,
    address: {},
    parent_id: 0,
    goods: {},
    id: 0,
    num: 1,
    money: 0,
    discount: 0,
    total: 0,
    goodsNum: 0,
    cartId: ''
  },
  onLoad: function (options) {
    var parent_id = wx.getStorageSync('parent_id')
    if (parent_id !== undefined) {
      this.setData({
        parent_id: parent_id
      })
    } else {
      app.error('没有邀请人，无法购买！')
    }
    var id = options.id;
    this.getPackageDetail(id);
  },

  onShow: function () {
    var addressId = wx.getStorageSync('addressId')
    if (!addressId) {
      addressId = 0
    }
    this.getAddress(addressId)
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  getAddress: function (addressId = 0) {
    var that = this
    app.checkLogin()
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
      }
    })
  },

  getPackageDetail: function (id) {
    var that = this
    app.loading()
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
        app.hide()
        that.setData({
          goods: res.data.info
        })
      },
      complete: function () {
        that.countPrice()
      }
    })
  },

  //计算商品总价
  countPrice: function () {
    var goods = this.data.goods
    var goodsNum = 1                  //商品个数
    var totalPrice = goods.price * 1  //商品总价
    var favorablePrice = 0            //优惠价格
    this.setData({
      goodsNum: goodsNum,
      money: totalPrice,
      total: totalPrice - favorablePrice
    })
  },

  toAddress: function () {
    wx.navigateTo({ url: '/pages/addressManage/addressManage' })
  },

  settlement: function () {
    app.checkLogin()
    app.loading()
    var that = this
    if (that.data.address.id) {
      if (that.data.parent_id > 0) {
        var session_key = wx.getStorageSync('session_key')
        wx.request({
          url: app.globalData.config.host + '/home/package_order',
          method: 'post',
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          data: {
            session_key: session_key,
            parent_id: that.data.parent_id,
            address_id: that.data.address.id,
            package_id: that.data.goods.id,
            message: ''
          },
          success: function (res) {
            app.hide()
            if (res.data.status == 0) {
              wx.redirectTo({ url: '/pages/my/gift/giftPay/giftPay?id=' + res.data.order_id })
            } else {
              app.error(res.data.message, 2000)
            }
          }
        })
      } else {
        app.error('无推荐人，无法购买！')
      }
    } else {
      app.error('请选择地址！')
    }
  }

})

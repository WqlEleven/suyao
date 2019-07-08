//获取应用实例
var app = getApp()

Page({
  data: {
    order: {},
    address: {},
    goodsNum: 0
  },

  onLoad: function (e) {
    this.getOrderDetail(e.id)
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  /**
   * 获取订单详情
   */
  getOrderDetail: function (id) {
    var that = this
    app.loading()
    app.checkLogin()
    wx.request({
      url: app.globalData.config.host + '/home/order_details',
      method: 'post',
      data: {
        session_key: wx.getStorageSync('session_key'),
        id: id
      },
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success: function (mes) {
        app.hide()
        that.setData({
          order: mes.data.order,
          address: mes.data.address
        })
      },
      complete: function () {
        that.getGoodsNum()
      }
    })
  },

  /**
   * 获取商品总数
   */
  getGoodsNum: function () {
    var goods = this.data.order.goods_list
    var goodsNum = 0
    for (var i = 0; i < goods.length; i++) {
      goodsNum += parseInt(goods[i].num)
    }
    this.setData({
      goodsNum: goodsNum
    })
  },

  /**
   * 跳转支付页面
   */
  goToPay: function (e) {
    var id = e.currentTarget.id
    wx.redirectTo({
      url: '/pages/pay/pay?id=' + id,
    })
  },

  /**
   * 取消/删除订单
   */
  orderDel: function (e) {
    var that = this
    var id = e.currentTarget.id
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          that.confirmCancelOrder(id)
        }
      }
    })
  },
  confirmCancelOrder: function (id) {
    app.loading()
    app.checkLogin()
    wx.request({
      url: app.globalData.config.host + '/home/order_del',
      method: 'post',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        id: id,
        session_key: wx.getStorageSync('session_key')
      },
      success: function (mes) {
        if (!mes.data.errCode) {
          app.success('取消成功', 1500, '/pages/my/order/order?type=null')
        } else {
          app.error(mes.data.msg, 1500)
        }
      }
    })
  },

  /**
   * 申请退货
   */
  returnGoods: function () {

  },

  /**
   * 确认收货
   */
  receiptGoods: function (e) {
    var that = this
    var id = e.currentTarget.id
    wx.showModal({
      title: '提示',
      content: '确定收货吗？',
      success: function (res) {
        if (res.confirm) {
          that.confirmReceiptGoods(id)
        }
      }
    })
  },
  confirmReceiptGoods: function (id) {
    app.loading()
    app.checkLogin()
    var that = this
    wx.request({
      url: app.globalData.config.host + '/home/order_receipt',
      method: 'post',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        session_key: wx.getStorageSync('session_key'),
        id: id
      },
      success: function (mes) {
        if (!mes.data.errCode) {
          app.success(mes.data.msg, 1500)
          setTimeout(function () {
            that.getOrderDetail(id)
          }, 1000)
        } else {
          app.error(mes.data.msg, 1500)
        }
      }
    })
  }


})
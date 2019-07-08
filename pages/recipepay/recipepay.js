//获取应用实例
var app = getApp()

Page({
  data: {
    jsApiParameters: {},
    address: {},
    order: {},
    goodsNum: 0
  },

  onLoad: function (e) {
    app.loading()
    app.checkLogin()
    var that = this
    var id = e.id
    var repay = 0;
    if (e.repay !== undefined) {
      repay = e.repay
    }
    wx.request({
      url: app.globalData.config.host + '/home/order_detail',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'post',
      data: {
        id: id,
        repay: repay,
        session_key: wx.getStorageSync('session_key')
      },
      success: function (mes) {
        console.log(mes)
        app.hide()
        if (!mes.data.error) {
          that.setData({
            jsApiParameters: mes.data.jsApiParameters,
            order: mes.data.order,
            address: mes.data.address
          })
        } else {
          app.error(mes.data.error)
        }
      },
      complete: function () {
        that.getGoodsNum()
      }
    })
    var _this = this;
    var orderId = wx.getStorageSync('orderId') || '';//订单编号
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  pay: function () {
    var that = this
    wx.requestPayment({
      timeStamp: that.data.jsApiParameters.timeStamp,
      nonceStr: that.data.jsApiParameters.nonceStr,
      package: that.data.jsApiParameters.package,
      signType: that.data.jsApiParameters.signType,
      paySign: that.data.jsApiParameters.paySign,
      success: function (mes) {
        console.log(mes)
        if (mes.errMsg == "requestPayment:ok") {
          app.success('支付成功', 1500, '/pages/my/order/order?type=2')
        }
      },
      fail: function (mes) {
        if (mes.errMsg == "requestPayment:fail") {
          app.error('支付已取消', 1500, '/pages/my/order/order?type=0')
        } else {
          app.error('支付失败！', 1500, '/pages/my/order/order?type=0')
        }
      }
    })
  },

  getGoodsNum: function () {
    var goodsList = this.data.order.goods_list
    var goodsNum = 0
    for (var i = 0; i < goodsList.length; i++) {
      goodsNum += parseInt(goodsList[i].num)
    }
    this.setData({
      goodsNum: goodsNum
    })
  }
})

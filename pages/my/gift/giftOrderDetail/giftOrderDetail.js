//获取应用实例
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {},
    address: {},
    goodsNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderDetail(options.id)
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
  /**
    * 获取订单详情
    */
  getOrderDetail: function (id) {
    var that = this
    app.loading()
    app.checkLogin()
    wx.request({
      url: app.globalData.config.host + '/home/package_order_details',
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
      url: '/pages/my/gift/giftPay/giftPay?id=' + id,
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
      url: app.globalData.config.host + '/home/package_order_del',
      method: 'post',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        id: id,
        session_key: wx.getStorageSync('session_key')
      },
      success: function (mes) {
        if (!mes.data.errCode) {
          app.success('取消成功', 1500, '/pages/my/gift/giftOrder/giftOrder?type=null')
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
      url: app.globalData.config.host + '/home/package_order_receipt',
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
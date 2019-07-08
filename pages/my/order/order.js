//获取应用实例
var app = getApp();

Page({
  data: {
    activeIndex: 0,//默认选中第一个
    list: [   //tab切换分类列表
      {
        id: null,
        listTit: '全部订单',
      },
      {
        id: 0,
        listTit: '待付款',
      },
      {
        id: 2,
        listTit: '待发货',
      },
      {
        id: 3,
        listTit: '待收货',
      },
      {
        id: 4,
        listTit: '已完成',
      }
    ],
    orderList: [],
    emptyOrder: false
  },
  onLoad: function (options) {
    var id = options.type
    if (id !== undefined) {
      this.setData({
        activeIndex: id
      })
      this.getOrderList(id)
    } else {
      this.getOrderList(0)
    }
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  /**
   * 获取订单列表信息
   */
  getOrderList: function (status = null) {
    this.setData({ orderList: [] })  //置空订单列表数据
    app.loading()
    app.checkLogin()
    var that = this
    wx.request({
      url: app.globalData.config.host + '/home/order_list',
      method: 'post',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        session_key: wx.getStorageSync('session_key'),
        status: status
      },
      success: function (mes) {
        app.hide()
        if (mes.data.length) {
          that.setData({
            orderList: mes.data,
            emptyOrder: true
          })
        } else {
          that.setData({ emptyOrder: false })
        }
      }
    })
  },

  tabClick: function (e) {
    var _this = this
    /** 切换tab样式 */
    var id = e.currentTarget.id
    this.setData({ activeIndex: id })
    /** 获取指定状态的订单列表 */
    var status = e.currentTarget.dataset.id
    this.getOrderList(status)
  },

  /**
   * 查看订单
   */
  showOrder: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/my/orderDetail/orderDetail?id=' + id
    })
  },

  /**
   * 删除订单
   */
  cancelOrder: function (e) {
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
    var that = this
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
          app.success(mes.data.msg)
          that.getOrderList(that.data.activeIndex)
        } else {
          app.error(mes.data.msg, 1500)
        }
      }
    })
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
          that.getOrderList(4)
          that.setData({ activeIndex: 4 })
        } else {
          app.error(mes.data.msg, 1500)
        }
      }
    })
  },

  /**
   * 付款
   */
  goToPay: function (e) {
    var id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/pay/pay?id=' + id + '&repay=1'
    })
  },
  home: function () {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  selection: function () {
    wx.switchTab({
      url: '/pages/selection/selection'
    })
  },
  car: function () {
    wx.switchTab({
      url: '/pages/car/car'
    })
  },
  my: function () {
    wx.switchTab({
      url: '/pages/my/my'
    })
  },
  //查看物流
  showLogistics : function(e){
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/my/logistics/logistics?id=' + id
    })
  }
})

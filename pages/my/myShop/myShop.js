//获取应用实例
var app = getApp()

Page({
  data: {
    userInfo: {},
    shoptype: '速药旗舰店',
    goodsList: [],
    page: 0
  },
  onLoad: function () {
    var that = this;
    this.setData({
      shopholder: false
    })
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            lang: 'zh_CN',
            success: function (res) {
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

  onShow: function () {
    this.getGoods()
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  /**
   * 获取店铺精选商品数据
   */
  getGoods: function () {
    app.loading()
    app.checkLogin()
    var that = this
    wx.request({
      url: app.globalData.config.host + '/home/shelf_management',
      method: 'post',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        session_key: wx.getStorageSync('session_key')
      },
      success: function (mes) {
        app.hide()
        that.setData({
          goodsList: mes.data.product,
          page: mes.data.page
        })
      }
    })
  },

  /**
   * 触发分页
   */


  /**
   * 设为精选/取消精选
   */
  setChoice: function (e) {
    app.checkLogin()
    app.loading()
    var that = this
    var status = parseInt(e.currentTarget.dataset.datas.status)       //判断商品是否已下架
    var goodsId = e.currentTarget.dataset.datas.id                    //商品ID
    var is_choice = e.currentTarget.dataset.datas.is_choice           //是否精选
    if (is_choice == 1) {
      is_choice = 0;
    } else {
      is_choice = 1;
    }
    if (!status) {
      wx.request({
        url: app.globalData.config.host + '/home/set_choice',
        method: 'post',
        header: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: {
          session_key: wx.getStorageSync('session_key'),
          is_choice: is_choice,
          product_id: goodsId
        },
        success: function (mes) {
          if (mes.data.errCode) {
            app.error(mes.data.msg, 1500)
          } else {
            app.success(mes.data.msg, 1500)
            if (mes.data.type == 'insert') {
              that.setGoodsParameter(goodsId, is_choice, true)
            } else {
              that.setGoodsParameter(goodsId, is_choice)
            }
          }
        }
      })
    }
  },

  /**
   * 设置精选时更改商品参数
   */
  setGoodsParameter: function ($goodsId = 0, is_choice, oper) {
    var goods = this.data.goodsList
    for (var i = 0; i < goods.length; i++) {
      if (goods[i].id == $goodsId) {
        if (oper) {
          goods[i].sale_num = goods[i].sale_num + 1
        }
        goods[i].is_choice = is_choice
      }
    }
    this.setData({ goodsList: goods })
  },
  shareTap: function (e) {
    console.log(e)
    var id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?id=' + id
    })
  },
  choiceTap: function () {
    wx.navigateTo({
      url: '/pages/my/fenleiChoice/fenleiChoice'
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
  }
})
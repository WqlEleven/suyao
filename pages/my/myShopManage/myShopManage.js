//获取应用实例
var app = getApp()

Page({
  data: {
    user: {},
    list: [   //tab切换分类列表
      {
        id: 'sort',
        listTit: '默认',
      },
      {
        id: 'money_1',
        listTit: '利润',
      },
      {
        id: 'price',
        listTit: '价格',
      }
    ],
    activeIndex: 0,         //默认选中第一个
    search: false,          //是否显示热搜界面
    focus: false,
    order_by: false,
    keywords: '',
    popSearch: [],          //热搜词汇
    cid: '',
    page: 1,
    pageCount: 0,
    goodsList: [],
    Package: 2,
    cart_num: 0
  },

  onLoad: function (e) {
    if (e.cid) {            //商品分类ID
      var cid = e.cid
      this.setData({
        cid: e.cid,
        search: false
      })
    } else {
      var cid = ''
      this.setData({
        search: true,
        focus: true
      })
    }

    if (e.keywords) {       //关键字
      var keywords = e.keywords
      this.setData({
        keywords: keywords,
        search: true
      })
    } else {
      var keywords = ''
    }

    this.getGoodsList(cid, '', keywords)
  },

  onShow: function () {
    this.getUser()
  },

  /**
   * 页面卸载
   */
  onUnload: function () {
    this.setData({ cid: '' })
  },

  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      pageCount: 0,
      productList: []
    })
    var cid = this.data.cid
    var keywords = this.data.keywords
    this.getGoodsList(cid, '', keywords)
    wx.stopPullDownRefresh()
  },

  onReachBottom: function () {
    console.log('index onReachBottom')
    var that = this
    var page = parseInt(that.data.page) + 1
    if (page > parseInt(that.data.pageCount)) {
      return
    }
    this.setData({
      page: page
    })
    var cid = this.data.cid
    var keywords = this.data.keywords
    this.getGoodsList(cid, '', keywords)
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
      }
    })
  },

  /**
   * 获取商品列表
   */
  getGoodsList: function (cid = '', sort = '', keywords = '') {
    var that = this
    var page = that.data.page
    var pageCount = that.data.pageCount
    console.log('page:' + page + ',pageCount:' + pageCount)
    app.loading()
    app.checkLogin()

    this.setData({ search: false })
    wx.request({
      url: app.globalData.config.host + '/home/product_list',
      method: 'post',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        session_key: wx.getStorageSync('session_key'),
        cid: cid,
        sort: sort,
        order_by: that.data.order_by,     //正反序
        keywords: keywords,
        Type: 'choice',
        page: page
      },
      success: function (mes) {
        console.log(mes.data)
        app.hide()
        that.setData({
          cart_num: mes.data.cart_num,
          page: mes.data.page,
          pageCount: mes.data.page_count,
          goodsList: that.data.goodsList.concat(mes.data.list)
        })
      }
    })
  },

  /**
   * 获取热搜词汇
   */
  getSearch: function () {
    var that = this
    wx.request({
      url: app.globalData.config.host + '/home/get_search_log',
      success: function (mes) {
        that.setData({
          popSearch: mes.data
        })
      }
    })
  },

  /**
   * 点击搜索关键词汇
   */
  keywordsName: function (e) {
    var name = e.currentTarget.dataset.name
    this.getGoodsList('', '', name)
    this.setData({
      search: false,
      goodsList: [],
      cid: '',
      keywords: name
    })
  },

  /**
   * 排序切换
   */
  tabClick: function (e) {
    var id = e.currentTarget.id
    var cid = this.data.cid
    var order_by = this.data.order_by
    this.setData({
      activeIndex: id,
      order_by: !order_by
    })
    var sort = e.currentTarget.dataset.id
    var keywords = this.data.keywords
    this.getGoodsList(cid, sort, keywords)
  },

  /**
   * 显示搜索
   */
  showSearch: function () {
    this.getSearch()
    this.setData({
      search: true,
      keywords: ''
    })
  },

  /**
   * 搜索
   */
  search: function (e) {
    var keywords = this.data.keywords
    this.setData({
      search: false,
      goodsList: [],
      cid: '',
      keywords: keywords
    })
    this.getGoodsList('', '', keywords)
  },

  /**
   * 设置输入的内容
   */
  bindKeywordInput: function (e) {
    this.setData({
      keywords: e.detail.value
    })
  },

  /**
   * 设置/取消精选
   */
  Selected: function (e) {
    app.loading()
    app.checkLogin()
    var that = this
    var goodsId = e.currentTarget.dataset.id
    var is_choice = e.currentTarget.dataset.set
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
        app.hide()
        if (mes.data.errCode) {
          app.error(mes.data.msg, 1500)
        } else {
          // app.success(mes.data.msg, 1500)
          if (mes.data.type == 'insert') {
            that.setGoodsParameter(goodsId, is_choice, true)
          } else {
            that.setGoodsParameter(goodsId, is_choice)
          }
        }
      }
    })
  },

  /**
  * 设置精选时更改商品参数
  */
  setGoodsParameter: function ($goodsId = 0, is_choice, oper) {
    var goods = this.data.goodsList
    for (var i = 0; i < goods.length; i++) {
      if (goods[i].id == $goodsId) {
        if (oper) {
          goods[i].choice_num = goods[i].choice_num + 1
        }
        goods[i].choice.is_choice = is_choice
      }
    }
    this.setData({ goodsList: goods })
  },

  /**
 * 绑定减数量事件
 */
  reduce: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var product_id = e.currentTarget.id
    var session_key = wx.getStorageSync('session_key')
    app.loading()
    wx.request({
      url: app.globalData.config.host + '/home/prescript_cart_reduce',
      data: {
        session_key: session_key,
        product_id: product_id,
        num: 1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (mes) {
        app.hide()
        if (!mes.data.errCode) {
          let carts = that.data.goodsList
          let nums = parseInt(carts[index].prescript_num)
          let num = nums - 1
          carts[index].prescript_num = num
          if (num == 0) {
            carts[index].in_prescript = 0
          }
          that.setData({
            goodsList: carts,
            cart_num: mes.data.cart_num
          })
          app.success(mes.data.msg)
        } else {
          app.error(mes.data.msg)
        }
      }
    })
  },
  /**
  * 绑定加数量事件
  */
  add: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var product_id = e.currentTarget.id
    var session_key = wx.getStorageSync('session_key')
    app.loading()
    wx.request({
      url: app.globalData.config.host + '/home/prescript_cart_add',
      data: {
        session_key: session_key,
        product_id: product_id,
        num: 1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (mes) {
        app.hide()
        if (!mes.data.errCode) {
          let carts = that.data.goodsList
          let nums = parseInt(carts[index].prescript_num)
          let num = nums + 1
          carts[index].in_prescript = 1
          carts[index].prescript_num = num
          //console.log(num)
          that.setData({
            goodsList: carts,
            cart_num: mes.data.cart_num
          })
          app.success(mes.data.msg)
        } else {
          app.error(mes.data.msg)
        }
      }
    })
  },

})  
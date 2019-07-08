//获取应用实例
var app = getApp()

Page({
  data: {
    activeIndex: 0,         //默认选中第一个
    popSearch: [],          //热搜词汇
    searchKeyword: '',      //搜索关键字 
    tabList: [              //tab切换分类列表
      {
        id: 'sort',       //默认排序
        listTit: '默认',
      },
      {
        id: 'sales',      //销量排序
        listTit: '销量',
      },
      {
        id: 'price',      //价格排序
        listTit: '价格',
      }
    ],
    page: 1,
    pageCount: 0,
    goodsList: [],
    cid: '',
    search: false,          //是否显示热搜界面
    keywords: '',
    order_by: false,
    user: {}
  },

  onLoad: function (e) {
    if (e.cid) {            //商品分类ID
      var cid = e.cid
      this.setData({
        cid: e.cid,
        search: false,
      })
    } else {
      var cid = ''
      this.setData({
        search: true,
      })
    }

    if (e.keywords) {       //关键字
      var keywords = e.keywords
    } else {
      var keywords = ''
    }

    this.getGoodsList(cid, '', keywords)
    this.getUser()
  },

  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      pageCount: 0,
      goodsList: []
    })
    this.getGoodsList(this.data.cid)
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
    this.getGoodsList(this.data.cid)
  },
  /**
   * 页面卸载
   */
  onUnload: function () {
    this.setData({ cid: '' })
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
        //wx.setStorageSync('user_id', res.data.info.id)
      }
    })
  },

  /**
   * 获取商品列表
   */
  getGoodsList: function (cid = '', sort = '', keywords = '') {
    app.loading()
    var that = this
    this.setData({ search: false })
    var page = that.data.page
    var pageCount = that.data.pageCount
    console.log('category_id:' + cid + 'page:' + page + ',pageCount:' + pageCount)
    wx.request({
      url: app.globalData.config.host + '/home/product_list',
      method: 'post',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        cid: cid,
        page: page,
        sort: sort,
        order_by: that.data.order_by,     //正反序
        keywords: keywords
      },
      success: function (res) {
        app.hide()
        that.setData({
          //goodsList: res.data.list,
          page: res.data.page,
          pageCount: res.data.page_count,
          goodsList: that.data.goodsList.concat(res.data.list)
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

  // 排序切换
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


  // 显示搜索
  showSearch: function () {
    this.getSearch()
    this.setData({
      search: true,
      keywords: ''
    })
  },

  // 搜索
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

  // 设置输入的内容
  bindKeywordInput: function (e) {
    this.setData({
      keywords: e.detail.value
    })
  }

})
//获取应用实例
var app = getApp()

Page({
  data: {
    navLeftItems: [],
    navRightItems: [],
    curNav: 0,
    hasgoods: true,
  },

  onLoad: function () {
    this.getCategory(0)
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  /**
   * 获取分类信息
   */
  getCategory: function (parentId) {
    app.loading()
    var that = this
    wx.request({
      url: app.globalData.config.host + '/home/get_category',
      method: 'post',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        parent_id: parentId
      },
      success: function (mes) {
        app.hide()
        if (parentId === 0) {
          var category = []
          category[0] = { id: 'hot', name: '热门分类' }
          for (var i = 0; i < mes.data.length; i++) {
            category[i + 1] = mes.data[i]
          }
          that.setData({
            navLeftItems: category,
            curNav: category[0].id
          })
          that.getCategory('hot')      //查询热门分类
        } else {
          that.setData({
            navRightItems: mes.data,
            hasgoods: mes.data.length
          })
        }
      }
    })
  },

  //切换事件处理函数
  switchRightTab: function (e) {
    let id = e.target.dataset.id,
      index = parseInt(e.target.dataset.index);
    let curNav = this.data.curNav;
    this.setData({
      curNav: id,
      curIndex: index,
    })
    this.getCategory(id)
  },

  //跳转至商品
  seachGoods: function (e) {
    var id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/my/myShopManage/myShopManage?cid=' + id,
    })
  },

  // 跳转至搜索页面
  bindKeywordInput: function () {
    wx.redirectTo({
      url: '/pages/my/myShopManage/myShopManage',
    })
  }

})
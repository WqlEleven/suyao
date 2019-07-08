// pages/prescriptDetail/prescriptDetail.js
//获取应用实例
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    pid: 0,
    hasList: true,          // 列表是否有数据
    totalPrice: 0,           // 总价，初始为0
    selectAllStatus: true,   // 全选状态，默认全选
    carts: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    var id = options.id
    if (id !== undefined) {
      that.setData({
        id: id
      })
      that.getPrescriptDetail(id)
    }
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
    var that = this
    return {
      title: '商品套餐',
      path: '/pages/prescriptDetail/prescriptDetail?id=' + that.data.id,
      success: function (res) {
        // 转发成功
        //console.log(that.data.user.id)
        console.log(res)
      },
      fail: function (res) {
        // 转发失败
        console.log(res)
      }
    }
  },
  getPrescriptDetail: function (id) {
    app.loading()
    //app.checkLogin()
    var that = this
    var session_key = wx.getStorageSync('session_key')
    wx.request({
      url: app.globalData.config.host + '/home/prescript_detail',
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        session_key: session_key,
        id: id
      },
      success: function (mes) {
        app.hide()
        if (mes.data.length) {
          that.setData({
            carts: mes.data,
            hasList: true
          })
        } else {
          that.setData({ hasList: false })
        }
      },
      complete: function () {
        that.getTotalPrice()
      }
    })
  },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    const is_check = carts[index].is_check;
    carts[index].is_check = !is_check;
    this.setData({
      carts: carts
    });
    var status = 1;
    for (var i = 0; i < carts.length; i++) {
      if (!carts[i].is_check) {
        status = carts[i].is_check;
      }
    }
    console.log(status)
    if (status == 1) {
      this.setData({ selectAllStatus: true })
    } else {
      this.setData({ selectAllStatus: false })
    }
    this.getTotalPrice();
  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;

    for (let i = 0; i < carts.length; i++) {
      carts[i].is_check = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 绑定加数量事件
   */
  addCount(e) {
    const index = e.currentTarget.dataset.index
    let carts = this.data.carts
    let nums = parseInt(carts[index].num)
    let num = nums + 1
    carts[index].num = num
    this.setData({
      carts: carts
    });
    this.getTotalPrice()
  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let nums = carts[index].num;
    if (nums <= 1) {
      return false;
    }
    let num = nums - 1;
    carts[index].num = num;
    this.setData({
      carts: carts
    });
    this.getTotalPrice()
  },

  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    var that = this
    const index = e.currentTarget.dataset.index
    let carts = this.data.carts
    var cart_id = e.currentTarget.id
    carts.splice(index, 1)
    that.setData({
      carts: carts
    });
    if (!carts.length) {
      that.setData({
        hasList: false
      });
    }
    that.getTotalPrice()
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let carts = this.data.carts;                  // 获取购物车列表
    let total = 0;
    for (let i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
      if (carts[i].is_check) {                     // 判断选中才会计算价格
        total += carts[i].num * carts[i].price;   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  },

  /**
   * 结算，提交购物车
   */
  submitCart: function () {
    var that = this
    //app.checkLogin()
    var cart = this.data.carts
    var is_check = false
    var cart_id = []
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].is_check) {
        is_check = true
        //cart_id[i] = cart[i].id + '|' + cart[i].num
        cart_id.push(cart[i].id + '|' + cart[i].num)
      }
    }
    if (is_check) {
      /**库存监测 */
      /*
      wx.request({
         url: '',
         data:{
            id:cart_id,
            session_key:wx.getStorageSync('session_key'),
         },
         success:function(){

         },
         complete:function(){

         }
      })
      */
      wx.navigateTo({
        url: '/pages/prescriptOrder/prescriptOrder?id=' + that.data.id + '&cart_id=' + cart_id
      })
      /*
      var that = this
      var session_key = wx.getStorageSync('session_key')
      app.loading()
      wx.request({
        url: app.globalData.config.host + '/home/prescript_order',
        data: {
          session_key: session_key,
          cartId: cart_id
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' //application/json
        },
        method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        success: function (mes) {
          app.hide()
          if (!mes.data.errCode) {
            app.success('成功')
          } else {
            app.error(mes.data.msg)
          }
        }
      })
      */
    } else {
      app.error('请选择商品！');
    }
  }
})
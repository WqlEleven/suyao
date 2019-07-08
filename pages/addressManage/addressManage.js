//获取应用实例
var app = getApp()

Page({
   /**
    * 页面的初始数据
    */
   data: {
      show: true,
      addrList: [],
      enter : ''
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
     this.setData({
       enter: options.enter
     })
   },

   /**
    * 获取收获地址列表
    */
   getAddress: function () {
      var that = this
      app.checkLogin();
      // app.loading();
      wx.request({
         url: app.globalData.config.host + '/home/address_list',
         data: {
            session_key: wx.getStorageSync('session_key')
         },
         header: {
           'content-type': 'application/x-www-form-urlencoded' //application/json
         },
         method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
         success: function (res) {
            //app.hide()
            if (res.data.list.length) {
               that.setData({
                  addrList: res.data.list
               })
            } else {
               that.setData({
                  show: false
               })
            }
         }
      })
   },
   toEdit:function(e){
     var that = this;
     var itemId = e.currentTarget.id;
     wx.navigateTo({
       url: '/pages/editAddress/editAddress?id=' + itemId,
     })
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
      this.getAddress()
   },

   /**
    * 生命周期函数--监听页面隐藏
    */
   onHide: function () {

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
    * 删除地址
    */
   delAddress: function (e) {
      // app.loading();
      app.checkLogin();
      var that = this
      wx.request({
         url: app.globalData.config.host + '/home/address_del',
         data: {
            id: e.currentTarget.id,
            session_key: wx.getStorageSync('session_key')
         },
         header: {
           'content-type': 'application/x-www-form-urlencoded' //application/json
         },
         method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
         success: function (res) {
           //app.hide()
         },
         complete: function () {
            that.getAddress()
         }
      })
   },

   /**
    * 选择地址
    */
   checkAddress: function (e) {
      //wx.setStorageSync('addressId', e.currentTarget.id);
      if (this.data.enter == 'my'){

      }else{
        wx.redirectTo({
          url: '/pages/submitOrder/submitOrder?id=' + wx.getStorageSync("urlId") + '&num=' + wx.getStorageSync("urlNum") + '&type=' + wx.getStorageSync("urlType") + '&addressId=' + e.currentTarget.id
        })
      }
   }

})
//获取应用实例
var app = getApp()

Page({
   data: {
      shopImg: '/image/userImg.png',
      shoptype: "速药旗舰店",
      shopname: 'XXX店铺',
      user: {},
      shopkeeperInfo: {},
      userInfo: {},
      productList:{}
   },
   onLoad: function (options) {
     var that = this
     //转发参数
     var parent_id = options.id
     console.log('parent_id:' + parent_id)
     if (parent_id !== undefined) {
       wx.setStorageSync('parent_id', parent_id)
     }

     this.getUserInfo(null)
      this.getGoods()
   },

   onPullDownRefresh: function () {
     wx.stopPullDownRefresh()
   },
   
   onShareAppMessage: function (res) {
     // return custom share data when user share.
     console.log('selection onShareAppMessage')
     var that = this
     var user_id = wx.getStorageSync('user_id')
     //console.log(user_id)
     //console.log(that.data.shopkeeperInfo)
     if (res.from === 'button') {
       // 来自页面内转发按钮
       console.log(res.target)
     }
     return {
       title: that.data.shopkeeperInfo.nickname + '的店铺',
       path: '/pages/selection/selection?id=' + that.data.shopkeeperInfo.id,
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

   getUserInfo: function (user_id) {
     var that = this
     if (user_id == null) {
       wx.login({
         success: function (res) {
           if (res.code) {
             wx.request({
               url: app.globalData.config.host + '/home/login',
               data: {
                 code: res.code
               },
               header: {
                 'content-type': 'application/x-www-form-urlencoded' //application/json
               },
               method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
               success: function (res) {
                 console.log(res.data)
                 var session_key = res.data.session_key;
                 wx.request({
                   url: app.globalData.config.host + '/home/shopkeeper_info',
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
                       shopkeeperInfo: res.data.info
                     })
                   }
                 })
               }
             })
           }
         }
       })
     } else {
       wx.request({
         url: app.globalData.config.host + '/home/shopkeeperinfo',
         data: {
           user_id: user_id
         },
         header: {
           'content-type': 'application/x-www-form-urlencoded' //application/json
         },
         method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
         success: function (res) {
           console.log(res.data)
           that.setData({
             shopkeeperInfo: res.data.info
           })
         }
       })
     }
   },

   /**
    * 获取精选商品
    */
   getGoods: function () {
      var that = this
      wx.request({
         url: app.globalData.config.host + '/home/owner_selection',
         header: { 'Content-Type': 'application/x-www-form-urlencoded' },
         method: 'post',
         data: {
            session_key: wx.getStorageSync('session_key')
         },
         success: function (res) {
            that.setData({
               productList: res.data.goods,
               user: res.data.user
            })
         }
      })
   }

})

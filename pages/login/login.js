// pages/login/login.js
//获取应用实例
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    code:'',
    error:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  
  sendCode(e){
    console.log(22);
    var telRule = /^1[3|4|5|7|8]\d{9}$/;
    let phone = e.data.phone;;
    if (phone=''){
      this.showError('请输入手机号码')
    }
  },
  showError(item){
    let that=this;
    this.setData({
      error: item
    })
  }
})
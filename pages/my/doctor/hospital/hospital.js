// pages/my/doctor/hospital/hospital.js
//获取应用实例
var app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    province_id: 0,
    city_id: 0,
    country_id:0,       // 选择的地区ID
    cityList: [],
    countyList: [],
    hospitalList: [],
    activeIndex: 0, //默认选中第一个
    selectProvinceName: '', //选择省份的名称
    selectCityName: '',     //选择城市的名称
    hospital_name:'',     // 要添加的医院名称
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var province_id = options.province_id
    if (province_id !== undefined) {
      this.setData({
        province_id: province_id
      })
      this.getCityList()
    }
    var city_id = options.city_id
    if (city_id !== undefined) {
      this.setData({
        city_id: city_id
      })
      this.getCountyList()
      this.changeCounty()
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

  },
  getCityList: function () {
    var that = this
    var session_key = wx.getStorageSync('session_key')
    app.loading()
    wx.request({
      url: app.globalData.config.host + '/home/city',
      method: 'post',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        session_key: session_key,
        province_id: that.data.province_id
      },
      success: function (res) {
        app.hide()
        that.setData({
          selectProvinceName: res.data.info.name,
          cityList: res.data.list
        })
      }
    })
  },
  getCountyList: function () {
    var that = this
    var session_key = wx.getStorageSync('session_key')
    app.loading()
    wx.request({
      url: app.globalData.config.host + '/home/country',
      method: 'post',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        session_key: session_key,
        city_id: that.data.city_id
      },
      success: function (res) {
        app.hide()
        that.setData({
          selectCityName: res.data.info.name,
          countyList: res.data.list
        })
      }
    })
  },
  // 医院列表
  changeCounty: function (e = null) {
    var that = this
    var country_id = 0
    if (e != null) {
      country_id = e.currentTarget.id
    }
    var session_key = wx.getStorageSync('session_key')
    app.loading()
    wx.request({
      url: app.globalData.config.host + '/home/hospital',
      method: 'post',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        session_key: session_key,
        city_id: that.data.city_id,
        country_id: country_id
      },
      success: function (res) {
        app.hide()
        that.setData({
          hospitalList: res.data.list,
          country_id: country_id
        })
      }
    })
  },
  // 选择医院
  selectHospital: function (e) {
    var that = this
    var id = e.currentTarget.id
    var value = e.currentTarget.dataset.name
    //console.log(id + '=' + value)

    wx.setStorage({
      key: 'hospital',
      data: [{ id: id, value: value }],
      success: function () {
        wx.navigateBack({
          delta: 3
        })
      }
    })
    /*
    wx.setStorageSync('hospital', [{ id: id, value: value }])
    wx.navigateBack({
      delta: 3
    })
    */
  },

  // 医院名称
  hospital_name:function(e){
    this.setData({
      hospital_name:e.detail.value
    })
  },

  // 添加医院名称
  add_hospital:function(){
    var that = this
    var data = {};
    data.session_key = wx.getStorageSync('session_key')
    data.name = that.data.hospital_name
    data.province_id = that.data.province_id    // 省份ID
    data.city_id = that.data.city_id            // 城市ID
    data.country_id = that.data.country_id      // 地区ID
    if (!data.name){
      app.message('请输入医院名称！');
    } else if (!data.province_id){
      app.message('省份信息不能为空！');
    } else if (!data.city_id){
      app.message('城市信息不能为空！');
    } else if (!data.country_id){
      app.message('请选择地区！');
    }else{
      app.loading()
      wx.request({
        url: app.globalData.config.host + '/home/hospital_add',
        method: 'post',
        header: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: data,
        success: function (res) {
          app.hide()
          console.log(res);
          if(res.data.errCode == 0){
            that.setData({ hospital_name: ''});
            wx.setStorage({
              key: 'hospital',
              data: [{ id: res.data.data.id, value: res.data.data.name }],
              success: function () {
                wx.navigateBack({
                  delta: 3
                })
              }
            })
          }else{
            app.message(res.data.msg);
          }
        }
      })
    }
  }
})
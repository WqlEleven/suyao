//获取应用实例
var app = getApp()

var area = require('../../js/area')
var p = 0, c = 0, d = 0

Page({
  data: {
    name: '',
    tel: '',
    area: '',
    address: '',
    is_default: 0,
    provinceName: [],
    provinceCode: [],
    provinceSelIndex: 0,
    provinceSelName: '',
    cityName: [],
    cityCode: [],
    citySelIndex: 0,
    citySelName: '',
    selectAddress: '',
    districtName: [],
    districtCode: [],
    districtSelIndex: 0,
    districtSelName: '',
    showMessage: false,
    messageContent: '',
    showDistpicker: false,
    region: [],
    //canIUseRegion: false,
    canIUseRegion: wx.canIUse('picker.mode.region')
  },
  onLoad: function (options) {
    // 载入时要显示再隐藏一下才能显示数据，如果有解决方法可以在issue提一下，不胜感激:-)
    // 初始化数据
    if (this.data.canIUseRegion) {

    } else {
      this.setAreaData()
    }
    /*
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)
      }
    })
    try {
      var res = wx.getSystemInfoSync()
      console.log(res.model)
      console.log(res.pixelRatio)
      console.log(res.windowWidth)
      console.log(res.windowHeight)
      console.log(res.language)
      console.log(res.version)
      console.log(res.platform)
    } catch (e) {
      // Do something when catch error
    }
    */
    //var canIUse = wx.canIUse('picker.mode.region');
    //if (!canIUse) {
    //  app.error('您的微信不支持地区选择，请升级微信版本！')
    //}
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  setAreaData: function (p, c, d) {
    var p = p || 0 // provinceSelIndex
    var c = c || 0 // citySelIndex
    var d = d || 0 // districtSelIndex
    // 设置省的数据
    var province = area['100000']
    var provinceName = [];
    var provinceCode = [];
    for (var item in province) {
      provinceName.push(province[item])
      provinceCode.push(item)
    }
    this.setData({
      provinceName: provinceName,
      provinceCode: provinceCode
    })
    // 设置市的数据
    var city = area[provinceCode[p]]
    var cityName = [];
    var cityCode = [];
    for (var item in city) {
      cityName.push(city[item])
      cityCode.push(item)
    }
    this.setData({
      cityName: cityName,
      cityCode: cityCode
    })
    // 设置区的数据
    var district = area[cityCode[c]]
    var districtName = [];
    var districtCode = [];
    for (var item in district) {
      districtName.push(district[item])
      districtCode.push(item)
    }
    this.setData({
      districtName: districtName,
      districtCode: districtCode
    })
  },
  changeArea: function (e) {
    p = e.detail.value[0]
    c = e.detail.value[1]
    d = e.detail.value[2]
    console.log('p=' + p + ',c=' + c + ',d=' + d)
    this.setAreaData(p, c, d);
  },
  showDistpicker: function () {
    this.setData({
      showDistpicker: true
    })
  },
  distpickerCancel: function () {
    this.setData({
      showDistpicker: false
    })
  },
  distpickerSure: function () {
    this.setData({
      provinceSelIndex: p,
      citySelIndex: c,
      districtSelIndex: d,
      provinceSelName: this.data.provinceName[p],
      citySelName: this.data.cityName[c],
      districtSelName: this.data.districtName[d]
    })
    this.distpickerCancel();
  },

  // 提交验证
  savePersonInfo: function (e) {
    var that = this
    var telRule = /^1[3|4|5|7|8]\d{9}$/;
    if (that.data.name == '') {
      app.error('请输入姓名')
    }
    if (that.data.tel == '') {
      app.error('请输入手机号码')
    }
    if (!telRule.test(that.data.tel)) {
      app.error('手机号码格式不正确')
    }
    // if (this.data.canIUseRegion) {
    //   if (that.data.region.length != 3) {
    //     app.error('请选择所在地区')
    //   }
    // } else {
    //   if (that.data.provinceSelIndex === '') {
    //     app.error('请选择所在地区')
    //   }
    //   if (that.data.citySelIndex === '') {
    //     app.error('请选择所在地区')
    //   }
    //   if (that.data.districtSelIndex === '') {
    //     app.error('请选择所在地区')
    //   }
    // }
    if (that.data.address == '') {
      app.error('请输入详细地址')
    }
    //验证登录
    //app.checkLogin()

    //获取session_key
    var session_key = wx.getStorageSync('session_key')
    var province = '';
    var city = '';
    var country = '';
    if (this.data.canIUseRegion) {
      province = that.data.region[0];
      city = that.data.region[1];
      country = that.data.region[2];
    } else {
      province = that.data.provinceSelName;
      city = that.data.citySelName;
      country = that.data.districtSelName;
    }
    var code = this.data.provinceSelIndex + ',' + this.data.citySelIndex + ',' + this.data.districtSelIndex;
    wx.request({
      url: app.globalData.config.host + '/home/address_add',
      data: {
        name: that.data.name,
        mobile: that.data.tel,
        //province: that.data.provinceSelName,
        //city: that.data.citySelName,
        //country: that.data.districtSelName,
        //province: that.data.region[0],
        //city: that.data.region[1],
        //country: that.data.region[2],
        province: province,
        city: city,
        country: country,
        code: code,
        address: that.data.address,
        is_default: that.data.is_default,
        session_key: session_key
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log(res.data)
        //wx.navigateTo({ url: '/pages/addressManage/addressManage' })
        //wx.redirectTo({url: '/pages/addressManage/addressManage'})
        app.success('添加成功！', 1500, '/pages/addressManage/addressManage');
      }
    })
  },

  showMessage: function (text) {
    var that = this
    that.setData({
      showMessage: true,
      messageContent: text
    })
    setTimeout(function () {
      that.setData({
        showMessage: false,
        messageContent: ''
      })
    }, 3000)
  },

  userNameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  telInput: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  addressInput: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  switchChange: function (e) {
    this.setData({
      is_default: e.detail.value ? 1 : 0
    })
    console.log(this.data.is_default);
  },
  bindRegionChange: function (e) {
    console.log(e)
    this.setData({
      region: e.detail.value
    })
  }
})
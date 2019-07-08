//导入
var util = require('../../utils/util.js')

//获取应用实例
var app = getApp()

var secondTimer

Page({

  /**
   * 页面的初始数据
   */
  data: {
    curIndex: 0,
    state: 1,
    hour: '00',
    minute: '00',
    second: '00',
    timeSlot: [],
    goodsList: []
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getSeckillTime()
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
  // 时间段切换
  changeTab: function (e) {
    var that = this
    clearInterval(secondTimer)
    var index = e.currentTarget.dataset.index
    var state = e.currentTarget.dataset.state
    if (that.data.timeSlot.length > 0) {
      //var leave = that.data.timeSlot[index].leave
      var start_time = util.formatTime(new Date())
      var end_time = that.data.timeSlot[index].end
      //console.log(start_time)
      //console.log(end_time)
      var leave = that.GetDateDiff(start_time, end_time, 'second')
      var time = that.sec_to_time(leave)
      that.setData({
        curIndex: index,
        state: state,
        hour: time.hour,
        minute: time.min,
        second: time.sec
      })
      secondTimer = setInterval(function () {
        leave--
        var time = that.sec_to_time(leave)
        that.setData({
          hour: time.hour,
          minute: time.min,
          second: time.sec
        })
        if (that.data.hour == '00' && that.data.minute == '00' && that.data.second == '00') {
          clearInterval(secondTimer)
          that.getSeckillTime()
          //that.getProductSeckill()
        }
      }, 1000)
      that.getProductSeckill()
    }
  },
  GetDateDiff: function (startTime, endTime, diffType) {
    //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式 
    startTime = startTime.replace(/\-/g, "/");
    endTime = endTime.replace(/\-/g, "/");
    //将计算间隔类性字符转换为小写
    diffType = diffType.toLowerCase();
    var sTime = new Date(startTime); //开始时间
    var eTime = new Date(endTime); //结束时间
    //作为除数的数字
    var timeType = 1;
    switch (diffType) {
      case "second":
        timeType = 1000;
        break;
      case "minute":
        timeType = 1000 * 60;
        break;
      case "hour":
        timeType = 1000 * 3600;
        break;
      case "day":
        timeType = 1000 * 3600 * 24;
        break;
      default:
        break;
    }
    return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(timeType));
  },
  // 秒转换时分秒
  sec_to_time: function (s) {
    var hour, min, sec;
    if (s > 0) {
      var hour = Math.floor(s / 3600);
      var min = Math.floor(s / 60) % 60;
      var sec = s % 60;
      if (hour < 10) {
        hour = '0' + hour;
      } else {
        hour = hour + ":";
      }

      if (min < 10) {
        min = "0" + min;
      } else {
        min = min;
      }

      if (sec < 10) {
        sec = "0" + sec;
      } else {
        sec = sec;
      }
    } else {
      var hour = '00';
      var min = '00';
      var sec = '00';
    }
    return { hour: hour, min: min, sec: sec };
  },
  getSeckillTime: function () {
    var that = this
    app.loading()
    wx.request({
      url: app.globalData.config.host + '/home/product_seckill_time',
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        app.hide()
        that.setData({
          timeSlot: res.data.list
        })
        //console.log(that.data.timeSlot)
        if (that.data.timeSlot.length > 0) {
          //var leave = that.data.timeSlot[that.data.curIndex].leave
          var start_time = util.formatTime(new Date())
          var end_time = that.data.timeSlot[that.data.curIndex].end
          //console.log(start_time)
          //console.log(end_time)
          var leave = that.GetDateDiff(start_time, end_time, 'second')
          var time = that.sec_to_time(leave)
          that.setData({
            hour: time.hour,
            minute: time.min,
            second: time.sec
          })

          if (leave > 0) {
            secondTimer = setInterval(function () {
              leave--
              var time = that.sec_to_time(leave)
              that.setData({
                hour: time.hour,
                minute: time.min,
                second: time.sec
              })
              if (that.data.hour == '00' && that.data.minute == '00' && that.data.second == '00') {
                clearInterval(secondTimer)
                that.getSeckillTime()
                //that.getProductSeckill()
              }
            }, 1000)
          }
          that.getProductSeckill()
        }
      }
    })
  },
  getProductSeckill: function () {
    var that = this
    var time = that.data.timeSlot[that.data.curIndex].time
    var id = that.data.timeSlot[that.data.curIndex].id
    app.loading()
    wx.request({
      url: app.globalData.config.host + '/home/product_seckill_list',
      data: {
        //time: time,
        id: id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        app.hide()
        that.setData({
          goodsList: res.data.list
        })
      }
    })
  },
})
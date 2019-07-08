// pages/my/examination/exam/exam.js
//获取应用实例
var app = getApp()
var timer = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionsname: '',
    exam_id: 0,
    score: 0,
    topscore: 0,
    averagescore: 0,
    wrongnumber: 0,
    time: 0,
    use_time: 0,
    countdown: '00:00',
    isgrade: false,
    id: 0,
    paperInfo: {},
    questionList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    if (id != undefined) {
      this.setData({
        id: id
      })
      this.getPaperInfo(id)
      this.getQuestionList(id)
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
  /**
   * 选项点击
   */
  optionclick: function (e) {
    var that = this;
    var typeCode = e.currentTarget.dataset.typecode; //判断单选，多选
    var index = e.currentTarget.dataset.index; //当前元素索引值
    var parentIndex = e.currentTarget.dataset.parentindex; //当前元素父级索引值
    var questionList = that.data.questionList;
    //console.log(questionList[parentIndex]);
    if (typeCode == 1) {
      // 单选  
      for (var i = 0; i < questionList[parentIndex].option_list.length; i++) {
        questionList[parentIndex].option_list[i].isCheck = false; //其他选项移除
      }
      //console.log(questionList[parentIndex]);
      questionList[parentIndex].option_list[index].isCheck = true; //当前选项选中
      that.setData({
        questionList: questionList,
      })
    } else if (typeCode == 2) {
      // 多选
      questionList[parentIndex].option_list[index].isCheck = !questionList[parentIndex].option_list[index].isCheck; //当前选项点击，如果选中则移除
      that.setData({
        questionList: questionList,
      })
    }
  },
  /**
   * 倒计时
   */
  countdown: function (e) {
    var that = this
    var time = that.data.time * 60
    timer = setInterval(function () {
      time--
      var use_time = that.data.use_time
      use_time++
      if (time == 0) {
        that.setData({
          use_time: 0
        })
        clearInterval(timer)
      }
      var countdown = that.Appendzero(parseInt(time / 60)) + ':' + that.Appendzero(time % 60)
      that.setData({
        countdown: countdown,
        use_time: use_time
      })
    }, 1000)
  },
  Appendzero: function (obj) {
    if (obj < 10) return "0" + obj; else return obj
  },
  /**
  * 打开弹窗
  */
  opengrade: function (e) {
    var that = this
    var questionList = that.data.questionList
    var answers = []
    for (var i = 0; i < questionList.length; i++) {
      var is_check = false
      var answer = []
      for (var j = 0; j < questionList[i].option_list.length; j++) {
        if (questionList[i].option_list[j].isCheck) {
          is_check = true
          answer.push(questionList[i].option_list[j].key)
        }
      }
      answers.push({ id: questionList[i].id, answer: answer })
      if (!is_check) {
        app.error('请回答' + (i + 1) + '道问题')
        return;
      }
    }
    clearInterval(timer)
    //console.log(answers)
    //app.checkLogin()
    var session_key = wx.getStorageSync('session_key')
    wx.request({
      url: app.globalData.config.host + '/home/exam_save',
      method: 'post',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        session_key: session_key,
        id: that.data.id,
        time: that.data.use_time,
        answer: JSON.stringify(answers)
      },
      success: function (res) {
        //console.log(res)
        if (res.data.code == 0) {
          that.setData({
            isgrade: true,
            exam_id: res.data.data.id,
            score: res.data.data.score,
            topscore: res.data.data.top,
            averagescore: res.data.data.average,
            wrongnumber: res.data.data.wrong
          })
        } else {
          app.error(res.data.message)
        }
      }
    })
  },
  /**
  * 关闭弹窗
  */
  closegrade: function (e) {
    var that = this;
    that.setData({
      isgrade: false
    })
  },
  getPaperInfo: function (id) {
    var that = this
    //app.checkLogin()
    var session_key = wx.getStorageSync('session_key')
    wx.request({
      url: app.globalData.config.host + '/home/paper_info',
      method: 'post',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        session_key: session_key,
        id: that.data.id
      },
      success: function (res) {
        //console.log(res)
        that.setData({
          paperInfo: res.data.info,
          time: res.data.info.time
        })
        that.countdown()
      }
    })
  },
  getQuestionList: function (id) {
    var that = this
    //app.checkLogin()
    var session_key = wx.getStorageSync('session_key')
    wx.request({
      url: app.globalData.config.host + '/home/question_list',
      method: 'post',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        session_key: session_key,
        id: that.data.id
      },
      success: function (res) {
        //console.log(res)
        that.setData({
          questionList: res.data.list
        })
      }
    })
  },
  viewTap: function (e) {
    var id = this.data.exam_id
    if (id > 0) {
      wx.navigateTo({
        url: '/pages/my/examination/examDetail/examDetail?id=' + id
      })
    }
  }
})
//获取应用实例
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    content: '',
    imageList: [],
    fileList: [],
    count: 9,
    chooseImageFlage: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    if (id !== undefined) {
      this.setData({
        id: id
      })
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
  textareaInput: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  /**
   *  图片上传
   */
  chooseImage: function () {
    var that = this
    var length = that.data.imageList.length
    if (length >= that.data.count) {
      app.error('只能上传' + that.data.count + '张图片')
    } else {
      wx.chooseImage({
        count: 9,
        success: function (res) {
          var tempFilePaths = res.tempFilePaths
          //console.log(tempFilePaths)
          for (var i = 0; i < tempFilePaths.length; ++i) {
            if (that.data.imageList.length >= that.data.count) {
              app.error('只能上传' + that.data.count + '张图片')
            } else {
              var filePath = tempFilePaths[i]
              //console.log(filePath)
              var imageList = that.data.imageList.concat(filePath)
              that.setData({
                imageList: imageList,
                chooseImageFlage: imageList.length >= that.data.count ? false : true
              })
              app.loading()
              wx.uploadFile({
                url: app.globalData.config.host + '/home/upload',
                filePath: filePath,
                name: 'file',
                formData: {
                  'user': 'test'
                },
                success: function (res) {
                  console.log(res)
                  app.hide()
                  if (res.statusCode == 200) {
                    var data = JSON.parse(res.data)
                    //console.log(data)
                    if (data.code == 0) {
                      var fileList = that.data.fileList.concat(data.data.file_name)
                      that.setData({
                        fileList: fileList
                      })
                      //console.log(that.data.fileList)
                    } else {
                      app.error(data.message)
                    }
                  } else {
                    app.error(res.errMsg)
                  }
                }
              })
            }
          }
        }
      })
    }
  },
  //删除已经上传的图片：
  clearImg: function (event) {
    var that = this
    var dataid = event.currentTarget.dataset.id
    that.data.imageList.splice(dataid, 1)
    that.data.fileList.splice(dataid, 1)
    that.setData({
      imageList: that.data.imageList,
      fileList: that.data.fileList,
      chooseImageFlage: that.data.imageList.length >= that.data.count ? false : true
    })
    //console.log(that.data)
  },
  previewImage: function (e) {
    var that = this
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: that.data.imageList
    })
  },
  saveTap: function (e) {
    var that = this
    if (that.data.content == '') {
      app.error('请输入素材描述')
      return;
    }
    if (that.data.fileList.length == 0) {
      app.error('请上传图片')
      return;
    }
    var pictures = that.data.fileList.join(',')

    app.loading()
    var session_key = wx.getStorageSync('session_key')
    wx.request({
      url: app.globalData.config.host + '/home/matter_save',
      data: {
        session_key: session_key,
        product_id: that.data.id,
        content: that.data.content,
        pictures: pictures
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log(res.data)
        app.hide()
        if (res.data.code == 0) {
          app.success('发布成功！等待审核', 1500, '/pages/goodsDetail/goodsDetail', 'navigateBack')
        } else {
          app.error(res.data.message)
        }
      }
    })
  },
  resetTap: function (e) {
    wx.navigateBack({
      //
    })
  }
})
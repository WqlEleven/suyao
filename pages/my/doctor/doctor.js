// pages/my/doctor/doctor.js
//获取应用实例
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    sex: 0,
    sexArr: [{
      'id': '1',
      'value': '男'
    },
    {
      'id': '2',
      'value': '女'
    }],
    sexIndex: 0,
    titleArr: [{
      id: 1,
      value: '住院医师',
    }, {
      id: 2,
      value: '医师'
    }, {
      id: 3,
      value: '主治医师'
    }, {
      id: 4,
      value: '副主任医师'
    }, {
      id: 5,
      value: '主任医师'
    }],
    titleIndex: 0,
    title_id: 0,
    name: '',
    skilled: '',
    brief: '',
    hospital: [],
    hospital_id: 0,
    department: [],
    department_id: 0,
    workerCards: '',
    worker_cards: '',
    licenceId: '',
    version: '',
    licenceImg: '',
    licenceInfoImg: '',
    licence_photo: '',
    licence_picture: '',
    idcard: '',
    idCardsImg: '',
    idCardsBackImg: '',
    card_photo: '',
    card_picture: '',
    credentials: '',
    credentials_picture: '',
    visitTime: [],
    visit_time: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.getInfo()
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
    //var pages = getCurrentPages()
    //console.log(pages)
    var that = this;
    wx.getStorage({
      key: 'realName',
      success: function (res) {
        var data = res.data;
        if (data) {
          that.setData({
            name: data
          });
        }
      }
    });
    wx.getStorage({
      key: 'sexIndex',
      success: function (res) {
        var data = res.data;
        if (data) {
          that.setData({
            sexIndex: data,
            sex: that.data.sexArr[data].id
          });
        }
      }
    });
    wx.getStorage({
      key: 'titleIndex',
      success: function (res) {
        var data = res.data;
        if (data) {
          that.setData({
            titleIndex: data,
            title_id: that.data.titleArr[data].id
          });
        }
      }
    });
    wx.getStorage({
      key: 'hospital',
      success: function (res) {
        var data = res.data;
        if (data) {
          that.setData({
            hospital: data,
            hospital_id: data[0].id
          });
        }
      }
    });
    wx.getStorage({
      key: 'department',
      success: function (res) {
        var data = res.data;
        if (data) {
          that.setData({
            department: data,
            department_id: data[0].id
          });
        }
      }
    });
    wx.getStorage({
      key: 'visitTime',
      success: function (res) {
        var data = res.data;
        if (data) {
          that.setData({
            visitTime: data
          });
          var list = []
          for (var i = 0; i < data.length; i++) {
            if (data[i].morning || data[i].afternoon || data[i].night) {
              list.push(data[i].day)
            }
          }
          //console.log(list)
          that.setData({
            visit_time: list.join(',')
          });
        }
      }
    });
    wx.getStorage({
      key: 'skilled',
      success: function (res) {
        var data = res.data;
        if (data) {
          that.setData({
            skilled: data
          });
        }
      }
    });
    wx.getStorage({
      key: 'brief',
      success: function (res) {
        var data = res.data;
        if (data) {
          that.setData({
            brief: data
          });
        }
      }
    });
    wx.getStorage({
      key: 'workerCards',
      success: function (res) {
        var data = res.data;
        if (data) {
          that.setData({
            workerCards: app.globalData.config.sinaHost + '/picture/' + data,
            worker_cards: data
          });
        }
      }
    });
    wx.getStorage({
      key: 'licenceId',
      success: function (res) {
        var data = res.data;
        if (data) {
          that.setData({
            licenceId: data
          });
        }
      }
    });
    wx.getStorage({
      key: 'version',
      success: function (res) {
        var data = res.data;
        if (data) {
          that.setData({
            version: data
          });
        }
      }
    });
    wx.getStorage({
      key: 'licenceImg',
      success: function (res) {
        var data = res.data;
        if (data) {
          that.setData({
            licenceImg: app.globalData.config.sinaHost + '/picture/' + data,
            licence_photo: data
          });
        }
      }
    });
    wx.getStorage({
      key: 'licenceInfoImg',
      success: function (res) {
        var data = res.data;
        if (data) {
          that.setData({
            licenceInfoImg: app.globalData.config.sinaHost + '/picture/' + data,
            licence_picture: data
          });
        }
      }
    });
    wx.getStorage({
      key: 'idcard',
      success: function (res) {
        var data = res.data;
        if (data) {
          that.setData({
            idCard: data
          });
        }
      }
    });
    wx.getStorage({
      key: 'idCardsImg',
      success: function (res) {
        var data = res.data;
        if (data) {
          that.setData({
            idCardsImg: app.globalData.config.sinaHost + '/picture/' + data,
            card_photo: data
          });
        }
      }
    });
    wx.getStorage({
      key: 'idCardsBackImg',
      success: function (res) {
        var data = res.data;
        if (data) {
          that.setData({
            idCardsBackImg: app.globalData.config.sinaHost + '/picture/' + data,
            card_picture: data
          });
        }
      }
    });
    wx.getStorage({
      key: 'credentials',
      success: function (res) {
        var data = res.data;
        if (data) {
          that.setData({
            credentials: app.globalData.config.sinaHost + '/picture/' + data,
            credentials_picture: data
          });
        }
      }
    });
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
  removeStorage: function () {
    var storage = ['realName', 'sexIndex', 'titleIndex', 'hospital', 'department', 'skilled', 'brief', 'workerCards', 'licenceId', 'version', 'licenceImg', 'licenceInfoImg', 'idcard', 'idCardsImg', 'idCardsBackImg', 'credentials', 'visitTime'];
    this.clearStorage(storage);
  },
  /*性别选择*/
  bindSexPicker: function (e) {
    var that = this
    var index = e.detail.value
    that.setData({
      sexIndex: index,
      sex: that.data.sexArr[index].id
    })
    wx.setStorage({
      key: "sexIndex",
      data: that.data.sexIndex
    })
  },
  // 职称选择
  bindTitlePicker: function (e) {
    var that = this
    var index = e.detail.value
    that.setData({
      titleIndex: index,
      title_id: that.data.titleArr[index].id
    })
    wx.setStorage({
      key: "titleIndex",
      data: that.data.titleIndex
    })
  },
  // 姓名绑定
  userNameInput: function (e) {
    var that = this
    that.setData({
      name: e.detail.value
    })
    wx.setStorage({
      key: "realName",
      data: that.data.name
    })
  },
  // 擅长绑定
  skilledInput: function (e) {
    var that = this
    that.setData({
      skilled: e.detail.value
    })
    wx.setStorage({
      key: "skilled",
      data: that.data.skilled
    })
  },
  // 个人简介绑定
  briefInput: function (e) {
    var that = this
    that.setData({
      brief: e.detail.value
    })
    wx.setStorage({
      key: "brief",
      data: that.data.brief
    })
  },
  //清除本地存储
  clearStorage: function (arr) {
    for (var i = 0; i < arr.length; i++) {
      wx.removeStorage({
        key: arr[i],
        success: function (res) {
          console.log(res.data)
        }
      })
    }
  },
  getInfo: function () {
    var that = this
    var session_key = wx.getStorageSync('session_key')
    wx.request({
      url: app.globalData.config.host + '/home/doctor_info',
      data: {
        session_key: session_key
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 0) {
          that.setData({
            info: res.data.info,
            name: res.data.info.name,
            sex: res.data.info.sex,
            hospital_id: res.data.info.hospital_id,
            department_id: res.data.info.department_id,
            title_id: res.data.info.title_id,
            //visit_time: JSON.parse(res.data.info.visit_ime),
            //visit_time: res.data.info.visit_ime,
            worker_cards: res.data.info.worker_cards,
            version: res.data.info.version == 1 ? 'new' : 'old',
            licence_id: res.data.info.licence_id,
            licence_photo: res.data.info.licence_photo,
            licence_picture: res.data.info.licence_picture,
            id_card: res.data.info.id_card,
            card_photo: res.data.info.card_photo,
            card_picture: res.data.info.card_picture,
            credentials_picture: res.data.info.credentials_picture,
            skilled: res.data.info.skilled,
            brief: res.data.info.brief
          })
        } else {
          app.error(res.data.message)
        }
      }
    })
  },
  //提交
  submit: function () {
    var that = this
    if (that.data.name == '') {
      app.error('请输入姓名')
      return;
    }
    if (!/^[\u4e00-\u9fa5]{2,4}$/.test(that.data.name)) {
      app.error('姓名格式不正确')
      return;
    }
    if (that.data.sex == 0) {
      app.error('请选择性别')
      return;
    }
    if (that.data.hospital_id == 0) {
      app.error('请选择医院')
      return;
    }
    if (that.data.department_id == 0) {
      app.error('请选择科室')
      return;
    }
    if (that.data.title_id == 0) {
      app.error('请选择职称')
      return;
    }
    if (that.data.visit_time == '') {
      app.error('请选择出诊时间')
      return;
    }
    if (that.data.worker_cards == '') {
      app.error('请上传工作证')
      return;
    }
    if (that.data.version == '') {
      app.error('请上传医师执业证')
      return;
    }
    if (that.data.version == 'new') {
      if (that.data.licenceId == '') {
        app.error('请输入新版医师资格证书编号')
        return;
      }
      if (that.data.licence_picture == '') {
        app.error('请上传新版医师执业信息页')
        return;
      }
    }
    if (that.data.version == 'old') {
      if (that.data.licenceId == '') {
        app.error('请输入旧版医师资格证书编号')
        return;
      }
      if (that.data.licence_photo == '') {
        app.error('请上传旧版医师执业证照片页')
        return;
      }
      if (that.data.licence_picture == '') {
        app.error('请上传旧版医师执业信息页')
        return;
      }
    }
    if (that.data.idCard == '') {
      app.error('请输入身份证号码')
      return;
    }
    if (!/(^\d{15}$)|(^\d{17}([0-9]|X))$/i.test(that.data.idCard)) {
      app.error('身份证号格式不正确')
      return;
    }
    if (that.data.card_photo == '') {
      app.error('请上传身份证正面')
      return;
    }
    if (that.data.card_picture == '') {
      app.error('请上传身份证背面')
      return;
    }
    if (that.data.credentials_picture == '') {
      app.error('请上传职称证书')
      return;
    }
    if (that.data.skilled == '') {
      app.error('请输入您的擅长')
      return;
    }
    if (that.data.brief == '') {
      app.error('请输入个人简介')
      return;
    }

    var session_key = wx.getStorageSync('session_key')
    wx.request({
      url: app.globalData.config.host + '/home/doctor',
      data: {
        session_key: session_key,
        name: that.data.name,
        sex: that.data.sex,
        hospital_id: that.data.hospital_id,
        department_id: that.data.department_id,
        title_id: that.data.title_id,
        visit_time: JSON.stringify(that.data.visitTime),
        worker_cards: that.data.worker_cards,
        version: that.data.version == 'new' ? 1 : 2,
        licence_id: that.data.licenceId,
        licence_photo: that.data.licence_photo,
        licence_picture: that.data.licence_picture,
        id_card: that.data.idCard,
        card_photo: that.data.card_photo,
        card_picture: that.data.card_picture,
        credentials_picture: that.data.credentials_picture,
        skilled: that.data.skilled,
        brief: that.data.brief
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json
      },
      method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 0) {
          //app.success('提交成功，等待管理员审核！', 1500, 'pages/my/my', 'navigateBack', 1)
          app.success('提交成功，等待管理员审核！', 1500, function () {
            that.removeStorage()
            wx.navigateBack({
              delta: 1
            })
          })
        } else {
          app.error(res.data.message)
        }
      }
    })
  }
})
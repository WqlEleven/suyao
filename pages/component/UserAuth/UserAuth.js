Component({
  properties: {
    appName: {
      type: String,
      value: '',
    }
  },
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  methods: {
    getUserInfo(e) {
      this.triggerEvent('getUserInfo', e.detail);
    },
  }
})

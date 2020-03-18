// pages/dateCommnet/dateCommnet.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isgo:false,
    ids: '',
    openid: '',
    id: '',
    phone: '',
    heddin: false,
    flag: false,
    startTime: '08:00',
    endTime: '22:00',
    unit: 60,
    reserveUnit: 60,
    // { // 预约时间单位（默认60分钟）
    //   type: Number,
    //   value: 60,
    // },
    activedConst: 101,
    //  { // 已经选中的常量标示
    //   type: Number,
    //   value: 101,
    // },
    disabledConst: { // 不可选的常量标示
      type: Number,
      value: 102,
    },

    // 不可预约时间列表
    unreserveTime:

      [{
        startTime: '2020-02-26 14:00:00',
        endTime: '2020-02-26 15:00:00',

        status: 102, // 这个值指明这个时间段是 已经选择 或者 不可选     
        // 可以通 activedConst 和 disabledConst 进行配置
      },],


    themeColor: '#fd7464',
    selectObject:null
  },
  show:function(){
    wx.showToast({
      title: '重新选择时间',
      icon:'none'
    })
  },
  getOpenid() {

    let that = this;
    wx.cloud.callFunction({
      name: 'add',
      complete: res => {
        if (res.result.openId) {
          var openid = res.result.openId;
          console.log(openid)
          that.setData({
            openid: openid
          })



        }

      }
    })
  },
  quxiao: function () {
    this.setData({
      heddin: false,
    })
  },
  onSelectTime: function (e) {
    let a = new Date()
    console.log(e)
    console.log(a)

    if (a > e.detail.startTime) {
      this.setData({
        isgo:true
      })
      wx.showToast({
        title: '当前时间已经过去了，请重新选择',
        icon: 'none'
      })
    return;
    } 
      this.setData({
        selectObject: {
          startTime: e.detail.startTimeText,
          endTime: e.detail.endTimeText,
          status: 102
        },
        isgo: false
      })
    


  },
  inPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  btnOk: function () {
    console.log(this.data.selectObject)
    if (this.data.selectObject!=null) {
      wx.navigateTo({
        url: '../appointment/appointmentInfo?id=' + this.data.id + "&ids=" + this.data.ids + "&startTime=" + this.data.selectObject.startTime + "&endTime=" + this.data.selectObject.endTime,
      })
    } else {
      wx.showToast({
        title: '请先选择合适的时间段',
        icon: 'none'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.time)
    if (options.ids) {
      this.setData({
        ids: options.ids
      })
    }
    if (options.time > 0) {
      this.setData({
        unit: parseInt(options.time),
        reserveUnit: parseInt(options.time),

      })
    }

    if (options.id) {
      let that = this
      this.setData({
        id: options.id
      })
      wx.cloud.callFunction({
        // 云函数名称
        name: 'selectMap',
        // 传给云函数的参数
        data: {
          name: 'order_master',
          rule: { 'fruitboardid': options.id,'status':1 },

        },
        success: function (res) {
          console.log(res)
          let tem = []
          for (var item of res.result.data) {

            tem.push(item.fruitList)
          }
          console.log(tem)
          that.setData({
            unreserveTime: tem,
            flag: true
          })

        },
        fail: console.error
      })
      // app.getInfoWhere('order_master', {
      //   'fruit-board_id':options.id
      // }, e => {
      //   console.log(e)
      //   var tmp = []
      //   var len = e.data.length
      //   for (var i = 0; i < len; i++) {
      //     tmp.push(e.data.pop())
      //   }
      //   that.setData({
      //     orders: tmp
      //   })
      // })
    }

  },
  _yybindchange: function (e) {

  },
  _yybindhide: function (e) {

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

  }
})
const app = getApp()

Page({
  data: {
    orderList: {},
    sendingList: {},
    finishedList: {},
    cardNum: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getAllList()
  },

  // --------------------!!!  选项卡切换  !!!----------------------
  tapTo1: function() { //添加
    var that = this
    that.setData({
      cardNum: 1
    })
    that.getAllList()
  },
  tapTo2: function() { //修改和删除
    var that = this
    that.setData({
      cardNum: 2
    })
    that.getAllList()
    // console.log(getCurrentPages())
  },
  tapTo3: function() {
    var that = this
    that.setData({
      cardNum: 3
    })
    that.getAllList()
  },
  tapTo4: function() {
    var that = this
    that.setData({
      cardNum: 4
    })
    app.getInfoByOrder2('order_master', 'orderTime', 'desc', {}, e => {
      that.setData({
        orderList: e.data
      })
      console.log(e, "全部服务")
    })

  },
  tapTo5: function() {
    var that = this
    that.setData({
      cardNum: 5
    })
    that.getAllList()
  },
  // ----------------------!!!  订单管理  !!!----------------------
  // 已支付-发货
  boxFruit: function(e) {
    var that = this
    console.log(e.currentTarget.id)
    // app.updateInfo('order_master', e.currentTarget.id, {
    //   sending: true,
    //   sendingTime: app.CurrentTime_show()
    // }, e => {
    //   console.log(e)
    //   that.getAllList()
    //   wx.showToast({
    //     title: '【已发货】',
    //   })
    // })
    wx.cloud.callFunction({
      // 云函数名称
      name: 'updataOrder',
      // 传给云函数的参数
      data: {
        name: 'order_master',
        id: e.currentTarget.id,
        data: {
          status: 5
        }
      },
      success: function(res) {
        console.log(res)
        that.getAllList()
        wx.showToast({
          title: '【已服务】',
        })
      },
      fail: console.error
    })

  },

  // 已发货-送达
  sendingFruit: function(e) {
    var that = this
    console.log(e.currentTarget.id)
    // app.updateInfo('order_master', e.currentTarget.id, {
    //   finished: true,
    //   finishedTime: app.CurrentTime_show()
    // }, e => {
    //   that.getAllList()
    //   wx.showToast({
    //     title: '【已送达】',
    //   })
    // })
    wx.cloud.callFunction({
      // 云函数名称
      name: 'updataOrder',
      // 传给云函数的参数
      data: {
        name: 'order_master',
        id: e.currentTarget.id,
        data: {
          finished: true,
          finishedTime: app.CurrentTime_show()
        }
      },
      success: function(res) {
        console.log(res)
        that.getAllList()
        wx.showToast({
          title: '【已送达】',
        })
      },
      fail: console.error
    })
  },
  binRm: function(e) {
    let that = this
    wx.showModal({
      title: '提示',
      content: '您将删除该订单',
      success(res) {
        console.log(res)
        if (res.confirm) {
          wx.cloud.callFunction({
            // 云函数名称
            name: 'deletOrder',
            // 传给云函数的参数
            data: {
              name: 'order_master',
              id: e.currentTarget.id,

            },
            success: function(res) {
              console.log(res)
              that.getAllList()
              wx.showToast({
                title: '【已删除】',
              })
            },
            fail: console.error
          })
        }
      }
    })

  },

  // 获取所有订单信息
  getAllList: function() {
    var that = this
    //全部服务
    if (that.data.cardNum == 4) {
      app.getInfoByOrder2('order_master', 'orderTime', 'desc', {}, e => {
        that.setData({
          orderList: e.data
        })
        console.log(e,"全部服务")
      })

    } else if (that.data.cardNum == 3) {
      app.getInfoByOrder2('order_master', 'orderTime', 'desc', {
        'status': 2
      }, e => {
        let temp = e.data
        let arr = []
        for (let a in temp) {

          console.log(Date.parse(new Date()) > Date.parse(temp[a].fruitList.startTime.replace(/-/g, '/').substring(0, 19)))
          if (Date.parse(new Date()) > Date.parse(temp[a].fruitList.startTime.replace(/-/g, '/').substring(0, 19))) {

            arr.push(a)
          }

        }
        that.setData({
          orderList: arr
        })
      })
    }
    app.getInfoByOrder2('order_master', 'orderTime', 'desc', {
      'status': that.data.cardNum
    }, e => {
      that.setData({
        orderList: e.data
      })
      console.log(e)
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
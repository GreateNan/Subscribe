// pages/appointment/appointmentInfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ids: [],
    time: '',
    sWeek: '',
    sxw: '',
    fruitDetail: '',
    remark: '',
    phone: "",
    name: '',
    openid: '',
    startTime: '',
    endTime: '',

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
  in: function(e) {
    console.log(e)

    if (e.currentTarget.dataset.id == 1) {
      this.setData({
        remark: e.detail.value
      })
    } else if (e.currentTarget.dataset.id == 2) {
      this.setData({
        phone: e.detail.value
      })
    } else {
      this.setData({
        name: e.detail.value
      })
    }
  },
  toTime: function(strTime) {
    if(!strTime) {
      return '';
    }
    var myDate = new Date(strTime + '+0800');
    if(myDate == 'Invalid Date') {
  strTime = strTime.replace(/T/g, ' '); //去掉T
  strTime = strTime.replace(/-/g, '/');
  strTime = strTime.replace(/\.\d+/, ' ');//去掉毫秒
  myDate = new Date(strTime + '+0800');
}
return myDate;
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.getOpenid()
    if (options.id) {
      let that = this
      this.setData({
        id: options.id
      })
      app.getInfoWhere('fruit-board', {
          _id: options.id
        },
        e => {
          console.log(e)
          that.setData({
            fruitDetail: e.data["0"]
          })
        }
      )
    }
    if (options.ids) {
      let temp = options.ids.split("|")
      temp.pop()
      this.setData({
        ids: temp
      })
      console.log(temp)
    }
    if (options.startTime) {
      var today = this.toTime(options.startTime); //申明时间变量

      let temp = ""
      var sWeek = today.getDay(); //星期
      var todays = today.getHours();
      console.log(sWeek)
      switch (sWeek) {
        case 0:
          temp = "周日"
          break;
        case 1:
          temp = "星期一"
          break;
        case 2:
          temp = "星期二"
          break;
        case 3:
          temp = "星期三"
          break;
        case 4:
          temp = "星期四"
          break;
        case 5:
          temp = "星期五"
          break;
        case 6:
          temp = "星期六"
          break;
      }
      this.setData({
        startTime: options.startTime,
        time: options.startTime.substring(11, 16),
        date: options.startTime.substring(0, 10).replace(/\-/g, '/'),
        sWeek: temp,
        sxw: todays > 12 ? "下午" : "上午",
        sWeeks: sWeek
      })

   
    }
    if (options.endTime) {
      this.setData({
        endTime: options.endTime
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  // 构建订单
  exchange: function() {
    let that = this
    if (that.data.phone == '') {
      wx.showToast({
        title: '请您输入手机号',
        icon: "none"
      })
      return;
    }
    if (that.data.name == '') {
      wx.showToast({
        title: '请您输入昵称',
        icon: "none"
      })
      return;
    }
    var out_trade_no = (new Date().getTime() + app.RndNum(6)).toString()
    var openid = that.data.openid
    var tmp = {};



    let order_master = {
      'fruitList': {
        'startTime': that.data.startTime,
        'endTime': that.data.endTime,
        'status': 102
      },
      'serve': that.data.ids,
      'phone': that.data.phone,
      'name': that.data.name,
      'openid': that.data.openid,
      'outtradeno': out_trade_no,
      'orderTime': app.CurrentTime_show(),
      'fruitboardid': that.data.id,
      'fruitboardname': that.data.fruitDetail.name,
      'fruitboardimgUrl': that.data.fruitDetail.imgUrl,
      'time': that.data.time,
      'sWeek': that.data.sWeek,
      'sxw': that.data.sxw,
      'data': that.data.time,
      'data2': that.data.date,
      "status": 1,
      'remark': that.data.remark,
    

    }

    wx.requestSubscribeMessage({
      tmplIds: ['P0a5HdNnawmd3-PB1ScjTxoVEGBhTUCaqBZusYwLLjk'],
      success(res) {
        console.log(res['P0a5HdNnawmd3-PB1ScjTxoVEGBhTUCaqBZusYwLLjk'])
        // 允许发送通知
        if (res['P0a5HdNnawmd3-PB1ScjTxoVEGBhTUCaqBZusYwLLjk']== 'accept'){
          that.setMessage()
          // 上传数据库
          app.addRowToSet('order_master', order_master, e => {
            console.log("订单状态已修改：【订单生成】" + e)
            wx.showToast({
              title: '预约成功，请您根据导航前往门店',
              icon: 'none'
            })


            setTimeout(function () {
              wx.reLaunch({
                url: '../me/me',
              })
            }, 1000)


          })
        }else{
          // 上传数据库
          app.addRowToSet('order_master', order_master, e => {
            console.log("订单状态已修改：【订单生成】" + e)
            wx.showToast({
              title: '预约成功，请您根据导航前往门店',
              icon: 'none'
            })


            setTimeout(function () {
              wx.reLaunch({
                url: '../me/me',
              })
            }, 1000)


          })
        }
      }
    })


   
  },
    // let a = that.data.ids
      // let temp = ''
      // for (let c of a) {
      //   console.log(c)
      //   temp += c + ','
      // }
      // console.log(temp)
      // debugger
      // // 发送通知给管理员
      // wx.cloud.callFunction({
      //   // 云函数名称
      //   name: 'adminMessage',
      //   data: {
      //     touser: 'oPUd55BpdYy4lDncUt-gRQmL9TbA',
      //     page: 'bgInfo',
      //     data: {
      //       name1: {
      //         'value': that.data.name
      //       },
      //       date3: {
      //         'value': that.data.startTime
      //       },
      //       phone_number4: {
      //         'value': that.data.phone
      //       },
      //       thing5: {
      //         'value': temp
      //       },
      //       thing7: {
      //         'value': that.data.remark ? that.data.remark : '无备注'
      //       }
      //     },
      //     templateId: 'P0a5HdNnawmd3-PB1ScjT2KwIF2fIQQG61_jY0v_rlI',
      //   },
      //   success: function (res) {
      //     console.log(res)
      //   },
      //   fail:function(res){
      //     console.log(res)
      //   }
      // })
  //设置用户消息
  setMessage: function() {
    let that=this
    let message = {
      'data': {
        name1: {
          'value': that.data.name
        },
        date3: {
          'value': that.data.startTime
        },
        thing8: {
          'value': '服务即将到期，请您导航到店'
        },
      },
      done:false,
      page:"pages/me/me",
      templateId:'P0a5HdNnawmd3-PB1ScjTxoVEGBhTUCaqBZusYwLLjk',
      touser: that.data.openid,
      tiemC:2,
      startTime: Date.parse(new Date(that.data.startTime.replace(/-/g, "/"))) - 3600000
    }
    // 上传数据库
    app.addRowToSet('message', message, e => {
      console.log("保存通知成功" + JSON.stringify(e))

    })
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
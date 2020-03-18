// page/component/new-pages/user/user.js
const app = getApp();
const util = require("../../utils/util.js")
Page({
  data: {
    orders: [],
    hasAddress: false,
    address: {},
    isAdmin: -1,
    openid: '',
    adiminArr: [
      'oPUd55BpdYy4lDncUt-gRQmL9TbA',
      'oA9Ke4tObqwxqNSfALdVZPkVv7Yc',
      'oA9Ke4rH2nnqFgFbWIhyQu5bCXPA'
    ]
  },
  onLoad() {
    var that = this;
    that.getOpenidAndOrders();
    // console.log(that.data)
  },
  tel: function() {
    wx.makePhoneCall({
      phoneNumber: '15847661405',
    })
  },
  quxiao(e) {
    let that = this
    wx.showModal({
      title: "提示",
      content: '您确认取消当前服务吗',
      success(res){
        if (res.confirm){
          wx.cloud.callFunction({
            // 云函数名称
            name: 'updataOrder',
            // 传给云函数的参数
            data: {
              name: 'order_master',
              id: e.currentTarget.dataset.id,
              data: {
                "status": 2
              }


            },
            success: function (res) {
              wx.showToast({
                title: '取消成功',
                icon: 'none'
              })
              that.getOpenidAndOrders()



            },
            fail: console.error
          })
        }
      }
    })

  },
  // 允许订阅永久的管理员消息
  adminManage:function(){
    wx.requestSubscribeMessage({
      tmplIds: ['P0a5HdNnawmd3-PB1ScjT2KwIF2fIQQG61_jY0v_rlI'],
      success(res) {
        console.log(res['P0a5HdNnawmd3-PB1ScjT2KwIF2fIQQG61_jY0v_rlI'])
       }
    })
  },
  onShow() {
    var self = this;
    // console.log(self.data)
    /**
     * 获取本地缓存 地址信息
     */
    wx.getStorage({
      key: 'address',
      success: function(res) {
        self.setData({
          hasAddress: true,
          address: res.data
        })
      }
    })
  },
  onPullDownRefresh: function() {
    var that = this
    that.getOpenidAndOrders()
    var timer

    (timer = setTimeout(function() {
      wx.stopPullDownRefresh()
    }, 500));

  },

  // 获取用户openid
  getOpenidAndOrders() {
    var that = this;
    wx.cloud.callFunction({
      name: 'add',
      complete: res => {
        console.log('云函数获取到的openid: ', res.result.openId)
        var openid = res.result.openId;
        var isAdmin = null;
        that.setData({
          openid: openid,
          isAdmin: that.data.adiminArr.indexOf(openid)
        })
        wx.cloud.callFunction({
          // 云函数名称
          name: 'selectMap',
          // 传给云函数的参数
          data: {
            name: 'order_master',
            rule: {
              '_openid': that.data.openid,
            },

          },
          success: function(res) {
            console.log(res)
            let temp = res.result.data
            for (let a in temp) {

              console.log(Date.parse(new Date()) > Date.parse(temp[a].fruitList.startTime.replace(/-/g, '/').substring(0, 19)))
              if (Date.parse(new Date()) > Date.parse(temp[a].fruitList.startTime.replace(/-/g, '/').substring(0, 19))) {
                console.log("ssssss")
                temp[a].istimeOut = true
              }
              util.getDateDiff(new Date(), temp[a].fruitList.startTime, function(obj) {
                temp[a].timeDjs = obj.timeDiff;
              })
            }


            that.setData({
              orders: temp
            })

          },
          fail: console.error
        })
        // app.getInfoWhere('order_master',{
        //   "_openid": openid
        // },e=>{
        //   console.log(e)
        //   var tmp = []
        //   var len = e.data.length
        //   for (var i = 0; i < len;i++){
        //     tmp.push(e.data.pop())
        //   }
        //   that.setData({
        //     orders: tmp
        //   })
        // })
      }
    })
  },



  goToBgInfo: function() {
    wx.navigateTo({
      url: '/pages/bgInfo/bgInfo',
    })
  },

  goToBgManage: function() {
    wx.navigateTo({
      url: '/pages/bgManage/bgManage',
    })
  }

})
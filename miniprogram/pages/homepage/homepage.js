// miniprogram/pages/homepage/homepage.js


const app = getApp()

Page({
  data: {
    swiperImgNo: 1,
    imgSwiperUrl: '',
    fruitInfo: [
      {
        juli: 0,
        shop: {},
        imgUrl: '../../images/icon/fruit.png',
        name: "王勋",
        position: '首席',
        price: 98,
        goodReputation: 100,
        reservations: 98,
        entry: ["风格美感造型烫", "免打理烫发", "日系裁剪", "生活健康染发"],
        onShow: true,
      }
    ],
    typeCat: [
      { id: 0, name: "全部" },
      { id: 1, name: "店长" },
      { id: 2, name: "首席" },

    ],
    activeTypeId: 0,
    isShow: true,
    openid: '',
    offLine: null  //是否维护
  },
  getPhoneNumber(e) {
    console.log(e)
  },
  goYuyue: function () {
    wx.navigateTo({
      url: '../me/me',
    })
  },
  // 获取用户openid
  getOpenid() {
    let that = this;
    wx.cloud.callFunction({
      name: 'add',
      complete: res => {
        console.log('云函数获取到的openid: ', res)
        var openid = res.result.openId;
        that.setData({
          openid: openid
        })
      }
    })
  },



  // ------------分类展示切换---------
  typeSwitch: function (e) {
    // console.log(e.currentTarget.id)
    getCurrentPages()["0"].setData({
      activeTypeId: parseInt(e.currentTarget.id)
    })
    switch (e.currentTarget.id) {
      // 全部展示
      case '0':
        app.getInfoByOrder('fruit-board', 'time', 'desc',
          e => {
            getCurrentPages()["0"].setData({
              fruitInfo: e.data
            })
          }
        )
        break;
      // 店长
      case '1':
        app.getInfoWhere('fruit-board', { 'position': "0" },
          e => {
            getCurrentPages()["0"].setData({
              fruitInfo: e.data
            })
          }
        )
        break;
      //  首席
      case '2':
        app.getInfoWhere('fruit-board', { 'position': "1" },
          e => {
            console.log(e)
            getCurrentPages()["0"].setData({
              fruitInfo: e.data
            })
          }
        )
        break;
    }
  },


  // ---------点击跳转至详情页面-------------
  tapToDetail: function (e) {
    console.log("tapToDetail")
    wx.navigateTo({
      url: '../cart/cart?_id=' + e.currentTarget.dataset.fid,
    })
  },


  // ------------生命周期函数------------
  onLoad: function (options) {
    var that = this
    // wx.showLoading({
    //   title: '潮人美业',

    // })
    that.setData({
      isShow: false
    })
    // 获取openId
    that.getOpenid();

  },
  // 打电话
  phone: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.shop.shopPhone //仅为示例，并非真实的电话号码
    })
  },
  // 导航
  map: function () {
    console.log(this.data.shop.latitude)
    wx.openLocation({
      latitude: this.data.shop.latitude,
      longitude: this.data.shop.longitude,
      name: this.data.shop.shopName,
      address: this.data.shop.shopAddress,
      scale: 18, success(res) {
        console.log(res)
      }
    })
  },
  // 获取用户的位置
  getwei: function () {
    let that = this
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        console.log(res, "获取位置信息")
        //获取店铺
        wx.cloud.callFunction({
          // 云函数名称
          name: 'selectMap',
          // 传给云函数的参数
          data: {
            name: 'shop',
            rule: {

            },

          },
          success: function (res) {
            let temp = res.result.data
            console.log(temp, "获取店铺")
            that.setData({
              shop: temp[0],
              juli: (that.getDistance(temp[0].latitude, temp[0].longitude, res.latitude, res.longitude) / 1000).toFixed(0)
            })

          },
          fail: console.error
        })
        // app.getInfoWhere('shop', {},
        //   e => {
        //     console.log(e.data[0], "获取店铺")
        //     that.setData({
        //       shop: e.data[0],
        //       juli: (that.getDistance(e.data[0].latitude, e.data[0].longitude, res.latitude, res.longitude) / 1000).toFixed(0)
        //     })
        //     console.log(that.getDistance(e.data[0].latitude, e.data[0].longitude, res.latitude, res.longitude))
        //     console.log(that.data.shop, "++++++++++")
        //   }
        // )

      },
      fail: function (res) {
        console.log(res)
        if (res.errMsg == "getLocation:fail auth deny") {
          wx.showModal({
            title: '提示',
            content: "您拒绝授权将影响为您计算我们直接的距离，您可以点击当前页面的设置重新获取位置",
            showCancel: false
          })

        }else{
          wx.showModal({
            title: '提示',
            content: "您可能未打开定位请先去设置中打开位置信息",
            showCancel: false
          })
        }
       
        //获取店铺
        wx.cloud.callFunction({
          // 云函数名称
          name: 'selectMap',
          // 传给云函数的参数
          data: {
            name: 'shop',
            rule: {

            },

          },
          success: function (res) {
            let temp = res.result.data
            console.log(temp, "获取店铺")
            that.setData({
              shop: temp[0],
              //juli: (that.getDistance(temp[0].latitude, temp[0].longitude, res.latitude, res.longitude) / 1000).toFixed(0)
            })

          },
          fail: console.error
        })

      }
    })
  },
  callback: function (res) {
    console.log(res)
    console.log(res.detail.authSetting['scope.userLocation'])
   
    if (res.detail.authSetting['scope.userLocation']) {
      this.getwei()
    }
  },

  
  // 获取俩个位置的距离
  getDistance: function (lat1, lng1, lat2, lng2) {

    lat1 = lat1 || 0;

    lng1 = lng1 || 0;

    lat2 = lat2 || 0;

    lng2 = lng2 || 0;

    var rad1 = lat1 * Math.PI / 180.0;

    var rad2 = lat2 * Math.PI / 180.0;

    var a = rad1 - rad2;

    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;

    var r = 6378137;

    return (r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))).toFixed(0)

  },

  onReady: function () {
    // console.log(getCurrentPages()["0"].data)
  },

  onShow: function () {
    var that = this
    //获取用户位置信息
    that.getwei()
    app.getInfoByOrder('fruit-board', 'time', 'desc',
      e => {
        console.log(e, "onshow")
        getCurrentPages()["0"].setData({
          fruitInfo: e.data,
          isShow: true
        })
        wx.hideLoading()
      }
    )
    // console.log(app.globalData.offLine)
    // 是否下线
    app.getInfoWhere('setting', { "option": "offLine" },
      e => {
        that.setData({
          offLine: e.data["0"].offLine
        })
      }
    )

  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {
    return {
      title: '潮人美业预约',
      imageUrl: '',
      path: '/pages/homepage/homepage'
    }
  }

})
// miniprogram/pages/bgInfo/bgInfo.js
const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList: [], //服务者能力
    carts:{},
    openid: '',
    shopAddress: '',
    shopInfo: '',
    shopName: '', //店铺名
    latitude: '',
    longitude: '',
    fruitInfo: {},
    tmpUrlArr: [],
    delFruitId: "",
    cardNum: 1,
    files: [],
    time: 0,
    manageList: [], //管理页面信息列表

    // 上传的信息
    fruitID: null, //水果编号
    name: null, //水果名称
    price: null, //价格
    unit: null, //单位
    detail: "", //描述
    myClass: 0, //今日特惠
    recommend: 0, //店主推荐
    onShow: true, //上架

    myClass_Arr: [
      '店长',
      '首席'
    ],
    recommend_Arr: [
      '否',
      '是'
    ],
    reFresh: null,
    ProductName: '',
    ProductTime: '',
    ProductPrice: '',
  },
  // 添加产品
  addProduct: function() {
    let that = this
    if (that.data.ProductName == '') {
      wx.showToast({
        title: '请输入产品名',
        icon: 'none'
      })
      return;
    }
    if (that.data.ProductTime == '') {
      wx.showToast({
        title: '请输入产品服务时长',
        icon: 'none'
      })
      return;
    }
    if (that.data.ProductPrice == '') {
      wx.showToast({
        title: '请输入产品名价格',
        icon: 'none'
      })
      return;
    }
    let theInfo = {
      name: that.data.ProductName,
      time: that.data.ProductTime,
      price: that.data.ProductPrice,
    }
    // 上传所有信息
    app.addRowToSet('product', theInfo, e => {
      console.log(e)
      wx.showToast({
        title: '产品添加成功',
      })
    })
  },
  //获取服务名
  geProductName: function(e) {
    this.setData({
      ProductName: e.detail.value
    })
  },
  //获取服务时长
  getProductTime: function(e) {
    this.setData({
      ProductTime: e.detail.value
    })
  },
  //获取服价格
  getProductPrice: function(e) {
    this.setData({
      ProductPrice: e.detail.value
    })
  },
  //获取店铺详细描述
  getShopInfo: function(e) {
    this.setData({
      shopInfo: e.detail.value
    })
  },
  //获取店手机号
  getShopPhone: function(e) {
    this.setData({
      shopPhone: e.detail.value
    })
  },
  //获取店铺名
  getShopName: function(e) {
    this.setData({
      shopName: e.detail.value
    })
  },
  //移动选点
  moveToLocation: function() {
    var that = this;
    console.log("移动选点")
    wx.chooseLocation({
      success: function(res) {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          serviceAddress: res.name
        })
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(addressRes) { //成功后的回调
            console.log(addressRes)
            that.setData({
              shopAddress: addressRes.result.address,
              latitude: res.latitude,
              longitude: res.longitude
            })
          },
          fail: function(error) {
            console.error(error);
          }
        })



      },
      fail: function(err) {
        console.log(err)
      }
    });
  },

  //------------------------!!! 获取信息 !!!------------------------
  // 获取水果编号
  getFruitID: function(e) {
    this.setData({
      fruitID: parseInt(e.detail.value)
    })
  },

  // 获取水果名称
  getName: function(e) {
    this.setData({
      name: e.detail.value
    })
  },

  // 获取价格
  getPrice: function(e) {
    this.setData({
      price: e.detail.value
    })
  },

  // 获取单位
  getUnit: function(e) {
    this.setData({
      unit: e.detail.value
    })
  },

  //选择照片并预览（预览地址在files，上传后的地址在tmpUrlArr）
  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      success: function(res) {
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });

        app.upToClound("imgSwiper", that.data.name + Math.random().toString(),
          res.tempFilePaths["0"], tmpUrl => {
            // console.log(tmpUrl)
            that.data.tmpUrlArr.push(tmpUrl)
            // console.log(getCurrentPages())
          })
      }
    })
    // console.log(getCurrentPages())
  },

  //预览图片
  previewImage: function(e) {
    var that = this
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: that.data.tmpUrlArr // 需要预览的图片http链接列表
    })
  },

  //水果详细信息
  getInfoText: function(e) {
    var that = this
    that.setData({
      detail: e.detail.value.split(" ")
    })

  },

  // 今日特惠
  getMyClass: function(e) {
    var that = this
    this.setData({
      myClass: e.detail.value.toString()
    })
  },

  // 店主推荐
  getRecommend: function(e) {
    var that = this
    this.setData({
      recommend: e.detail.value.toString()
    })
  },

  // --------------------!!!  选项卡切换  !!!----------------------
  tapTo1: function() { //添加
    var that = this
    that.setData({
      cardNum: 1
    })
    that.getCart()
  },
  tapTo2: function() { //修改和删除
    var that = this
    that.setData({
      cardNum: 2
    })
    // console.log(getCurrentPages())
  },
  tapTo3: function() {
    var that = this
    that.setData({
      cardNum: 3
    })
  },
  tapTo4: function() {
    var that = this
    that.setData({
      cardNum: 4
    })
  },
  //addd店铺
  addShop: function() {
    let that = this
    if (that.data.shopName == '') {
      wx.showToast({
        title: "请输入商铺名",
        icon: "none"
      })
      return;
    }
    if (that.data.shopPhone == '') {
      wx.showToast({
        title: "请输入商铺联系方式",
        icon: "none"
      })
      return;
    }
    if (that.data.shopAddress == '') {
      wx.showToast({
        title: "请选择商铺位置",
        icon: "none"
      })
      return;
    }
    if (that.data.tmpUrlArr == '') {
      wx.showToast({
        title: "请选择商铺logo",
        icon: "none"
      })
      return;
    }
    if (that.data.shopInfo == '') {
      wx.showToast({
        title: "输入商铺描述",
        icon: "none"
      })
      return;
    }
    // shopAddress: '',
    //   getShopInfo: '',
    //     shopName: '',//店铺名
    //       latitude: '',
    //         longitude: '',
    //           fruitInfo: { },
    // tmpUrlArr: [], 
    let theInfo = {
      'openid': that.data.openid,
      'shopName': that.data.shopName,
      'shopPhone': that.data.shopPhone,
      'shopAddress': that.data.shopAddress,
      'latitude': that.data.latitude,
      'longitude': that.data.longitude,
      'shopInfo': that.data.shopInfo,
      'shopLogo': that.data.tmpUrlArr[0]
    }


    //获取店铺
    app.getInfoWhere('shop', {},
      e => {
        console.log(e.data[0], "获取店铺")
        if (e.data.length != 0) {
          wx.cloud.callFunction({
            // 云函数名称
            name: 'updataOrder',
            // 传给云函数的参数
            data: {
              name: 'shop',
              id: e.data[0]._id,
              data: theInfo
            },
            success: function(res) {
              wx.showToast({
                title: '【已更新】',

              })
              that.setData({
                tmpUrlArr: []
              })
            },
            fail: console.error
          })
        } else {
          // 上传所有信息
          app.addRowToSet('shop', theInfo, e => {
            console.log(e)
            wx.showToast({
              title: '[添加成功]',
            })
            that.setData({
              tmpUrlArr: []
            })
          })
        }

      }
    )


  },

  // ----------------------!!!  提交操作  !!!---------------------
  // 添加水果信息表单
  addFruitInfo: function(e) {
    const that = this
    if (that.data.name && that.data.price) {
      new Promise((resolve, reject) => {
        const {
          fruitID,
          name,
          price,
          unit,
          detail,
          myClass,
          recommend,
          tmpUrlArr,
          onShow,
          productList
        } = that.data
        const theInfo = {
          'goodReputation': fruitID,
          name,
          price,
          'reservations': unit,
          'entry': detail,
          'position': myClass,
          'product': productList,
          onShow
        }
        theInfo['imgUrl'] = that.data.tmpUrlArr[0]
        theInfo['time'] = parseInt(app.CurrentTime())
        resolve(theInfo)
      }).then(theInfo => {
        // 上传所有信息
        app.addRowToSet('fruit-board', theInfo, e => {
          console.log(e)
          wx.showToast({
            title: '添加成功',
          })
        })
        app.getInfoByOrder('fruit-board', 'time', 'desc',
          e => {
            that.setData({
              manageList: e.data
            })
          }
        )
      })
    } else {
      wx.showToast({
        title: '信息不完全',
      })
    }

  },

  // ----------------------!!!  修改水果参数  !!!----------------------
  // 上架水果
  upToLine: function(e) {
    var that = this
    // console.log(e.currentTarget.id)
    app.updateInfo('fruit-board', e.currentTarget.id, {
      onShow: true
    }, e => {
      that.getManageList()
      wx.showToast({
        title: '已上架',
      })
    })
  },

  // 下架水果
  downFromLine: function(e) {
    var that = this
    // console.log(e.currentTarget.id)
    app.updateInfo('fruit-board', e.currentTarget.id, {
      onShow: false
    }, e => {
      that.getManageList()
      wx.showToast({
        title: '已下架',
      })
    })
  },

  // 绑定删除水果名称参数
  getDelFruitId: function(e) {
    var that = this
    app.getInfoWhere('fruit-board', {
      name: e.detail.value
    }, res => {
      console.log(res)
      that.setData({
        delFruitId: res.data["0"]._id
      })
    })
  },

  // 删除水果
  deleteFruit: function() {
    // app.deleteInfoFromSet('fruit-board',"葡萄")
    var that = this
    console.log(that.data.delFruitId)
    new Promise((resolve, reject) => {
        //   app.deleteInfoFromSet('fruit-board', that.data.delFruitId)
        wx.cloud.callFunction({
          // 云函数名称
          name: 'deletOrder',
          // 传给云函数的参数
          data: {
            name: 'fruit-board',
            id: that.data.delFruitId,
          },
          success: function(res) {

            resolve();
            wx.showToast({
              title: '【已删除】',

            })
            that.getManageList()
          },
          fail: console.error
        })
      })
      .then(that.getManageList())
  },

  // 程序下线打烊
  offLine: function() {
    var that = this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'selectMap',
      // 传给云函数的参数
      data: {
        name: 'setting',
        rule: {}
      },
      success: function(res) {
        console.log(res)
        let ch = !res.result.data["0"].offLine
        console.log(res)
        wx.cloud.callFunction({
          // 云函数名称
          name: 'updataOrder',
          // 传给云函数的参数
          data: {
            name: 'setting',
            id: res.result.data["0"]._id,
            data: {
              offLine: ch
            }
          },
          success: function(res) {
            wx.showToast({
              title: '操作成功',
            })
            // wx.showToast({
            //   title: '【已发货】',
            // })
          },
          fail: console.error
        })
      },
      fail: console.error
    })
    // app.getInfoWhere('setting', {
    //   option: "offLine"
    // }, res => {
    //   console.log(res)
    //   let ch = !res.data["0"].offLine

    //   console.log(res)
    //   wx.cloud.callFunction({
    //     // 云函数名称
    //     name: 'updataOrder',
    //     // 传给云函数的参数
    //     data: {
    //       name: 'setting',
    //       id: res.data["0"]._id,
    //       data: {
    //         offLine: ch
    //       }
    //     },
    //     success: function(res) {
    //       wx.showToast({
    //         title: '操作成功',
    //       })
    //       // wx.showToast({
    //       //   title: '【已发货】',
    //       // })
    //     },
    //     fail: console.error
    //   })
    // })
  },


  /**
   * ----------------------!!!  生命周期函数--监听页面加载  !!!----------------------
   */
  getManageList: function() {
    var that = this
    app.getInfoByOrder('fruit-board', 'time', 'desc',
      e => {
        that.setData({
          manageList: e.data
        })
      }
    )
  },

  onLoad: function(options) {
    let that = this
    that.getManageList()
    qqmapsdk = new QQMapWX({
      key: '3SPBZ-I7RCF-JT7JT-JVKC7-ERUPS-FMBOA'
    });
    // 获取用户openid
    wx.cloud.callFunction({
        name: 'add',
        complete: res => {
          console.log('云函数获取到的openid: ', res)
          if (res.result.openId) {
            var openid = res.result.openId;
            console.log(openid)
            that.setData({
              openid: openid
            })
          }
        }
      })
    
    that.getCart()


  },
  getCart:function(){
    //获取产品表
    app.getInfoWhere('product', {},
      e => {
        console.log(e)
        if (e.data.length==0){
          wx.showToast({
            title: '请先编辑服务',
            icon:'none'
          })
          return;
        }
        this.setData({
          carts: e.data
        })
      })
  },
  checkboxChange:function(e){
    let a=[]
    a.push(e.detail.value)
   this.setData({
     productList:a[0]
   })
   console.log(a[0])
  
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
    this.getManageList()
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
    (timer = setTimeout(function() {
      wx.stopPullDownRefresh()
    }, 500));

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
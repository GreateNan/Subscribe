var $image_path = "../assets/images/icon/"
var util = require('../../utils/util.js');
var app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')
var qqmapsdk;
Page({
  /**
   * 页面的初始数据inputPhoneName
   */
  data: {
    _id:0,
    isNew:true,
    addInfo:'',
    openid: '',
    imgpath: app.globalData.imgpath,
    disabled: true,
    code: '',
    is_ShowCode: true,
    codei: '',
    longitude: 0,
    latitude: 0,
    serviceAddress: '',
    area_id: '',
    currentTime: 60,
    time: "获取验证码",
    isChecked: false,//性别
    province: [], //获取到的所有的省
    city: [], //选择的该省的所有市
    area: [], //选择的该市的所有区县
    provinceValue: [], //获取到的所有的省
    cityValue: [], //选择的该省的所有市
    areaValue: [], //选择的该市的所有区县
    province_index: 0, //picker-view省项选择的value值
    city_index: 0, //picker-view市项选择的value值
    area_index: 0, //picker-view区县项选择的value值
    provinceCity: null, //取到该数据的所有省市区数据
    result: {}, //最后取到的省市区名字
    animationData: {},
    oHeight: "",
    icon_type: 'circle',
    icon_color: '',
    name: "", //收货人
    phonenumber: "", //手机号
    address1: "", //详细地址
    is_default: 1, //是否默认地址{2:是，1:否}
    addressId: 0,
    userName: "", //收货人姓名
    userPhone: "", //手机号
    userAddress: "", //详细地址
    is_Empty: 0,
    isOrder: 0, //1：订单确认跳转来的
    user_coupon_id: '',
    ids: '',
    isFrom: 0,
    shop_goods_id: 0,
    shop_goods_name: '',
    shop_goods_spec_id: 0,
    goods_cart_counts: 1,
    is_upgrade: 0, //1:升级订单
    level: 0, //套餐等级
    from_user_id: 0, //上级会员
    remark: '',
    chains_id: 0, //接龙id
    user_pintuan_id: 0
  },
 

  //移动选点
  moveToLocation: function () {
    var that = this;
    
    wx.chooseLocation({
      success: function (res) {
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
          success: function (addressRes) { //成功后的回调
            console.log(addressRes)
            that.setData({
              serviceAddress: addressRes.result.formatted_addresses.recommend
            })
          },
          fail: function (error) {
            console.error(error);
          }
        })



      },
      fail: function (err) {
        console.log(err)
      }
    });
  },
  seleGender: function () {
    this.setData({
      isChecked: !this.data.isChecked

    })

  },
  // 获取用户openid
  getOpenid() {
    let that = this;
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
          app.getAddressInfoWhere('address', { _openid: openid},
            e => {
              console.log(e)
            this.setData({
              name:e.data[0].name,
              phonenumber:e.data[0].phone,
              serviceAddress: e.data[0].address,
              address1: e.data[0].xxAddress,
              isNew:false,
              _id: e.data[0]._id,
              })
            }
          )
        }

      }
    })
  },

  inputName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  inputPhoneName: function (e) {
    this.setData({
      phonenumber: e.detail.value
    })
  },
  inputaddress1: function (e) {
    this.setData({
      address1: e.detail.value
    })
  },
  //输入验证吗
  inpcode: function (e) {
    console.log(e)
    this.setData({
      codei: e.detail.value
    })
  },


  bindCheckChange: function () {
    let that = this;
    if (that.data.is_default == 1) {
      that.setData({

        is_default: 2
      })
    } else {
      that.setData({

        is_default: 1
      })
    }
  },

  addNewAddress: function () {
    let that = this;
    if (that.data.name == "") {
      wx.showToast({
        title: '请输入联系人',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (!util.checkPhone(that.data.phonenumber)) {
      wx.showToast({
        title: '手机号有误',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (that.data.serviceAddress == "") {
      wx.showToast({
        title: '请选择服务地址',
        icon: 'none',
        duration: 1000
      })
      return;
    }


    if (that.data.address1 == "") {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    //首次添加用户地址需要绑定手机号的异步成功后添加地址信息，并且验证验证码的正确性
    if (this.data.isNew) {
    // 新增加一个地址
      app.addAddress('address', { name: this.data.name, phone: this.data.phonenumber, address: this.data.serviceAddress, xxAddress: this.data.address1},e=>{
        wx.showToast({
          title: '添加成功',
          icon:'none'
        })
        setTimeout(function () {
          wx.navigateBack({

          })},1000)
   
      })

    } else {

      app.updataAddress('address',this.data._id, {name: this.data.name, phone: this.data.phonenumber, address:this.data.serviceAddress,xxAddress: this.data.address1},e=>{
        wx.showToast({
          title: '修改成功',
          icon: 'none'
        })
        setTimeout(function () {
          wx.navigateBack({

          })
        }, 1000)
      })

     
    }


  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //初始化map对象
    qqmapsdk = new QQMapWX({
      key: 'ARUBZ-RPGKV-5BOPN-UP2FV-KWSS5-AFFZQ'
    });
    if (parseInt(options.user_pintuan_id) > 0) {
      that.setData({
        user_pintuan_id: options.user_pintuan_id
      })
    }


  
  },
  //验证是否需要绑定手机号
  getCurUserInfo: function () {

    let that = this
    WXAPI.getCurUserInfo({ token: wx.getStorageSync('token') }).then(function (res) {
      if (res.data.data.account_number) {
        that.setData({
          is_ShowCode: true
        })
      } else {
        that.setData({
          is_ShowCode: false
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
this.getOpenid()
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
    return {
      title: app.globalData.shareTitle,
      desc: app.globalData.shareDesc,
      path: app.globalData.sharePath,
      imageUrl: app.globalData.shareImageUrl
    }
  },

})
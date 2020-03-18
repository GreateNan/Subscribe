
var QQMapWX = require('./qqmap-wx-jssdk.min.js')
function initMap() {
  let qqmapsdk
  qqmapsdk = new QQMapWX({
    key: 'CN7BZ-EUVCW-CJRRT-RCFNQ-23B3K-EEFIN'
  });
  return qqmapsdk
}
//定位
function onGetLocation(qqmapsdk) {
  return new Promise((resolve, reject) => {
    let that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        console.log(res)
     
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) { //成功后的回调
            // wx.setStorageSync("loction", addressRes.result.address_component.city)
            // that.setData({
            //   loction: addressRes.result.address_component.city
            // })
            // console.log(addressRes)
            // return addressRes.result.address_component.city
            resolve(addressRes)

          },
          fail: function (error) {
         
            console.log(error)
            resolve(error)
          
          }
        })

      },
      fail: function (res) {
        resolve(res)
        if (!wx.getStorageSync("loctionFlag")) {
          wx.showModal({
            title: '提示',
            content: '您可能未打开位置，请打开后重试',
            showCancel: false
          })
          wx.setStorageSync("loctionFlag", true)
        }

      }
    })
  })

}

module.exports = {
  onGetLocation: onGetLocation,
  initMap: initMap
}
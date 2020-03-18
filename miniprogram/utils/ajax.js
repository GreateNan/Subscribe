var app = getApp()
var requestHandler = {
  params: {},
  API_URL: '',
  token: '',
  success: function (res) {
    // success  
  },
  fail: function () {
    // fail  
  },
}

//GET请求  
function GET(requestHandler) {
  request('GET', requestHandler)
}
//POST请求  
function POST(requestHandler) {
  request('POST', requestHandler)
}

function request(method, requestHandler) {
  //注意：可以对params加密等处理  
  var params = requestHandler.params;
  var API_URL = requestHandler.API_URL;
  wx.request({
    url: app.globalData.domain + app.globalData.project+API_URL,
    data: params,
    method: method,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
      //'token': "bua+B0Qeh2YMwNED+AN8K41EgFBJcuGwgrIbLHRj5PdWuw339Q9mTy2Tgs9/eZDH" //可以动态配置
      
    }, // 设置请求的 header  
    success: function (res) {
      //注意：可以对参数解密等处理  
   
      if(res.data.code==0){
        console.log(res, 'aaa')
        requestHandler.success(res)
      
      }else{
        requestHandler.success(res)
        if (res.data.msg =='用户身份已失效'){
        wx.showToast({
          title: '登陆失效',
          icon: 'loading',
          duration: 1000
        })
        setTimeout(
          function () {
            wx.redirectTo({
              url: 'login',
            })
          }
          , 1000)
      }
      }
    },
    fail: function () {
      requestHandler.fail()
    },
    complete: function () {
      // complete  
    }
  })
}

module.exports = {
  GET: GET,
  POST: POST
}

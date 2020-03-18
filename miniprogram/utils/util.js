const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatDate(date, f) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  var ymd = [year, month, day].map(formatNumber)
  var hms = [hour, minute, second].map(formatNumber)
  var hm = [hour, minute].map(formatNumber)
  return f({
    ymd: ymd,
    hms: hms,
    hm: hm
  })
}
//格林威治时间转换
function timestampToTime(timestamp) {
  var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();
  return Y + M + D + h + m + s;
}

//增加时间
function getDateStr(date, addDayCount, f) {
  //时间戳
  var timestamp = Date.parse(date);
  timestamp = timestamp / 1000;

  //增加的时间
  var add_timetamp = (timestamp + parseInt(addDayCount) * 24 * 60 * 60) * 1000;
  var now_date = new Date(add_timetamp);

  var year = now_date.getFullYear();
  var month = now_date.getMonth() + 1
  var day = now_date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  var ymd = [year, month, day].map(formatNumber)
  var hms = [hour, minute, second].map(formatNumber)
  var hm = [hour, minute].map(formatNumber)
  return f({
    ymd: ymd,
    hms: hms,
    hm: hm
  })
}

//获取时间差
function getDateDiff(date, date2, f) {
  date2 = date2.replace(/-/g, '/').substring(0, 19);
  //两个时间相差的毫秒数
  var timestamp = parseInt(Date.parse(date2)-Date.parse(date));
  //比较后的时间
  var year = (timestamp / 1000 / 60 / 60 / 24 / 30 / 12); //年
  var month = (timestamp / 1000 / 60 / 60 / 24 / 30); //月
  var day = (timestamp / 1000 / 60 / 60 / 24); //天
  var hour = (timestamp / 1000 / 60 / 60); //小时
  var minute = (timestamp / 1000 / 60); //分钟
  var second = (timestamp / 1000); //秒

  if (parseInt(year) >= 1 && year.toString().indexOf('e') <= -1) {
    return f({
      timeDiff: parseInt(year) + "年后"
    })
  } else if (parseInt(month) >= 1 && month.toString().indexOf('e') <= -1) {
    return f({
      timeDiff: parseInt(month) + "月后"
    })
  } else if (parseInt(day) >= 1 && day.toString().indexOf('e') <= -1) {
    return f({
      timeDiff: parseInt(day) + "天后"
    })
  } else if (parseInt(hour) >= 1 && hour.toString().indexOf('e') <= -1) {
    return f({
      timeDiff: parseInt(hour) + "小时后"
    })
  } else if (parseInt(minute) >= 1 && minute.toString().indexOf('e') <= -1) {
    return f({
      timeDiff: parseInt(minute) + "分钟后"
    })
  } else {
    return f({
      timeDiff: second + "秒后"
    })
  }
}

//手机号码校验
const checkPhone = phone => {
  if (/^1[345789]\d{9}$/.test(phone)) {
    return true;
  } else {
    return false;
  }
}

function imageUtil(e) {
  var imageSize = {};
  var originalWidth = e.detail.width; //图片原始宽  
  var originalHeight = e.detail.height; //图片原始高  
  var originalScale = originalHeight / originalWidth; //图片高宽比  
  //获取屏幕宽高  
  wx.getSystemInfo({
    success: function(res) {
      var windowWidth = res.windowWidth;
      var windowHeight = res.windowHeight;
      var windowscale = windowHeight / windowWidth; //屏幕高宽比  
      if (originalScale < windowscale) { //图片高宽比小于屏幕高宽比  
        //图片缩放后的宽为屏幕宽  
        imageSize.imageWidth = windowWidth;
        imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
      } else { //图片高宽比大于屏幕高宽比  
        //图片缩放后的高为屏幕高  
        imageSize.imageHeight = windowHeight;
        imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight;
      }
    }
  })
  return imageSize;
}
//获取本月最后一天
function getCurrentMonthLast() {
  var date = new Date();
  date.setDate(1);
  var endDate = new Date(date);
  endDate.setMonth(date.getMonth() + 1);
  endDate.setDate(0);
  date = new Date(endDate);
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}
/**
 * 计算精确的乘法
 */
function accMul(arg1, arg2) {
  var m = 0, s1 = arg1.toString(),
    s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length
  } catch (e) { }
  try {
    m += s2.split(".")[1].length
  } catch (e) { }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m
  )
}
//加法   
function accAdd(arg1, arg2) {
  var r1, r2, m;
  try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m + arg2 * m) / m
}  
//减法  
function Subtr(arg1, arg2) {
  var r1, r2, m, n;
  try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2));
  n = (r1 >= r2) ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}
// 验证用户名是否含有特殊字符
function check_other_char(str) {
  var arr = ["&", "\\", "/", "*", ">", "<", "@", "!", "，", "。", "；", "、", "‘", "’", "￥", "#", "$"];
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < str.length; j++) {
      if (arr[i] == str.charAt(j)) {
        return true;
      }
    }
  }
  return false;
}
module.exports = {
  check_other_char: check_other_char,
  Subtr: Subtr,
  accAdd:accAdd,
  accMul: accMul,
  formatTime: formatTime,
  formatDate: formatDate,
  getDateStr: getDateStr,
  getDateDiff: getDateDiff,
  checkPhone: checkPhone,
  imageUtil: imageUtil,
  getCurrentMonthLast: getCurrentMonthLast,
  timestampToTime: timestampToTime
}
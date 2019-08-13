// 时间处理函数
const timeFormatting = function (time) {
  let nowTime = new Date().getTime();
  let nowTime1 = new Date();
  let timeDifference = nowTime - time;
  nowTime1.setHours(0);
  nowTime1.setMinutes(0);
  nowTime1.setSeconds(0);
  nowTime1.setMilliseconds(0);
  let timeStamp = nowTime1.getTime();
  if (timeDifference < 10 * 60 * 1000) {
    return '刚刚'
  } else if (time < timeStamp) {
    return new Date(time).getFullYear() + '-' + addZero((new Date(time).getMonth() + 1)) + '-' + addZero(new Date(time).getDate());
  } else {
    return addZero(new Date(time).getHours()) + ':' + addZero(new Date(time).getMinutes())
  }
}

function addZero(num) {
  return num < 10 ? '0' + num : num;
}


/**
 * 日期格式化函数
 * @param {} date
 */

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatDate = function(date, type) {
  var date = new Date(date)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  if (type == 'YYYY-MM-DD') {
      return [year, month, day].map(formatNumber).join('-')
  }
  if (type == '1') {
    return [month, day].map(formatNumber).join('-')+' '+[hour,minute].map(formatNumber).join(':')
  }
  else {
      return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
}

const getPhoneModel = function () {
  var u = navigator.userAgent;
  if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
    return 'ios'
  } else if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
    return 'isAndroid'
  }
  return 'isAndroid'

};

const toWeiXinLogin = function(event) {
  window.location.href = '/mp/weixin/jjbqb/autoLogin?sendURL=' + encodeURIComponent('https://m.51jujibao.com/v2/v3/index.html/#/middlePage?redirect=' + encodeURIComponent(event))
}

const priceStr = function (tb,rmb) {
    let txt='';
    if (tb>0){
      txt = tb+'通宝'
      if (rmb>0){
        txt=txt+'+'
      }
    }
    if (rmb>0){
      txt=txt+'￥'+rmb.toFixed(2)
    }
    return txt
};
export default {
  timeFormatting, formatDate, getPhoneModel,toWeiXinLogin,priceStr
}

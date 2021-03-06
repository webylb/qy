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
  var date  = new Date(date)
  var year  = date.getFullYear()
  var month = date.getMonth() + 1
  var day   = date.getDate()

  var hour   = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  
  if (type === 'YYYY-MM-DD') {
      return [year, month, day].map(formatNumber).join('-')
  }else if (type === 'Y/M/D') {
    return [year, month, day].map(formatNumber).join('/')
  }else if(type === 'Y/M/DH'){
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }else if(type === 'M/DH'){
    return [ month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }else if (type === '1') {
    return [month, day].map(formatNumber).join('-')+' '+[hour,minute].map(formatNumber).join(':')
  }else {
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
      txt=txt+rmb.toFixed(2)
    }
    return txt
};

/**
 * @Description: 处理旧版本后台配置链接
 * @param {String}: url 链接
 * @param {Number}: id 商户号
 * @return {String}: url
 */
const replaceUrlMerchantId = function(url,id){
  let reg = /{merchantId}/gi;
  if(reg.test(url)){ //判断是不是承接页
    return url.replace(reg, id)
  }else{
    let regIndex = /^\//gi;
    if(regIndex.test(url)){ //判断是不是相对路径
      return url
    }else{ //绝对路径
       //判断是否外链
      let regUrl = /^http/gi;
      if(regUrl.test(url)){
        return url
      }else{
        let reg1 = /\?#\//gi;
        let reg2 = /#\//gi;
        if(reg1.test(url)){ //兼容hash模式的支付链接
          return url.replace(reg1, '/')
        }else if(reg2.test(url)){ //兼容hash模式普通链接
          return url.replace(reg2, '/')
        }else{
          return url
        }
      }
    }
  }
}

/**
 * @Description: 处理旧版本后台配置链接
 * @param {String}: url 链接
 * @return {String}: url
 */
const replaceUrlForUrpass = function(url){
  let reg = /vip.guijitech.com/gi;
  if(reg.test(url)){ //判断是不是承接页
    let reg2 = /prev-vip.guijitech.com/gi;
    if(reg2.test(url)){
      return url
    }else{
      return url.replace(reg, 'v.urpass.cn')
    }
  }else{
    return url
  }
}

/**
 * 读取cookies
 */

const getCookie = name => {
  var arr
  var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')

  // eslint-disable-next-line no-cond-assign
  if (arr = document.cookie.match(reg)) {
    return unescape(arr[2])
  } else {
    return null
  }
}

/**
 * 设置cookies
 */

const setCookie = (name, value, exdays) => {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  // console.info(name + "=" + value + "; " + expires);
  document.cookie = name + "=" + value + "; " + expires;
  // console.info(document.cookie);
}


/**
 * 删除cookies
 */
const delCookie = name => {
  var exp = new Date()
  exp.setTime(exp.getTime() - 1)
  var cval = getCookie(name)
  if (cval != null) {
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
  }
}

/**
 * @description: 未登录跳转登陆页
 * @param {type} url 链接
 * @return: url
 */
// const toLogin = function(url)) {
//   window.location.href = '/mp/weixin/jjbqb/autoLogin?sendURL=' + encodeURIComponent('https://m.51jujibao.com/v2/v3/index.html/#/middlePage?redirect=' + encodeURIComponent(event))
// }


/**
 * @description: 添加百度统计事件追踪
 * @param {type}:  label {String} 类型
 * @return: null
 */
const trackEvent = function (label, opt_label) {
  let url = window.location.href
  let reg = /prev-vip.guijitech.com/gi;
  if(label && !reg.test(url)) {
      try {
          window._hmt && window._hmt.push(['_trackEvent', label, 'click', opt_label]);
      } catch (error) {
          console.log(label + '事件统计失败:' + error)
      }
  }
}

/**
 * @description: 添加百度统计事件追踪
 * @param {type}:  id {String} 商户id
 * @return: null
 */
const callService = function (id) {
  if(id === '100036') { //联通客服
    window.location.href = 'https://tb.53kf.com/code/client/10187208/2'
  } else { //默认走优加
    window.location.href = 'https://tb.53kf.com/code/client/10187208/1'
  }
}

export default {
  timeFormatting, formatDate, getPhoneModel, toWeiXinLogin, priceStr, replaceUrlMerchantId, replaceUrlForUrpass, getCookie, setCookie, trackEvent, callService
}

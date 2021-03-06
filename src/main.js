
import Vue from 'vue'
import App from './App'
import router from './router'
import FastClick from 'fastclick'
import '@/common/stylus/index.styl'
import ToastBox from './common/js/toast' //提示弹窗
import VueClipboard from 'vue-clipboard2' //复制功能
import CouponToastBox from './common/js/couponToast'
import VueJsonp from 'vue-jsonp'
import { Toast } from 'vant'

// 调试工具
// import Vconsole from 'vconsole'
// const vConsole = new Vconsole();
// Vue.use(vConsole)

Vue.use(Toast);
Vue.use(VueJsonp);
Vue.use(CouponToastBox);
Vue.use(VueClipboard);
Vue.use(ToastBox);
Vue.config.productionTip = false;

/**
 * @Description: 修复IOS点击困难
 */
FastClick.prototype.focus = function (targetElement) {
  let deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;
  let deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;
  let length;
  if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
    length = targetElement.value.length;
    targetElement.focus();
    targetElement.setSelectionRange(length, length);
  } else {
    targetElement.focus();
  }
};

// dev数据
if(process.env.NODE_ENV === 'development'){
  window.infoData = {
    merchantId: '100036',
    merchantName: '测试账户',
    privilegePageUuid: '4af7386347024bb78db66b079b8df87b',
    openingPageUuid: '',
    personalCenterPageUuid: '67216783016a41a89ac706a8e0a93b02',
    giftPackagePageUuid: 'a78c9de1e9074dec9e57c48876222b18'
  }
  // document.cookie = "QY_COOKIE_PASSPORT_NAME="+"\"sessionId=5d4d7a3867bd42a2b50d98202ab80676&userId=113\""
  // const vConsole = new Vconsole();
  // Vue.use(vConsole)
}

//添加focus指令
Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})

//添加百度统计
router.beforeEach((to, from, next) => {
  let url = window.location.href
  let reg = /prev-vip.guijitech.com/gi;
  if (to.path && !reg.test(url)) {
    try {
      window._hmt && window._hmt.push(['_trackPageview', '/f/q/' + window.infoData.merchantId + '.html' + to.fullPath]);
    } catch (e) {
      console.log(e)
    }
  }
  next();
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
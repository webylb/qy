
import Vue from 'vue'
import App from './App'
import router from './router'
import FastClick from 'fastclick'
import '@/common/stylus/index.styl'
import ToastBox from './common/js/toast' //提示弹窗
import VueClipboard from 'vue-clipboard2' //复制功能
import CouponToastBox from './common/js/couponToast'
import VueJsonp from 'vue-jsonp'

//调试工具
// import Vconsole from 'vconsole';
// const vConsole = new Vconsole();
// Vue.use(vConsole)

Vue.use(VueJsonp);
Vue.use(CouponToastBox);
Vue.use(VueClipboard);
Vue.use(ToastBox);
Vue.config.productionTip = false;

/**
 * @Description: 修复IOS点击困难
 */
FastClick.prototype.focus = function (targetElement) {
  var length;// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
  if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
    length = targetElement.value.length;
    targetElement.focus();
    targetElement.setSelectionRange(length, length);
  } else {
    targetElement.focus();
  }
};

FastClick.attach(document.body);

//dev数据
// if(process.env.NODE_ENV === 'development'){
//   window.infoData = {
//     merchantId: 281,
//     merchantName: '测试账户',
//     privilegePageUuid: '77edb035b1c04e2fac1658c7081d1423',
//     openingPageUuid: '',
//   }
//   // document.cookie = "QY_COOKIE_PASSPORT_NAME="+"\"sessionId=5d4d7a3867bd42a2b50d98202ab80676&userId=113\""
// }

//添加focus指令
Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})


//添加百度统计
router.beforeEach((to, from, next) => {
  if (to.path) {
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
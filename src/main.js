
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

FastClick.attach(document.body);

//测试使用数据
if(process.env.NODE_ENV === 'development'){
  window.infoData = {
    merchant: 'test',
    merchantId: 281,
    merchantName: '汪汪黑卡',
    pageKeyName: 'new_shop_tequan',
    privilegePageUuid: '8641a752ac4c40bfa696399d9706b0df',//
    openingPageUuid: '',
  }
  document.cookie = "QY_COOKIE_PASSPORT_NAME="+"\"sessionId=1ad8061697657497b42cf1f9b7b907fc&userId=77\""
}

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
      window._hmt.push(['_trackPageview', '/?#' + to.fullPath]);
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
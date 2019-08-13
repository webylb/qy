
import toast from '../../base/coupon-toast/coupon-toast.vue' //引入toast模版

const CouponToastBox = {};
CouponToastBox.install = function (Vue,option) {
  const ToastBoxInstance = Vue.extend(toast)
  let currentToast;
  const initInstance=()=>{
    currentToast = new ToastBoxInstance()
    let toastBoxEl=currentToast.$mount().$el
    document.body.appendChild(toastBoxEl)
  }
  Vue.prototype.$couponToastBox = {
    showToastBox (options){
      if (!currentToast) {
        initInstance()
      }
      currentToast.content=options
      return currentToast.showToastBox()
    },
    hideToastBox (options){
      if (!currentToast) {
        initInstance()
      }
      currentToast.content=options
      return currentToast.hideToastBox()
    }
  }
};
export default CouponToastBox

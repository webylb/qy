
import toast from '../../base/toast/toast.vue' //引入toast模版

const ToastBox = {};
ToastBox.install = function (Vue,option) {
  const ToastBoxInstance = Vue.extend(toast)
  let currentToast;
  const initInstance=()=>{
    currentToast = new ToastBoxInstance()
    let toastBoxEl=currentToast.$mount().$el
    document.body.appendChild(toastBoxEl)
  }
  Vue.prototype.$toastBox = {
    showToastBox (options){
      if (!currentToast) {
        initInstance()
      }
      currentToast.content=options
      return currentToast.showToastBox()
    }
  }
};
export default ToastBox

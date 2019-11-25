import Vue from 'vue'
import { Toast } from 'vant'
import axios from 'axios'
import qs from 'qs'
import router from '../../router'
import * as core from '../../api/getLoginAndOpenVip'
import tool from './util'

Vue.use(Toast)

const http = axios.create({
  timeout: 1000 * 30,
  withCredentials: true
})

let pending = [] // 发生请求url的数组

let isPending = url => pending.includes(url) //  检测是否正在发生请求

let removePending = url => {
  let index = pending.findIndex(item => item === url)
  pending.splice(index, 1)
}

http.interceptors.request.use(config => {
  if(!config.headers.noIntercept && isPending(config.url)){
    Toast('拼命请求中...')
    return Promise.reject(new Error("重复请求已被拦截!"))
  }
  if(config.data) {
    if(config.headers['Content-Type']){
      if(config.headers['Content-Type'] !== 'multipart/form-data' ){
        config.data = JSON.stringify(config.data)
      }
    } else {
      config.data = qs.stringify(config.data)
    }
  }
  pending.push(config.url)
  return config
}, error => {
  return Promise.reject(error)
})

http.interceptors.response.use(response => {
  removePending(response.config.url)
  if(response.data && response.data.code === '01' && response.data.isLogin === false){
    Toast(response.data.message)
    core.getLoginUrl({merchantId: window.infoData.merchantId}).then(res => {
      //console.log(res)
      if(res.code && '00' == res.code){
        if(res.result && res.result.url){
          window.location.href = res.result.url + "?referer=" + encodeURIComponent(tool.replaceUrlForUrpass(window.location.href))
        }else {
          this.$router.push('/login')
        }
      } else {
        Toast(res.message)
      }
    }).catch(error => {
      Toast("网络错误")
    })
    // let timer = null
    // clearTimeout(timer)
    // timer = setTimeout(() => {
    //   router.push('/login')
    // }, 200)
  }
  return response
}, error => {
  pending = []
  return Promise.reject(error)
})

export default {
  get: function(url, data){
    return http({method: 'GET', url, data})
  },
  post: function(url, data, params){
    if(params && params.contentType){
      return http({method: 'POST', url, data, headers: {'Content-Type':'application/json; charset=utf-8'}}) //转为json串
    }else if(params && params.formData){
      return http({method: 'POST', url, data, headers: {'Content-Type':'multipart/form-data'}}) //上传excel
    }else if(params && params.responseType){
      return http({method: 'POST', url, data, responseType: 'blob'}) //下载excel文件流
    }else{
      return http({method: 'POST', url, data}) //正常qs
    }
  }
}
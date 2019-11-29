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

http.interceptors.request.use(request => {
  // console.log(request)
  if(!request.headers.noIntercept && isPending(request.url)){
    Toast('拼命请求中...')
    return Promise.reject(new Error("重复请求已被拦截!"))
  }
  if(request.data) {
    if(request.headers['Content-Type'] && request.headers['Content-Type'] === 'application/json;charset=utf-8'){
      request.data = JSON.stringify(request.data)
    } else {
      request.data = qs.stringify(request.data)
    }
  }
  pending.push(request.url)
  return request
}, error => {
  return Promise.reject(error)
})

http.interceptors.response.use(response => {
  // console.log(response)
  removePending(response.config.url)
  if(response.data && response.data.code === '01' && response.data.isLogin === 'false'){
    Toast(response.data.message)
    core.getLoginUrl({merchantId: window.infoData.merchantId}).then(res => {
      if(res.code && '00' == res.code){
        if(res.result && res.result.url){
          window.location.href = res.result.url + "?referer=" + encodeURIComponent(tool.replaceUrlForUrpass(window.location.href))
        } else {
          router.push('/login')
        }
      } else {
        Toast(res.message)
      }
    }).catch(error => {
      Toast("网络错误")
    })
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
    console.log(params)
    if(params && params.contentType === 'json'){
      return http({method: 'POST', url, data, headers: {'Content-Type':'application/json;charset=utf-8'}}) //转为json串
    }else{
      return http({method: 'POST', url, data}) //正常qs
    }
  }
}
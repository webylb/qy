<template>
  <div class="coupon-bag">
    <shop-header ref="shopHeader" v-if="showHeader" style="position: absolute;top:0;left: 0;z-index: 999" line-style="background:#fff" :title="title"></shop-header>
    <div :style="couponBagStyle" class="coupon-bag-content" ref="couponBagContent">
      <div class="cont">
        <div v-show="!loaded" class="cont-wrap">
          <div class="coupon-top-img">
            <img src="./images/top.png" alt="" @load="onLoaded">
            <div class="timer-wrap">
              <p class="timer-text">距福利结束还剩</p>
              <div class="timer-num" ref="timerNum">
                <span class="num">{{ countDownList.day }}</span>
                <span class="text">天</span>
                <span class="num">{{ countDownList.hou }}</span>
                <span class="text">时</span>
                <span class="num">{{ countDownList.min }}</span>
                <span class="text">分</span>
                <span class="num">{{ countDownList.sec }}</span>
                <span class="text">秒</span>
              </div>

            </div>
            <div class="gif" @click="goOpenMember">
              <img src="./images/top.gif" alt="">
            </div>
          </div>
          <div class="coupon-bag-list">
            <!-- <div class="top-banner">
              <img :src="bannerImageUrl" alt="" @load="onLoaded">
            </div> -->
            <div class="coupon-bag-item" v-for="(item, index) in allData" :key="index">
              <div class="top-img">
                <!-- <img v-if="index%5 == 0" src="./images/1.png" alt="">
                <img v-else-if="index%5 == 1" src="./images/2.png" alt="">
                <img v-else-if="index%5 == 2" src="./images/3.png" alt="">
                <img v-else-if="index%5 == 3" src="./images/4.png" alt="">
                <img v-else-if="index%5 == 4" src="./images/5.png" alt=""> -->
                <div class="top-title">{{ item.categoryName }}</div>
              </div>
              <div class="prod-wrap" v-if="item.ticketType == 'ShangPinQuan'">
                <div class="prod-item" v-for="(i, index) in item.userticketDetails" :key="index">
                  <div class="prod-attr">
                    <img @load="onLoaded" class="" :src="i.ticketImageUrl" />
                    <div>
                      <p class="item-name">【{{ i.itemName }}】</p>
                      <p class="sku-name">{{ i.skuName }}</p>
                      <p class="ticket-name">{{ i.count }}张</p>
                    </div>
                  </div>
                  <div>
                    <button type="button" @click.stop="receive(item.ticketType, i.ticketId)">立即领取</button>
                  </div>
                </div>
              </div>
              <div class="slider-wrap" v-else>
                <slider v-if="item.showType == 'ShuangHangZhanShi'" class="slider-double-content" :loop="false" :auto-play="false">
                  <div class="slider-double-item slider-page" v-for="(i, index) in item.couponList" :key="index">
                    <div class="slider-item" v-for="(single,index) in i" :key="index" @click.stop="receive(item.ticketType, single.ticketId)">
                      <div>
                        <img @load="onLoaded" class="" :src="single.ticketImageUrl" />
                      </div>
                      <p class="item-name">【{{ single.itemName }}】</p>
                      <p class="sku-name">{{ single.skuName }}</p>
                      <p class="ticket-name">{{ single.count }}张</p>
                    </div>
                  </div>
                </slider>
                <slider v-else class="slider-single-content" :loop="false" :auto-play="false">
                  <div class="slider-single-item  slider-page" v-for="(i, index) in item.couponList" :key="index">
                    <div class="slider-item" v-for="(single,index) in i" :key="index" @click.stop="receive(item.ticketType, single.ticketId)">
                      <div>
                        <img @load="onLoaded" class="" :src="single.ticketImageUrl" />
                      </div>
                      <p class="item-name">【{{ single.itemName }}】</p>
                      <p class="sku-name">{{ single.skuName }}</p>
                      <p class="ticket-name">{{ single.count }}张</p>
                    </div>
                    <div v-if="i.length == 2" class="slider-item">
                      <div class="default-prd">
                        <img @load="onLoaded" class="" src="./images/default-prd.png" />
                      </div>
                    </div>
                  </div>
                </slider>
              </div>
            </div>
            <div class="customer-service">
              <a href="tel:4006680091"><i class="iconfont">&#xe629;</i> 客服电话: 4006680091</a>
            </div>
          </div>

        </div>
        <loading v-show="loaded" style="padding-top: 50%"></loading>
      </div>
    </div>
    <div class="go-order-form fiexd-top" v-if="!loaded" @click="goOrderForm">
      <div>订单</div>
    </div>
    <div class="go-my-coupon fiexd-top" v-if="!loaded" @click="goMyCoupon">
      <div>卡券</div>
    </div>
    <div class="go-exchange-coupon" v-if="exchargeStatus" @click="openExcharge">
      <img src="./images/go-exchange.png" alt="">
    </div>
    <div class="content-wrap fade" v-show="couponBagToast" @click="closeCouponBagToast"></div>
    <div class="coupon-bag-toast" ref="couponBagToast">
      <div class="coupon-bag-toast-wrap" v-if="itemCouponDetail">
        <div class="coupon-bag-toast-title">
          <div class="left-line"></div>
          <div class="title-text">
            【{{ itemCouponDetail.itemName }}】
          </div>
          <div class="right-line"></div>
        </div>
        <div class="coupon-bag-toast-sub-title" v-if="itemCouponDetail.ticketType == 'DiJiaQuan'">
          <div class="title-text">
            {{ itemCouponDetail.skuName }}
          </div>
        </div>
        <div class="coupon-bag-toast-sub-title coupon-bag-toast-sub-title2">
          <div class="title-text">
            {{ itemCouponDetail.ticketName }}
          </div>
        </div>
        <div class="img-list">
          <div v-if="itemCouponDetail.count > 1">
            <slider class="slider-toast-warp" :loop="false" :auto-play="false" ref="toastSlider">
              <div class="slider-toast-page" v-for="(item, index) in itemCouponDetail.couponList" :key="index">
                <div class="slider-toast-item" v-for="(i, index2) in item" :key="index2">
                  <div class="default-coupon" :class="[index2 == useIndex && index == usePageIndex ? 'actice-coupon' : '',i.isUsed == 'N' ? '' : 'used-coupon']">
                    <div class="used" v-if="i.isUsed == 'Y'">
                        <div class="used-text">已使用</div>
                        <div class="used-time">
                          {{ formatDate(i.useTime) }}
                        </div>
                    </div>
                    <img :src="itemCouponDetail.ticketImageUrl" alt="">
                    <span></span>
                  </div>
                </div>
              </div>
            </slider>
          </div>
          <div v-else class="single-coupon" :class="[itemCouponDetail.recordResults[0].isUsed == 'N' ? 'actice-coupon' : 'used-coupon']">
            <div class="used" v-if="itemCouponDetail.recordResults[0].isUsed == 'Y'">
                <div class="used-text">已使用</div>
                <div class="used-time">
                  {{ formatDate(itemCouponDetail.recordResults[0].useTime) }}
                </div>
            </div>
            <img :src="itemCouponDetail.ticketImageUrl" alt="">
            <span></span>
          </div>
        </div>
        <div class="instructions" v-html="itemCouponDetail.instructions">
          <!-- <p><span>※</span>使用说明</p>
          <p>1.本商品使用过后将无法二次使用</p>
          <p>2.单抵扣券只能购买单个商品，购买过后将在卡券中展示。</p> -->
        </div>
        <div class="use-btn">
          <button  v-if="itemCouponDetail.count > 1" type="button" @click="goUse()">前去使用</button>
          <button  v-else type="button" @click="goUse(itemCouponDetail.recordResults[0].receiveImmediatelyUrl)">前去使用</button>
        </div>
      </div>
    </div>
    <div class="exchange-popup fade" v-show="exchargeOpen">
      <div class="exchange-content">
        <div class="exchange-open-top">
          <input type="text" v-model="exchargeInput" @click.stop="focusInput"  @blur="scrollToTop" class="exchange-input" placeholder="请输入兑换码" />
          <p class="exchange-btnWrap">
            <button type="button" class="exchange-btn" @click="goExcharge">立即兑换</button>
          </p>
        </div>
        <div class="exchange-open-close" @click="hideExchargePopup">
          <i class="iconfont">&#xe63f;</i>
        </div>
      </div>
    </div>
    <div class="exchange-popup fade" v-show="exchargeInfoOpen">
      <div class="exchange-content">
        <div class="exchange-open-top">
          <p class="exchange-info-title">{{ exchargeInfoTitle }}</p>
          <p class="exchange-info-text">{{ exchargeInfoText }}</p>
          <p class="exchange-btnWrap">
            <button type="button" class="exchange-btn" @click.prevent="sureExcharge">我知道了</button>
          </p>
        </div>
        <div class="exchange-open-close" @click="hideExchargePopup">
          <i class="iconfont">&#xe63f;</i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll  from 'better-scroll'
  import ShopHeader from '../../base/shop-header/shop-header'
  import Slider from '../../base/slider/slider'
  import Loading from '../../base/loading/loading'
  import * as core from '../../api/couponBag'
  import tool from '../../common/js/util'
  import wxShareMixin from '../../common/js/wxShareMixin'

  export default {
    name: 'couponBag',
    components: {
      ShopHeader,
      Slider,
      Loading
    },
    mixins:[wxShareMixin],
    data () {
      return {
        merchantId: window.infoData.merchantId,
        packageId: '',
        loaded: true,
        bannerImageUrl: null,
        allData: [],
        itemCouponDetail: null,
        toastTitle: '',
        toastSkuname: '',
        toastTicketName: '',
        useIndex: 0,
        usePageIndex: 0,
        useCode: null,
        couponBagToast: false,
        showHeader: false,
        activeType: null,

        exchargeOpen: false,
        exchargeInput: null,
        exchargeInfoOpen: false,
        exchargeInfoTitle: '兑换成功',
        exchargeInfoText: '',
        exchargeStatus: null,

        shareUrl: location.href.split('#')[0],
        shareLink:  window.location.href.split("#")[0]+'?#'+window.location.href.split("#")[1],  //分享出去的链接
        shareTitle: '',  //分享的标题
        shareDesc: '', //分享的详情介绍
        shareImgUrl: '',
        okLink: null,
        countDownList: { day: '00',hou: '00',min: '00',sec: '00' },
        nowTime: null,
        expTime: null,
        openMemberExpTime: null,
        openStatus: null
      }
    },
    created () {
      document.title = this.$route.meta.title
      //判断是否为微信
      let ua = navigator.userAgent.toLowerCase();
      let isWeixin = ua.indexOf('micromessenger') != -1;
      if (!isWeixin) {
        this.showHeader=false
        this.couponBagStyle = "top:0rem"
      } else {
        this.showHeader=false
        this.couponBagStyle = "top:0rem"
      }
      //微信分享
      this.getShare();
      if(this.$route.query.packageId){
        this.packageId = this.$route.query.packageId
        this.getCouponBagDetail({merchantId: this.merchantId, packageId: this.packageId})
      }else{
        this.$toastBox.showToastBox('无效礼包')
      }
      if(this.$route.query.packageConfigId){
        this.getCouponBagInfo({packageConfigId: this.$route.query.packageConfigId})
      }
    },
    watch:{
      exchargeOpen(){
        window.scrollBy(0,1)
      },
      exchargeInfoOpen(){
        window.scrollBy(0,1)
      }
    },
    mounted(){
      this.$nextTick(()=>{
        this._initScroll()
        setTimeout(() => {
          this.initHeight()
        }, 1000)
      });
    },
    methods: {
      initHeight(){
        this.scroll.refresh()
      },
      formatDate(val){
        return tool.formatDate(val,1)
      },
      _initScroll () {
        // 创建分类列表的Scroll对象
        this.$nextTick(()=>{
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.couponBagContent,{
                probeType: 3,
                startY: 0,
                bounce: false,
                click: true
              })
            }else{
              this.scroll.refresh()
            }
        })
      },
      getCouponBagInfo(opts){
        core.getCouponBagTimer(opts).then(res => {
          if(res.code && '00' == res.code){
            //console.log(res)
            this.nowTime = res.result.nowTime
            this.expTime = res.result.xinShouLiBaoExpirationTime
            this.countDown()
            this.openMemberExpTime = res.result.xinShouLiBaoExpirationTime
            this.getOpenStatus()
          }else {
            this.loaded = false
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(error => {
          this.loaded = false
          this.$toastBox.showToastBox("网络错误")
        })
      },
      getCouponBagDetail(opts){
        core.getCouponBagDetail(opts).then(res => {
          //console.log(res)
          if(res.code && '00' == res.code){
            this.bannerImageUrl = res.result.merchantGiftPackageBannerImageUrl
            //this.exchargeStatus = res.result.receive

            const data = res.result.userCategoryDetails
            for(let i = 0, length = data.length; i < length; i++){
              if(data[i].ticketType == 'DiJiaQuan' && data[i].userticketDetails && data[i].userticketDetails.length > 0){
                if(data[i].showType == 'ShuangHangZhanShi'){
                  data[i].couponList = []
                  for (let j = 0; j < Math.ceil(data[i].userticketDetails.length / 6); j++) {
                    data[i].couponList.push([])
                    data[i].couponList[j] = data[i].userticketDetails.slice(j * 6, j * 6 + 6)
                  }
                }else{
                  data[i].couponList = []
                  for (let j = 0; j < Math.ceil(data[i].userticketDetails.length / 3); j++) {
                    data[i].couponList.push([])
                    data[i].couponList[j] = data[i].userticketDetails.slice(j * 3, j * 3 + 3)
                  }
                }
              }
            }
            this.allData = data
            this.$nextTick(() => {
              this.loaded = false
            })
          } else {
            this.loaded = false
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(error => {
          this.loaded = false
          this.$toastBox.showToastBox("网络错误")
        })
      },
      goMyCoupon() {
        this.$router.push("/myCoupon")
      },
      goOrderForm(){
        this.$router.push("/orderForm")
      },
      receive(type,id){
        this.activeType = type
        this.getItemCouponDetail({merchantId: this.merchantId, ticketId: id, packageId: this.packageId})
      },
      getItemCouponDetail(opts){
        this.itemCouponDetail = null
        core.getItemCouponDetail(opts).then(res => {
          //console.log(res)
          if(res.code && '00' == res.code){
            const data = res.result
            let activeIndex = 0
            let pageIndex = 0
            if(data.count > 1 && data.ticketType == 'DiJiaQuan'){
              data.couponList = []
              for (let j = 0; j < Math.ceil(data.recordResults.length / 6); j++) {
                data.couponList.push([])
                data.couponList[j] = data.recordResults.slice(j * 6, j * 6 + 6)
              }
              for (let i = 0, length = data.recordResults.length; i < length; i ++) {
                if(data.recordResults[i].isUsed == 'Y'){
                  activeIndex += 1
                }
              }
              if(activeIndex > 6){
                pageIndex = Math.ceil(activeIndex / 6)
              }
            }else if(data.count == 1 && data.ticketType == 'DiJiaQuan'){
              if(data.recordResults[0].isUsed == 'Y'){
                activeIndex = null
              }else{
                activeIndex = 0
              }
              pageIndex = 1
            }

            this.itemCouponDetail = data
            this.useIndex = activeIndex
            this.usePageIndex = pageIndex
            if(data.recordResults[activeIndex]){
              this.useCode = data.recordResults[activeIndex].code
            }
            this.openCouponBagToast()
            if(pageIndex > 1){
              let timer = null
              clearTimeout(timer)
              timer = setTimeout(() => {
                this.$refs.toastSlider.goToPage(pageIndex)
              }, 20)
            }
          } else if(res.code && '01' === res.code && res.isLogin == 'false'){
            // this.$toastBox.showToastBox('未登录用户')
            // let timer = null
            // clearTimeout(timer)
            // timer = setTimeout(()=>{
            //   if(res.url){
            //     var index = res.url.lastIndexOf("\/");
            //     var str = res.url.substring(index, res.url.length);
            //     let regIndex = /\?/gi;
            //     if(str && regIndex.test(str)){
            //       window.location.href = res.url + "&referer=" + encodeURIComponent(tool.replaceUrlForUrpass(window.location.href))
            //       clearTimeout(timer)
            //     }else{
            //       window.location.href = res.url + "?referer=" + encodeURIComponent(tool.replaceUrlForUrpass(window.location.href))
            //       clearTimeout(timer)
            //     }
            //   }
            // },1000)
            this.getLoginUrl();
          } else if(res.code && '100' === res.code){
            this.exchargeInfoOpen = true
            this.exchargeInfoTitle = '温馨提示'
            this.exchargeInfoText = '很遗憾，您还未拥有此券包请前去激活后再使用'
          } else {
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(error => {
          console.log(error)
          this.$toastBox.showToastBox("网络错误")
        })
      },
      goUse(url){
        if(this.activeType == 'DiJiaQuan'){
          if(this.useCode){
            this.$router.push({path:"/couponBagGoods",query:{code: this.useCode, packageId: this.packageId}})
          }else{
            this.$toastBox.showToastBox("已使用")
          }
        }else{
          if (url) {
            let reg = /\?/
            if(reg.test(url)){
              window.location.href = tool.replaceUrlMerchantId(url + "&code=" + this.useCode, this.merchantId)
            }else{
              window.location.href = tool.replaceUrlMerchantId(url + "?code=" + this.useCode, this.merchantId)
            }
          }
        }
      },
      avg(a){
        let res= (a).toFixed(2)
        return res
      },
      openCouponBagToast(){
        this.couponBagToast = true
        this.$refs.couponBagToast.style.bottom = "0"
        this.$refs.couponBagToast.style.transition = "bottom 0.5s ease"
      },
      closeCouponBagToast(){
        this.$refs.couponBagToast.style.bottom = "-100%"
        this.$refs.couponBagToast.style.transition = "bottom 0.5s ease"
        this.couponBagToast = false
      },
      onLoaded(){
        this.scroll.refresh()
      },
      scrollToTop(){
        window.scrollBy(0,10)
      },
      focusInput(e){
        e.target.focus()
      },
      hideExchargePopup(){
        this.exchargeOpen = false
        this.exchargeInfoOpen = false
        this.exchargeInput = null
        window.scrollBy(0,10)
      },
      openExcharge(){
        this.exchargeOpen = true
      },
      goExcharge(){
        if(this.exchargeInput){
          core.exchargeCouponBag({redeemCode: this.exchargeInput,packageId: this.packageId}).then(res => {
            console.log(res)
            if(res.code && '00' == res.code){
              this.exchargeOpen = false
              this.exchargeInfoOpen = true
              this.exchargeInfoTitle = '兑换成功'
              this.exchargeInfoText = '恭喜你兑换成功,请前去体验~'
              this.exchargeInput = null
            } else if(res.code && '01' === res.code && res.isLogin == 'false'){
              // if(res.url){
              //   var index = res.url.lastIndexOf("\/");
              //   var str = res.url.substring(index, res.url.length);
              //   let regIndex = /\?/gi;
              //   if(str && regIndex.test(str)){
              //     window.location.href = res.url + "&referer=" + encodeURIComponent(tool.replaceUrlForUrpass(window.location.href))
              //   }else{
              //     window.location.href = res.url + "?referer=" + encodeURIComponent(tool.replaceUrlForUrpass(window.location.href))
              //   }
              // }
              this.getLoginUrl()
              this.exchargeOpen = false
              this.exchargeInfoOpen = true
              this.exchargeInfoTitle = '兑换失败'
              this.exchargeInfoText = res.message
              this.exchargeInput = null
            } else {
              this.exchargeOpen = false
              this.exchargeInfoOpen = true
              this.exchargeInfoTitle = '兑换失败'
              this.exchargeInfoText = res.message
              this.exchargeInput = null
            }
          }).catch(error => {
            this.exchargeOpen = false
            this.exchargeInfoOpen = true
            this.exchargeInfoTitle = '兑换失败'
            this.exchargeInfoText = "网络错误"
            this.exchargeInput = null
          })
        }else{
          this.$toastBox.showToastBox('请输入兑换码')
        }
      },
      sureExcharge(){
        this.exchargeInfoOpen = false
        if(this.okLink){
          window.location.href = this.okLink + "?referer="+ encodeURIComponent(window.location.href)
          this.okLink = ''
        }else{
          this.getCouponBagDetail({merchantId: this.merchantId, packageId: this.packageId})
        }
      },
      timeFormat(param) {
        return param < 10 ? '0' + param : param;
      },
      countDown() {
        var interval = setInterval(() => {
          // 获取当前时间，同时得到活动结束时间数组
          let newTime = this.nowTime;
          // 对结束时间进行处理渲染到页面
          let endTime = this.expTime;
          let obj = null;
          // 如果活动未结束，对时间进行处理
          if (endTime - newTime > 0) {
            let time = (endTime - newTime) / 1000;
            // 获取天、时、分、秒
            let day = parseInt(time / (60 * 60 * 24));
            let hou = parseInt(time % (60 * 60 * 24) / 3600);
            let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
            let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
            obj = {
              day: this.timeFormat(day),
              hou: this.timeFormat(hou),
              min: this.timeFormat(min),
              sec: this.timeFormat(sec)
            };
          } else { // 活动已结束，全部设置为'00'
            obj = {
              day: '00',
              hou: '00',
              min: '00',
              sec: '00'
            };
            clearInterval(interval);
          }
          this.countDownList = obj;
          this.$refs.timerNum.style.opacity = "1"
          this.$refs.timerNum.style.transition = "opacity 0.3s ease"
          this.nowTime = newTime + 1000
        }, 1000);
      },
      getOpenStatus() {
        var interval = setInterval(() => {
          // 获取当前时间，同时得到活动结束时间数组
          let newTime = this.nowTime;
          // 对结束时间进行处理渲染到页面
          let endTime = this.openMemberExpTime;
          let obj = null;
          // 如果活动未结束，对时间进行处理
          if (endTime - newTime > 0) {
            this.openStatus = 1
          } else { // 活动已结束，全部设置为'0'
            this.openStatus = 0
            clearInterval(interval);
          }
          this.nowTime = newTime + 1000
        }, 1000);
      },
      goOpenMember() {
        if(!this.openStatus){
          this.$toastBox.showToastBox('页面加载中,请稍后...')
          return false
        }
        core.getOpenMemberUrl({merchantId: this.merchantId}).then(res => {
          if(res.code && '00' == res.code){
            if(res.result){
              window.location.href = res.result + '?openStatus=' + this.openStatus
            }
          }else {
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(error => {
          this.$toastBox.showToastBox("网络错误")
        })
      },
      getLoginUrl(){
        core.getLoginUrl({merchantId: this.merchantId}).then(res => {
          //console.log(res)
          if(res.code && '00' == res.code){
            if(res.result && res.result.url){
              window.location.href = res.result.url + "?referer=" + encodeURIComponent(tool.replaceUrlForUrpass(window.location.href))
            }else {
              this.$router.push('/login')
            }
          } else {
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(error => {
          this.$toastBox.showToastBox("网络错误")
        })
      }
    }
  }
</script>


<style lang="stylus" rel="stylesheet/stylus" scoped>
.coupon-bag
  background-color #fff
  .coupon-bag-content
    position fixed
    left 0
    top 0
    bottom 0
    right 0
    background #ff855e
    overflow hidden
    max-width 750PX
    .cont
      .coupon-top-img
        position relative
        img
          display block
          width 100%
          height auto
        .timer-wrap
          position absolute
          top 8.625rem
          left 0
          width 100%
          text-align center
          .timer-text
            color #fff
            margin-bottom 0.5rem
            font-size 0.8125rem
	          letter-spacing 0.1625rem
          .timer-num
            opacity 0.2
            width 15.75rem
            height 1.9375rem
            line-height 1.9375rem
            margin 0 auto
            color #f5eccd
            display flex
            justify-content center
            align-items baseline
            background transparent url('./images/timer.png') no-repeat center
            background-size 100% 100%
            -moz-box-shadow:0px 3px 2px #f2401f;
            -webkit-box-shadow:0px 3px 2px #f2401f;
            box-shadow:0px 3px 2px #f2401f;
            border-radius 1rem
            span
              display block
            .num
              font-size 1.125rem
              letter-spacing 0
            .text
              font-size: 0.75rem
              margin 0 0.625rem 0 0.375rem
              &:last-child
                margin-right 0
        .gif
          position absolute
          bottom 0
          left 0
          width 100%
          img
            width 100%
            height auto

      .coupon-bag-list
        width 100%
        padding 0 0.75rem
        box-sizing border-box
        min-height 1rem
        padding-top 0.94rem
        padding-bottom 3.125rem
        background: -webkit-linear-gradient(150deg, #ff4a30, #ff855e); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(150deg, #ff4a30, #ff855e); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(150deg, #ff4a30, #ff855e); /* Firefox 3.6 - 15 */
        background: linear-gradient(150deg, #ff4a30, #ff855e); /* 标准的语法 */
        .top-banner
          width 100%
          margin-bottom 0.938rem
          border-radius 0.5rem
          overflow hidden
          img
            width 100%
            height auto
        .coupon-bag-item
          width 100%
          border-radius 0.5rem
          overflow hidden
          margin-bottom 0.938rem
          background-color #ffffff
          .top-img
            width 100%
            height auto
            position relative
            height 3.13rem;
            background:rgba(248,205,147,1);
            &::after
              content ""
              position absolute
              bottom 0
              left 1.25rem
              width 0
              hieght 0
              border 0.5rem solid transparent
              border-bottom 0.5rem solid #fff
            img
              width 100%
              height auto
            .top-title
              position absolute
              left 1.25rem
              top 50%
              transform translateY(-50%)
              font-size 1.3125rem
              color #ffffff
              font-weight 600

          .prod-wrap
            min-height 1rem
            padding-top 0.25rem
            .prod-item
              padding 1.25rem 0.938rem
              box-sizing border-box
              border-bottom 0.031rem solid #eeeeee
              display flex
              justify-content space-between
              align-items center
              &:last-child
                border none

              .prod-attr
                flex 1
                display flex
                justify-content flex-start
                margin-right 0.594rem
                img
                  width 4.375rem
                  height 4.375rem
                  margin-right 0.594rem
                div
                  position relative
                  width 9.9rem
                  p
                    white-space nowrap
                    overflow hidden
                    text-overflow ellipsis
                  .item-name
                    position relative
                    font-size 0.813rem
                    color #666666
                    font-weight bold
                    height auto
                    padding-top 0.281rem
                    left -0.4rem
                  .sku-name
                    font-size 0.9375rem
                    color #fea100
                    margin 0.3rem 0
                    font-weight  bold
                    height auto
                    padding 0.1rem 0
                    line-height 1.2
                  .ticket-name
                    position absolute
                    bottom 0.219rem
                    left 0
                    font-size 0.875rem
                    color #b78231
                    padding-top 0.1rem

              button
                min-width 4.5rem
                border none
                border-radius 1rem
                outline none
                color #fff
                font-size 0.813rem
                letter-spacing 0.02rem
                height 1.625rem
                padding 0 0.625rem
                box-sizing border-box
                background-color #b78231
                box-shadow 0rem 0.125rem 0.313rem 0rem rgba(183, 130, 49, 0.36)

          .slider-wrap
            min-height 1rem
            padding 0.25rem 0 0.75rem 0
            position relative
            .slider-page
              display flex
              justify-content flex-start
              padding 0 0.05%
              flex-wrap wrap
              .slider-item
                width 33.3%
                padding 0.938rem 0
                text-align center
                img
                  max-width 100%
                  height 4.375rem
                  width auto
                  margin 0 auto
                p
                  white-space nowrap
                  overflow hidden
                  text-overflow ellipsis
                .item-name
                  font-size 0.813rem
                  color #666666
                  font-weight bold
                  margin-top 0.983rem
                  height auto
                  padding-top 0.15rem
                .sku-name
                  font-size 0.9375rem
                  color #fea100
                  margin 0.35rem 0
                  font-weight  bold
                  height auto
                  padding 0.1rem 0
                  line-height 1.2
                .ticket-name
                  font-size 0.875rem
                  color #b78231
                  padding-top 0.1rem
                .default-prd
                  height 9.063rem
                  img
                    height 100%
                    width auto
      .customer-service
        width 100%
        a
          display block
          width 100%
          height 3.75rem
          line-height 3.75rem
          background-color #fae8d1
          border-radius 0.5rem
          color #b78231
          font-size 1rem
          text-align center

  .fiexd-top
    position fixed
    top 22.469rem
    right 1.375rem
    width: 3rem;
    height: 3rem;
    background-color: #feedcb;
    box-shadow: 0rem 0.188rem 0.563rem 0rem #f4cda5;
    border: solid 0.063rem #c9a570;
    border-radius 50%
    display flex
    justify-content center
    align-items center
    font-size 0.875rem
    color #b78231
  .go-my-coupon
    top 26.219rem

  .go-exchange-coupon
    position fixed
    bottom 8.188rem
    right 0
    width 7.375rem
    img
      width 100%
      height auto
  // 弹窗遮罩
  .content-wrap
    position fixed
    left 0
    top 0
    right 0
    bottom 0
    max-width 750PX
    z-index 100
    background rgba(0,0,0,.4)

  //底部弹出content
  .coupon-bag-toast
    position fixed
    bottom -100%
    left 0
    text-align center
    width 100%
    max-width 750PX
    z-index 101

    .coupon-bag-toast-wrap
      height 100%
      width 100%
      max-width 750PX
      background #fff
      border-radius 0.5rem 0.5rem 0rem 0rem
      padding-top 1.25rem
      box-sizing border-box
      .coupon-bag-toast-title
        height 1rem
        display flex
        justify-content flex-start
        align-items center
        margin-bottom 0.625rem
        box-sizing border-box
        padding 0 0.75rem
        .right-line, .left-line
          flex 1
          height 1px
          background #b78231
        .title-text
          font-size 1rem
          font-weight bold
          line-height 1.375rem
          letter-spacing 0rem
          color #b78231
          text-align center

      .coupon-bag-toast-sub-title
        margin-bottom 0.625rem

      .coupon-bag-toast-sub-title2
        color #999999
        font-size 0.875rem

      .img-list
        margin-top 1.128rem
        position relative
        padding 0.5rem 0
        .single-coupon
          border: solid 0.063rem #eee;
          margin 0 auto
          text-align center
          height 4.406rem
          width 6.594rem
          border-radius: 0.25rem;
          position relative
          overflow hidden
          img
            width auto
            height 4.406rem
          .used
            position absolute
            left 0
            top 0
            width 100%
            height 100%
            z-index 1
            .used-text
              position absolute
              left 50%
              top 0.469rem
              width 2.5rem
              height 2.5rem
              line-height 2.5rem
              text-align center
              transform translateX(-50%)
              color #fff
              background rgba(0,0,0,0.5)
              border-radius 50%
              font-size 0.688rem
            .used-time
              position absolute
              left 0
              bottom 0
              height 1rem
              line-height 1rem
              width 100%
              color #fff
              background rgba(0,0,0,0.5)
              font-size  0.625rem
        .actice-coupon
          border: solid 0.063rem #feac36;
          span
            position absolute
            right 0.313rem
            bottom 0.313rem
            width 1.156rem
            height 1.156rem
            background url('./images/check.png') no-repeat center
            background-size 100% 100%
        .used-coupon
          opacity 0.5
        .slider-toast-warp
          .slider-toast-page
            width 100%
            display flex
            justify-content flex-start
            flex-wrap wrap
            box-sizing border-box
            padding 0 0.75rem
            .slider-toast-item
              margin 0 0.26rem
              margin-bottom 0.9rem
              height 4.406rem
              width 6.594rem
              .default-coupon
                border: solid 0.063rem #eee;
                border-radius 0.25rem
                margin 0 auto
                overflow hidden
                position relative
                height 4.406rem
                width 6.594rem
                text-align center
                img
                  width auto
                  height 4.406rem
                  margin 0 auto
                .used
                  position absolute
                  left 0
                  top 0
                  width 100%
                  height 100%
                  z-index 1
                  .used-text
                    position absolute
                    left 50%
                    top 0.469rem
                    width 2.5rem
                    height 2.5rem
                    line-height 2.5rem
                    text-align center
                    transform translateX(-50%)
                    color #fff
                    background rgba(0,0,0,0.5)
                    border-radius 50%
                    font-size 0.688rem
                  .used-time
                    position absolute
                    left 0
                    bottom 0
                    height 1rem
                    line-height 1rem
                    width 100%
                    color #fff
                    background rgba(0,0,0,0.5)
                    font-size  0.625rem

              .actice-coupon
                position relative
                border: solid 0.063rem #feac36;
                box-sizing border-box
                span
                  position absolute
                  right 0.313rem
                  bottom 0.313rem
                  width 1.156rem
                  height 1.156rem
                  background url('./images/check.png') no-repeat center
                  background-size 100% 100%

      .instructions
        margin-top 1.875rem
        box-sizing border-box
        padding 0 0.75rem
        text-align left
        p
          line-height 1.375rem
          text-align left
          font-size 0.938rem
          color #333333
          &:first-child
            font-size 1rem
            span
              color #b78231
              margin-right 0.281rem
      .use-btn
        margin-top 3.563rem
        button
          outline none
          border none
          width 100%
          height 3.063rem
          background-image linear-gradient(90deg,#f6cf8d 0%,#fbe5b8 100%);
          color #2d2b32
          font-size 1.125rem
          font-weight bold

.exchange-popup
  position fixed
  bottom 0
  left 0
  right 0
  top 0
  background rgba(0,0,0,0.5)
  z-index 101
  .exchange-content
    min-height 1rem
    width 20rem
    position absolute
    left 50%
    top 50%
    transform translate(-50%,-50%)
    .exchange-open-top
      width 100%
      // height 10rem
      font-size 0
      background #fff
      border-radius 0.375rem
      text-align center
      display flex
      flex-direction column
      .exchange-input
        margin 0 auto
        margin-top 1.5rem
        margin-bottom 1.5rem
        height 2.75rem
        width 17.6875rem
        border solid 0.063rem #2d2b32
        border-radius 0.25rem
        outline none
        font-size 1.125rem
        padding-left 0.5rem
        box-sizing border-box
      .exchange-info-title
        width 100%
        text-align center
        font-size 1.125rem
        font-weight 600
        color rgb(51,51,51)
        margin-top 1.25rem
      .exchange-info-text
        width 100%
        text-align center
        font-size 1rem
        color rgb(102,102,102)
        margin 1.25rem 0
        padding: 0 0.75rem;
        box-sizing: border-box;
        line-height: 1.375rem;
      .exchange-btnWrap
        width 18.3125rem
        margin  0 auto
        margin-bottom 1rem
        .exchange-btn
          width 100%
          height 2.75rem
          line-height 2.75rem
          background #fae2b3
          color #333333
          text-align center
          font-size 1.125rem
          font-weight 600
          outline none
          border none
          border-radius 0.3125rem
    .exchange-open-close
      margin-top 1.25rem
      width 100%
      text-align center
      i
        color rgb(188,188,188)
        font-size 1.75rem


.instructions >>> p
  line-height 1.375rem
  text-align left
  font-size 1rem

.instructions >>> b
  font-weight bold !important

.instructions >>> strong
  font-weight bold



.fade  {
  -webkit-animation: fade 0.4s;
          animation: fade 0.4s;
}

@-webkit-keyframes fade {
  from {
    opacity 0
  }
  to {
    opacity 1
  }
}

@keyframes fade {
  from {
    opacity 0
  }
  to {
    opacity 1
  }
}

@-webkit-keyframes moveleft {
   from {
    margin-left 100%
  }
  to {
    margin-left 3.875rem
  }
}

@keyframes moveleft {
   from {
    margin-left 100%
  }
  to {
    margin-left 3.875rem
  }
}

</style>



<template>
  <div class="coupon-bag">
    <shop-header ref="shopHeader" v-if="showHeader" style="position: absolute;top:0;left: 0;z-index: 999" line-style="background:#fff" :title="title"></shop-header>
    <div :style="couponBagStyle" class="coupon-bag-content" ref="couponBagContent">
      <div class="cont">
        <div v-show="!loaded">
          <div class="coupon-top-img">
            <img src="./images/top.png" alt="" @load="onLoaded">
          </div>
          <div class="coupon-bag-list" ref="couponBagList">
            <div class="top-banner" @click="bannerClick">
              <img :src="bannerImageUrl" alt="" @load="onLoaded">
            </div>
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
                <div class="prod-item" v-for="(i, index) in item.userTicketDetails" :key="index">
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
                      <p class="ticket-name">{{ orderId ? '剩' : '共' }}{{ single.count }}张</p>
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
                      <p class="ticket-name">{{ orderId ? '剩' : '共' }}{{ single.count }}张</p>
                    </div>
                  </div>
                </slider>
              </div>
            </div>
          </div>
          <div class="customer-service">
            <!-- 客服电话：<a href="tel:4006680091">4006680091</a> 转 2 -->
            <van-divider :style="{ fontSize: '0.75rem', borderColor: 'rgba(221, 221, 221, 1)', color: 'rgba(61, 58, 57, 1)', padding: '0 3rem' }">
              客服电话：<a href="tel:4006680091">4006680091</a>&nbsp;转&nbsp;<span>2</span>
            </van-divider>
          </div>
        </div>
        <!-- 定位入口 -->
        <div class="go-order-form fiexd-top" v-if="showVipInfo" @click="goOrderForm">
          <img src="./images/order.png" alt="">
          <div>订单</div>
        </div>
        <div class="go-my-coupon fiexd-top" v-if="showVipInfo" @click="goMyCoupon">
          <img src="./images/coupon.png" alt="">
          <div>卡券</div>
        </div>
        <loading v-show="loaded" style="padding-top: 50%"></loading>
      </div>
    </div>
    <!-- 购买兑换入口 -->
    <div class="click-subAddVip" v-if="!showVipInfo">
      <div v-if="exchargeShow && openShow" class="left" @click="openExcharge">兑换码激活</div>
      <div v-if="openShow" class="right" @click="immediatePay">{{sellingPrice}}元/立即抢购</div>
      <div v-if="exchargeShow && !openShow" class="only-left" @click="openExcharge">兑换码激活</div>
    </div>
    <!-- 遮罩层 -->
    <div class="content-wrap fade" v-show="couponBagToast" @click="closeCouponBagToast"></div>
    <!-- 弹出层商品信息 -->
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
    <!-- 兑换入口 -->
    <ExchangePopup v-show="exchargeOpen" title="兑换码激活" confirmText="立即兑换" @cancel="hideExchargePopup" @confirm="goExcharge">
      <div class="exchange-open-top" style="padding:1.88rem 1.25rem 2.69rem;margin: 0;text-align:center;">
        <input type="text" v-model="exchargeInput" @click.stop="focusInput"  @blur="scrollToTop" class="exchange-input" placeholder="请输入兑换码" maxlength="32" />
      </div>
    </ExchangePopup>
    <ExchangePopup v-show="exchargeInfoOpen" :title="exchargeInfoTitle" :isShowCancel=false confirmText="我知道了" @cancel="sureExcharge">
      <p class="exchange-err-text" style="padding:2.56rem 2.75rem;margin: 0;text-align:center;">{{ exchargeInfoText }}</p>
    </ExchangePopup>
  </div>
</template>

<script>
  import { Divider } from 'vant';
  import BScroll  from 'better-scroll'
  import ShopHeader from '../../base/shop-header/shop-header'
  import ExchangePopup from '../../base/exchange-popup/exchange-popup'
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
      Loading,
      ExchangePopup,
      [Divider.name]: Divider
    },
    mixins:[wxShareMixin],
    data () {
      return {
        merchantId: window.infoData.merchantId,
        packageId: '',
        orderId: null,
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
        shareUrl: location.href,
        shareLink:  window.location.href,  //分享出去的链接
        shareTitle: '',  //分享的标题
        shareDesc: '', //分享的详情介绍
        shareImgUrl: '',
        okLink: null,
        exchargeShow: false,
        openShow: false,
        showVipInfo: false,
        isPaying: true,
        isHasAuthority: false
      }
    },
    created () {
      document.title = this.$route.meta.title
      //判断是否为微信
      let ua = navigator.userAgent.toLowerCase();
      let isWeixin = ua.indexOf('micromessenger') != -1;
      if (!isWeixin) {
        this.showHeader = false
        this.couponBagStyle = "top:0rem"
      } else {
        this.showHeader = false
        this.couponBagStyle = "top:0rem"
      }
      //微信分享
      this.getShare();
      if(this.$route.query.packageId){
        this.packageId = this.$route.query.packageId
      }else{
        this.$toastBox.showToastBox('无效礼包')
        this.loaded = false
      }
      if(this.$route.query.orderId){
        this.orderId = this.$route.query.orderId
      }
      if(this.$route.query.type && this.$route.query.type === 'vip'){
        this.showVipInfo = true
        this.isHasAuthority = true
        this.couponBagStyle = 'top:0rem; bottom: 0rem'
      }
      if(this.$route.query.status && this.$route.query.status === 'success'){
        this.isSuccess()
      }
      this.getCouponBagDetail({merchantId: this.merchantId, packageId: this.packageId, orderId: this.orderId})
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
      // this.getCouponBagDetail({merchantId: this.merchantId, packageId: this.packageId})
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
      checkedDefault(){
        let li = this.$refs.couponBagList.getElementsByClassName('coupon-bag-item')[0]
        let timer = null
        timer = setTimeout(()=>{
          this.scroll.scrollToElement(li, 500)
          let id 
          let type = this.allData && this.allData[0].ticketType
          let data = JSON.parse(JSON.stringify(this.allData[0].couponList)) 
          if(data && data.length > 0){
            data[0].forEach((item, index) => {
              if(index === 0){
                id = item.ticketId
              }
            })
          }
          this.receive(type, id)
          clearTimeout(timer)
        },30)
      },
      getCouponBagDetail(opts){
        if(this.showVipInfo){
          core.getUserCouponBagDetail(opts).then(res => {
            if(res.code && '00' == res.code){
              this.bannerImageUrl = res.result.merchantGiftPackageBannerImageUrl
              this.sellingPrice = res.result.sellingPrice
              if(res.result.salesModel) {
                let reg = /\,/ig;
                if(reg.test(res.result.salesModel)){
                  this.exchargeShow = true
                  this.openShow = true
                } else {
                  if(res.result.salesModel === 'DuiHuanMa'){
                    this.exchargeShow = true
                    this.openShow = false
                  }else{
                    this.exchargeShow = false
                    this.openShow = true
                  }
                }
              }
              const data = res.result.userCategoryDetails
              for(let i = 0, length = data.length; i < length; i++){
                if(data[i].ticketType == 'DiJiaQuan' && data[i].userTicketDetails && data[i].userTicketDetails.length > 0){
                  if(data[i].showType == 'ShuangHangZhanShi'){
                    data[i].couponList = []
                    for (let j = 0; j < Math.ceil(data[i].userTicketDetails.length / 6); j++) {
                      data[i].couponList.push([])
                      data[i].couponList[j] = data[i].userTicketDetails.slice(j * 6, j * 6 + 6)
                    }
                  }else{
                    data[i].couponList = []
                    for (let j = 0; j < Math.ceil(data[i].userTicketDetails.length / 3); j++) {
                      data[i].couponList.push([])
                      data[i].couponList[j] = data[i].userTicketDetails.slice(j * 3, j * 3 + 3)
                    }
                  }
                }
              }
              this.allData = data
              this.$nextTick(() => {
                this.loaded = false
                //this.checkedDefault()
              })
            } else {
              this.loaded = false
              this.$toastBox.showToastBox(res.message)
            }
          }).catch(error => {
            this.loaded = false
            this.$toastBox.showToastBox("网络错误")
          })
        }else{
          core.getCouponBagDetail(opts).then(res => {
            if(res.code && '00' == res.code){
              this.bannerImageUrl = res.result.merchantGiftPackageBannerImageUrl
              this.sellingPrice = res.result.sellingPrice
              if(res.result.salesModel) {
                let reg = /\,/ig;
                if(reg.test(res.result.salesModel)){
                  this.exchargeShow = true
                  this.openShow = true
                } else {
                  if(res.result.salesModel === 'DuiHuanMa'){
                    this.exchargeShow = true
                    this.openShow = false
                  }else{
                    this.exchargeShow = false
                    this.openShow = true
                  }
                }
              }
              const data = res.result.userCategoryDetails
              for(let i = 0, length = data.length; i < length; i++){
                if(data[i].ticketType == 'DiJiaQuan' && data[i].userTicketDetails && data[i].userTicketDetails.length > 0){
                  if(data[i].showType == 'ShuangHangZhanShi'){
                    data[i].couponList = []
                    for (let j = 0; j < Math.ceil(data[i].userTicketDetails.length / 6); j++) {
                      data[i].couponList.push([])
                      data[i].couponList[j] = data[i].userTicketDetails.slice(j * 6, j * 6 + 6)
                    }
                  }else{
                    data[i].couponList = []
                    for (let j = 0; j < Math.ceil(data[i].userTicketDetails.length / 3); j++) {
                      data[i].couponList.push([])
                      data[i].couponList[j] = data[i].userTicketDetails.slice(j * 3, j * 3 + 3)
                    }
                  }
                }
              }
              this.allData = data
              this.$nextTick(() => {
                this.loaded = false
                //this.checkedDefault()
              })
            } else {
              this.loaded = false
              this.$toastBox.showToastBox(res.message)
            }
          }).catch(error => {
            this.loaded = false
            this.$toastBox.showToastBox("网络错误")
          })
        }
      },
      goMyCoupon() {
        this.$router.push("/myCoupon")
      },
      goOrderForm(){
        this.$router.push("/orderForm")
      },
      bannerClick(){
        this.$router.push('/')
      },
      receive(type,id){
        if(this.isHasAuthority){
          this.activeType = type
          this.getItemCouponDetail({merchantId: this.merchantId, ticketId: id, packageId: this.packageId, orderId: this.orderId})
        } else {
          this.exchargeInfoOpen = true
          this.exchargeInfoTitle = '暂无使用权限'
          this.exchargeInfoText = '请先购买该礼包~'
        }
      },
      getItemCouponDetail(opts){
        this.itemCouponDetail = null
        core.getItemCouponDetail(opts).then(res => {
          if(res.code && '00' == res.code){
            const data = res.result
            let activeIndex
            let pageIndex = 0
            if(data.count > 1 && data.ticketType == 'DiJiaQuan'){
              data.couponList = []
              for (let j = 0; j < Math.ceil(data.recordResults.length / 6); j++) {
                data.couponList.push([])
                data.couponList[j] = data.recordResults.slice(j * 6, j * 6 + 6)
              }
              for (let i = 0, length = data.recordResults.length; i < length; i ++) {
                if(data.recordResults[i].isUsed === 'N'){
                  activeIndex = i
                  break;
                }
              }
              if(activeIndex > 5){
                pageIndex = Math.ceil((activeIndex + 1) / 6) -1
              }
            }else if(data.count == 1 && data.ticketType == 'DiJiaQuan'){
              if(data.recordResults[0].isUsed === 'Y'){
                activeIndex = null
              }else{
                activeIndex = 0
              }
              pageIndex = 1
            }
            this.itemCouponDetail = data
            this.useIndex = activeIndex % 6
            this.usePageIndex = pageIndex
            if(activeIndex > -1 && data.recordResults[activeIndex]){
              this.useCode = data.recordResults[activeIndex].code
            }
            this.openCouponBagToast()
            if(pageIndex > 0){
              let timer = null
              clearTimeout(timer)
              timer = setTimeout(() => {
                this.$refs.toastSlider.goToPage(pageIndex)
              }, 200)
            }
          } else if(res.code && '01' === res.code && res.isLogin == 'false'){
            this.getLoginUrl()
          } else if(res.code && '100' === res.code){
            this.exchargeInfoOpen = true
            this.exchargeInfoTitle = '温馨提示'
            this.exchargeInfoText = '很遗憾，您还未拥有此券包请前去激活后再使用'
          } else {
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(error => {
          this.$toastBox.showToastBox("网络错误")
        })
      },
      goUse(url){
        if(this.activeType == 'DiJiaQuan'){
          if(this.useCode){
            this.$router.push({path:"/couponBagGoods",query:{code: this.useCode, packageId: this.packageId}})
            setTimeout(() => {
              this.useCode = null
            }, 300)
          }else{
            this.$router.push({path:"/orderForm"})
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
            if(res.code && '00' == res.code){
              let data = {}
              for(let item in this.$route.query){
                data[item] = this.$route.query[item]
              }
              data.type = 'vip'
              data.orderId = res.result
              this.orderId = res.result
              this.$router.replace({path:'/vipUserCouponBag', query:data})
              this.isHasAuthority = true
              this.showVipInfo = true
              this.couponBagStyle = 'top:0rem; bottom: 0rem'
              this.scroll.refresh()

              this.exchargeOpen = false
              this.exchargeInfoOpen = true
              this.exchargeInfoTitle = '兑换成功'
              this.exchargeInfoText = '恭喜你兑换成功,请前去体验~'
              this.exchargeInput = null
            } else if(res.code && '01' === res.code && res.isLogin == 'false'){
              this.getLoginUrl()
              this.exchargeOpen = false
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
        // this.getCouponBagDetail({merchantId: this.merchantId, packageId: this.packageId})
      },
      getLoginUrl(){
        core.getLoginUrl({merchantId: this.merchantId}).then(res => {
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
      },
      immediatePay(){
        if(this.isPaying){
          this.isPaying = false
          let returnUrl = window.location.href + '&type=vip&status=success'
          core.buyCouponBag({merchantId: this.merchantId, packageId: this.packageId, returnUrl: returnUrl}).then(res => {
            if(res.code && '00' == res.code){
              if(res.result.goUrl){
                window.location.href = res.result.goUrl
              }
            } else if(res.code && '01' === res.code && res.isLogin == 'false'){
              this.getLoginUrl()
            } else {
              this.$toastBox.showToastBox(res.message)
            }
            this.isPaying = true
          }).catch(error => {
            this.isPaying = true
            this.$toastBox.showToastBox("网络错误")
          })
        }else{
          this.$toastBox.showToastBox("拼命请求中,请稍后...")
        }
      },
      isSuccess(){
        let status = this.$route.query.status
        if(status && status != 0){
          this.exchargeInfoOpen = true
          this.exchargeInfoTitle = '购买成功'
          this.exchargeInfoText = '恭喜你购买成功,请前去体验~'
          let data = {}
          for(let item in this.$route.query){
            if(item == 'status'){
              data[item] = 0
            }else{
              data[item] = this.$route.query[item]
            }
          }
          this.$router.push({path:'/vipUserCouponBag', query:data})
        }
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
    bottom 3rem
    right 0
    overflow hidden
    background #f7f1e3
    max-width 750PX

    .cont
      padding-bottom 0.125rem
      .coupon-top-img
        img
          display block
          width 100%
          height auto

      .coupon-bag-list
        width 100%
        padding 0 0.75rem
        box-sizing border-box
        min-height 1rem
        padding-top 0.94rem
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
            height 3.125rem
            background rgba(248,205,147,1)
            position relative
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
                    color $mian-color
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
                  color $mian-color
                  margin 0.35rem 0
                  font-weight  bold
                  height auto
                  padding 0.1rem 0
                  line-height 1.2
                .ticket-name
                  font-size 0.875rem
                  color #b78231
                  padding-top 0.1rem
      .customer-service
        font-size 0.75rem
        color #999999
        text-align center
        a
          font-size: 0.75rem;
          font-weight: normal;
          letter-spacing: 0rem;
          color: rgba(73, 109, 94, 1)
        span
          color: rgba(73, 109, 94, 1)

  .click-subAddVip
    position fixed
    bottom 0
    left 0
    height 3rem
    width 100%
    background-color #2d2b32
    max-width 750PX
    z-index 99
    display flex
    justify-content flex-start
    line-height 3rem
    color rgba(255,255,255,1)
    font-size 1.13rem
    .right
      flex 1
      text-align center
      background-color rgba(196,143,73,1)
      // padding-left 3.5rem
      box-sizing border-box

    .left
      padding-left 1.5rem
      box-sizing border-box
      width 9.84rem
      background rgba(196,143,73,1) url("./images/vip-code-btn.png") no-repeat center center
      background-size 100% 100%
    
    .only-left
      flex 1
      text-align center
      background #3D3A39

  .fiexd-top
    position absolute
    top 4.983rem
    right 0
    background-color #ffffff
    border-radius 1.125rem 0 0 1.125rem
    border solid 0.125rem #b78231
    border-right none
    display flex
    justify-content center
    align-items center
    font-size 1rem
    color #b78231
    padding 0.5rem 0.75rem 0.5rem 1rem
    img
      width 0.938rem
      max-height 1.031rem
      margin-right 0.25rem
  .go-my-coupon
    top 7.66rem
  
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
        word-break: break-all;
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
          background-color rgba(196,143,73,1);
          color #fff
          font-size 1.125rem

  .exchange-open-top
    width 100%
    font-size 0
    background #fff
    box-sizing border-box
    text-align center
    display flex
    flex-direction column
    .exchange-input
      margin 0 auto
      height 2.75rem
      width 100%
      border 0.0625rem solid rgb(199,199,199);
      border-radius 0.25rem
      outline none
      font-size 1rem
      padding-left 1rem
      box-sizing border-box
    .exchange-err-title
      width 100%
      text-align center
      font-size 1.125rem
      font-weight 600
      color rgb(51,51,51)
      margin-top 1.25rem
    .exchange-err-text
      width 100%
      text-align center
      font-size 1rem
      color rgb(102,102,102)


.instructions >>> p
  line-height 1.375rem
  text-align left
  font-size 1rem

.instructions >>> b
  font-weight bold !important

.instructions >>> strong
  font-weight bold



.fade  {
  -webkit-animation: fade 0.2s;
          animation: fade 0.2s;
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
</style>



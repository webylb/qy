<template>
  <div class="menmbers ">
    <shop-header ref="shopHeader" v-if="showHeader" style="position: absolute;top:0;left: 0;z-index: 999" line-style="background:#fff" :title="title"></shop-header>
    <div :style="menmbersStyle" class="menmbersContent" ref="menmbersContent">
      <div class="img-list">
        <div v-if="hasImg">
          <div v-if="allData">
            <img v-for="(i,index) in allData.img" :key="index" :src="i"  alt="" @load="onLoaded">
          </div>
        </div>
        <div v-else>
          <img src="./images/open-member1.png" alt="" @load="onLoaded">
          <img src="./images/open-member2.png" alt="" @load="onLoaded">
          <img src="./images/open-member3.png" alt="" @load="onLoaded">
          <img src="./images/open-member4.png" alt="" @load="onLoaded">
          <img src="./images/open-member5.png" alt="" @load="onLoaded">
          <img src="./images/open-member6.png" alt="" @load="onLoaded">
          <img src="./images/open-member7.png" alt="" @load="onLoaded">
        </div>
      </div>
    </div>
    <div class="click-subAddVip" ref="immediatePayment">
      <div class="left" @click="openExcharge" v-if="allData.isEnable !== 'N'">兑换码激活</div>
      <div class="right" @click="immediatePay"  :class="[ vipTypeList && vipTypeList[0].discountMoney ? '' : 'right-center' ]">立即开通
        <span class="price-wrap" v-if="vipTypeList">
          <span class="icon">¥</span>
          <span class="num">{{ vipTypeList[0].salePrice }}</span>/年
          <span class="old-price" v-if="vipTypeList[0].discountMoney">(<s>原价¥{{ vipTypeList[0].originalPrice }}</s>)
          </span>
        </span>
      </div>
    </div>
    <div class="open-member-toast" v-show="openMemberToast">
      <div class="open-toast" @click="immediatePay">
        <img src="./images/toast.png" alt="">
        <div class="toast-off" @click.stop="closeToast">
          <img src="./images/toast-off.png" alt="">
        </div>
      </div>
    </div>
    <div class="success-open-popup  fade" v-show="successOpen">
      <div class="success-content">
        <div class="success-open-top">
          <div class="success-open-topImg">
            <p class="success-title">{{ successTitle }}成功</p>
          </div>
          <div class="success-open-btmImg">
            <p class="success-mon-info" v-show="!isExcharge">恭喜您成为我们尊贵的会员</p>
            <p class="success-mon-info" style="margin: 2rem 0;" v-show="isExcharge">恭喜您,兑换成功{{ successMonth }}会员</p>
            <p class="success-text-info" v-show="!isExcharge">开启省钱之路吧！</p>
            <p class="success-btnWrap success-btnGroup" v-show="!isExcharge">
              <button type="button" class="look-btn" @click="goCouponBag">查看券包</button>
              <button type="button" class="buy-btn" @click="goBack">购买商品</button>
            </p>
            <p class="success-btnWrap" v-show="isExcharge">
              <button type="button" class="success-btn" @click="goBack">立即体验</button>
            </p>
          </div>
        </div>
        <div class="success-open-close" @click="hideSuccessPopup">
          <i class="iconfont">&#xe63f;</i>
        </div>
      </div>
    </div>
    <div class="exchange-popup fade" v-show="exchangeOpen">
      <div class="exchange-content">
        <div class="exchange-open-top">
          <input type="text" v-model="exchangeInput" @click.stop="focusInput"  @blur="scrollToTop" class="exchange-input" placeholder="请输入兑换码" maxlength="16" />
          <p class="exchange-btnWrap">
            <button type="button" class="exchange-btn" @click="goExcharge">立即兑换</button>
          </p>
        </div>
        <div class="exchange-open-close" @click="hideSuccessPopup">
          <i class="iconfont">&#xe63f;</i>
        </div>
      </div>
    </div>
    <div class="exchange-popup fade" v-show="exchangeErrOpen">
      <div class="exchange-content">
        <div class="exchange-open-top">
          <p class="exchange-err-title">兑换失败</p>
          <p class="exchange-err-text">{{ chargeErrText }}</p>
          <p class="exchange-btnWrap">
            <button type="button" class="exchange-btn" @click.prevent="hideSuccessPopup">我知道了</button>
          </p>
        </div>
        <div class="exchange-open-close" @click="hideSuccessPopup">
          <i class="iconfont">&#xe63f;</i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll  from 'better-scroll'
  import ShopHeader from '../../base/shop-header/shop-header'
  import * as core from '../../api/serviceCenter'
  import tool from '../../common/js/util'
  import wxShareMixin from '../../common/js/wxShareMixin'
  import * as memberCore from '../../api/member'

  export default {
    components: {
      ShopHeader
    },
    mixins:[wxShareMixin],
    data () {
      return {
        merchantId: window.infoData.merchantId,
        openingPageUuid: window.infoData.openingPageUuid || '',
        hasImg: true,
        allData: {},
        showHeader: false,
        backUrl: '',
        vipTypeList: null,
        vipTypeDefaultId: null,
        activeIndex: 0,
        checkType: '',
        successOpen: false,
        successTitle: '开通',
        successMonth: '--',
        isExcharge: false,
        exchangeOpen: false,
        exchangeInput: null,
        exchangeErrOpen: false,
        chargeErrText: '',
        isPaying: true,
        shareUrl: location.href,
        shareLink:  window.location.href,  //分享出去的链接
        shareTitle: '',  //分享的标题
        shareDesc: '', //分享的详情介绍
        shareImgUrl: '',
        okLink: null,
        openMemberToast: false
      }
    },
    created () {
      document.title = this.$route.meta.title
      //判断是否为微信
      let ua = navigator.userAgent.toLowerCase();
      let isWeixin = ua.indexOf('micromessenger') != -1;
      if (!isWeixin) {
        this.showHeader=false
        this.menmbersStyle = "top:0rem"
      } else {
        this.showHeader=false
        this.menmbersStyle = "top:0rem"
      }
      if(this.openingPageUuid){
        this.getNewShopTequan({pageUuid: this.openingPageUuid})
      }else{
        this.hasImg = false
      }
      if(this.$route.query.openStatus == 0){
        this.$toastBox.showToastBox('新人限时优惠已结束,价格恢复原价')
      }
      //微信分享
      this.getShare();
      //价格列表
      this.getVipPackageList({merchantId: this.merchantId});
      //开通成功返回
      if(this.$route.query.month && this.$route.query.month != 0){
        this.isSuccess()
      }
    },
    watch:{
      successOpen(){
        window.scrollBy(0,1)
      },
      exchangeOpen(){
        window.scrollBy(0,1)
      },
      exchangeErrOpen(){
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
    destroyed () {

    },
    methods: {
      getNewShopTequan(opts) {
        memberCore.newShopTequan(opts).then(res => {
          if (res.code && '00' === res.code) {
            if(res.result.data){
              this.allData = JSON.parse(res.result.data)
            }
          } else {
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(e => {
          this.$toastBox.showToastBox(e)
        })
      },
      handleScroll () {
        this.$refs.immediatePayment.style.top = "auto"
      },
      initHeight(){
        this.scroll.refresh()
      },
      focusInput(e){
        e.target.focus()
      },
      scrollToTop(){
        window.scrollBy(0,10)
      },
      _initScroll () {
        // 创建分类列表的Scroll对象
        this.$nextTick(()=>{
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.menmbersContent,{
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
      getVipPackageList(opts){
        core.vipPackageList(opts).then(res => {
          //console.log(res)
          if(res.code && '00' == res.code){
            this.vipTypeList = res.result
            this.vipTypeDefaultId = res.result[0].cardType
            if(res.result[0].discountMoney){
              this.openMemberToast = true
            }else{
              this.openMemberToast = false
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
          this.goVipPay()
        }else{
          this.$toastBox.showToastBox("请求中...")
        }
      },
      goVipPay(){
        let data;
        if(this.checkType){
          data = this.checkType
        }else{
          data = this.vipTypeDefaultId
        }
        let returnUrl = window.location.href.split(".html")[0]+'.html'+ this.$route.path + '?month='+data
        core.vipPackagePay({cardType: data,returnUrl:returnUrl}).then(res => {
          //console.log(res)
          if(res.code && '00' == res.code){
            if(res.result.goUrl){
              window.location.href = res.result.goUrl
              this.isPaying = true
            }else{
              this.$toastBox.showToastBox('支付方式错误')
              this.isPaying = true
            }
          }else if(res.code && '01' === res.code && res.isLogin == 'false'){
            if(res.url){
              let regIndex = /^\//gi;
              let url = res.url
              if(regIndex.test(url)){
                window.location.href = res.url + "?referer=" + encodeURIComponent(window.location.href)
              }else{
                window.location.href = res.url
              }
            }
            this.isPaying = true
          } else {
            this.$toastBox.showToastBox(res.message)
            this.isPaying = true
          }
        }).catch(error => {
          this.$toastBox.showToastBox(error)
          this.isPaying = true
        })
      },
      avg(a){
        let res= (a).toFixed(2)
        return res
      },
      goBack(){
        this.$router.push('/member')
      },
      goCouponBag(){

      },
      hideSuccessPopup(){
        this.successOpen = false
        this.exchangeOpen = false
        this.exchangeErrOpen = false
        this.exchangeInput = null
        if(this.okLink){
          window.location.href = this.okLink + "?referer="+ encodeURIComponent(window.location.href)
          this.okLink = ''
        }
        if(this.$route.query.month && this.$route.query.month != 0){
          this.$router.replace({path:'/openUrpassMembers', query:{month: 0}})
        }
        window.scrollBy(0,10)
      },
      openExcharge(){
        this.exchangeOpen = true
      },
      goExcharge(){
        if(this.exchangeInput){
          core.vipPackageExchange({code: this.exchangeInput}).then(res => {
            //console.log(res)
            if(res.code && '00' == res.code){
              this.successTitle = '兑换'
              this.isExcharge = true
              this.exchangeOpen = false
              this.successOpen = true
              if(res.result.cardType == 'month1'){
                this.successMonth = "一个月"
              }else if(res.result.cardType == 'month3'){
                this.successMonth = "三个月"
              }else if(res.result.cardType == 'month12'){
                this.successMonth = "十二个月"
              }else if(res.result.cardType == 'day3'){
                this.successMonth = "三天"
              }else if(res.result.cardType == 'day7'){
                this.successMonth = "七天"
              }
            } else if(res.code && '01' === res.code && res.isLogin == 'false'){
              if(res.url){
                let regIndex = /^\//gi;
                let url = res.url
                if(regIndex.test(url)){
                  this.okLink = res.url
                }else{
                  window.location.href = res.url
                }
              }
              this.exchangeOpen = false
              this.exchangeErrOpen = true
              this.chargeErrText = res.message
              this.exchangeInput = null
            } else {
              this.exchangeOpen = false
              this.exchangeErrOpen = true
              this.chargeErrText = res.message
              this.exchangeInput = null
            }
          }).catch(error => {
            //console.log(error)
            this.exchangeOpen = false
            this.exchangeErrOpen = true
            this.chargeErrText = "网络错误"
            this.exchangeInput = null
          })
        }else{
          this.$toastBox.showToastBox('请输入兑换码')
        }
      },
      isSuccess(){
        let month = this.$route.query.month
        if(month && month != 0){
          this.successTitle = '开通'
          this.isExcharge = false
          this.successOpen = true
          if(month == 'month1'){
            this.successMonth = "一个月"
          }else if(month == 'month3'){
            this.successMonth = "三个月"
          }else if(month == 'month12'){
            this.successMonth = "十二个月"
          }
          this.$router.replace({path:'/openUrpassMembers', query:{month: 0}})
        }
      },
      onLoaded(){
        this.scroll.refresh()
      },
      closeToast() {
        this.openMemberToast = false
      }
    }
  }
</script>


<style lang="stylus" rel="stylesheet/stylus" scoped>
.menmbers
  background-color #fff
  .menmbersContent
    position fixed
    left 0
    top 0
    bottom 3rem
    right 0
    overflow hidden
    background #fff
    max-width 750px

    .img-list
      img
        display block
        width 100%
        height auto

  //兑换按钮
  .gotoExchange
    position fixed
    right 0
    top 23.781rem
    width 8.406rem
    height 2.875rem

  .open-member-toast
    position fixed
    bottom 6.81rem
    left 0.75rem
    height 4.69rem
    width 5rem
    .open-toast
      width 100%
      height 100%
      position relative
      img
        width 100%
        height auto
      .toast-off
        position absolute
        right -0.5rem
        top -0.28rem
        width 1.25rem
        height 1.25rem

  .click-subAddVip
    position fixed
    bottom 0
    left 0
    height 3rem
    width 100%
    background-color #2d2b32
    max-width 750px
    z-index 99
    display flex
    justify-content flex-start
    line-height 3rem
    .left, .right
      font-weight bold

    .right
      width 13.59rem
      background-color #2d2b32
      color #fcd494
      text-align center
      // padding-right 1.5rem
      box-sizing border-box
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .price-wrap
        font-size 0.8125rem
        .icon
          font-size 0.625rem
        .num
          font-size 0.875rem
        .old-price
          font-size 0.75rem
    .right-center
      text-align center

    .left
      flex 1
      padding-left 1.5rem
      box-sizing border-box
      background url("./images/code_btn.png") no-repeat center center
      background-size 100% 100%
      font-size 1.125rem

  .success-open-popup
    position fixed
    bottom 0
    left 0
    right 0
    top 0
    background rgba(0,0,0,0.5)
    z-index 100
    .success-content
      min-height 1rem
      width 20rem
      position absolute
      left 50%
      top 50%
      transform translate(-50%,-50%)
      .success-open-top
        width 100%
        height 18.469rem
        font-size 0
        .success-open-topImg
          background url('./images/success-open.png') no-repeat center
          background-size 100%,100%
          height 8.688rem
          display flex
          flex-direction column
          .success-title
            color rgb(245,217,166)
            width 100%
            text-align center
            margin-bottom 1.3125rem
            font-size 1.125rem
            margin-top 4.625rem
            font-weight 600

        .success-open-btmImg
          background -o-linear-gradient(top, #fae6c6, #f0cd9d)
          background -moz-linear-gradient(top, #fae6c6, #f0cd9d)
          background -webkit-gradient(linear,top,from(#fae6c6),to(#f0cd9d))
          background -webkit-linear-gradient(top, #fae6c6, #f0cd9d)
          min-height 8.47rem
          margin-top -0.0625rem
          display flex
          flex-direction column
          border-bottom-left-radius 0.45rem
          border-bottom-right-radius 0.45rem
          line-height: 1.438rem;
          .success-mon-info
            width 100%
            text-align center
            color #2d2b32
            font-size 0.9375rem
            margin-top 1.6rem
            font-weight 500
          .success-text-info
            color #2d2b32
            width 100%
            text-align center
            font-size 0.9375rem
            font-weight 500
            margin-bottom 1.59rem
          .success-btnWrap
            width 18.3125rem
            margin  0 auto
            margin-bottom 1.5rem
            .success-btn
              width 100%
              height 2.75rem
              line-height 2.75rem
              background rgb(45,43,50)
              color rgb(245,217,166)
              text-align center
              font-size 1.125rem
              font-weight 600
              outline none
              border none
              border-radius 0.3125rem
          .success-btnGroup
            display flex
            justify-content center
            button
              width: 8.906rem;
              height: 2.75rem;
              line-height: 2.75rem;
              border-radius: 0.313rem;
              font-size: 1.125rem;
              outline: none;
              border: none;
            .look-btn
              background-color: #e5b473;
              color: #975d11;
            .buy-btn
              background-color: #2d2b32;
              color: #f5d9a6;
              margin-left: 0.5rem;
      .success-open-close
        margin-top 1.25rem
        width 100%
        text-align center
        i
          color rgb(188,188,188)
          font-size 1.75rem

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
        height 10rem
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
          border 2px solid rgb(45,43,50)
          border-radius 0.25rem
          outline none
          font-size 1.125rem
          padding-left 0.5rem
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
          margin 1.25rem 0
        .exchange-btnWrap
          width 18.3125rem
          margin  0 auto
          .exchange-btn
            width 100%
            height 2.75rem
            line-height 2.75rem
            background rgb(45,43,50)
            color rgb(245,217,166)
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


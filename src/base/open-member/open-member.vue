<template>
  <div class="members">
    <transition name="fade">
      <div class="addVipWrap fade" v-show="showServeList" @click="closeServeList"></div>
    </transition>
    <div class="addVip" ref="addVip">
      <div class="addvip-toast">
        <div class="addvip-toast-wrap">
          <div class="addvip-toast-title">
            <div class="title-text">
              选择服务类型
            </div>
            <div class="title-close" @click="closeServeList">
              <i class="iconfont">&#xe63a;</i>
            </div>
          </div>
          <div class="addvip-toast-content">
            <div class="addvip-type-list">
              <div v-for="(item,index) in vipTypeList" :key="index" class="addvip-item" :class="[index == activeIndex ? 'addvip-item-active' : '']" @click="changeActiveIndex(index,item.cardType)">
                <div class="center-text">
                  <div class="center-text-title">{{ item.name }}</div>
                  <div class="center-text-sp"><span>￥</span>{{ avg(item.salePrice) }}</div>
                </div>
              </div>
            </div>
            <div class="addvip-excharge-btn">
              <div class="left" @click="openExcharge" v-if="allData.isEnable !== 'N'">兑换码激活</div>
              <div class="right" @click="immediatePay">立即开通</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="success-open-popup  fade" v-show="successOpen">
      <div class="success-content">
        <div class="success-open-top">
          <div class="success-open-topImg">
            <p class="success-title">{{ successTitle }}成功</p>
            <p class="success-month">{{ successMonth }}会员</p>
          </div>
          <div class="success-open-btmImg">
            <p class="success-mon-info" v-show="!isExcharge">恭喜您成功开通会员</p>
            <p class="success-mon-info" style="margin: 2rem 0;" v-show="isExcharge">恭喜您,兑换成功{{ successMonth }}会员</p>
            <p class="success-text-info" v-show="!isExcharge">开始享受您精彩的会员之旅吧!</p>
            <p class="success-btnWrap">
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
  import * as core from '../../api/serviceCenter'
  import tool from '../../common/js/util'
  import * as memberCore from '../../api/member'

  export default {
    data () {
      return {
        merchantId: window.infoData.merchantId,
        openingPageUuid: window.infoData.openingPageUuid || '',
        allData: {},
        showServeList: false,
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
      }
    },
    created () {
      document.title = this.$route.meta.title
    
      if(this.openingPageUuid){
        this.getNewShopTequan({pageUuid: this.openingPageUuid})
      }
      //价格列表
      this.getVipPackageList({merchantId: this.merchantId});
      //开通成功返回
      this.isSuccess()
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
      focusInput(e){
        e.target.focus()
      },
      scrollToTop(){
        window.scrollBy(0,10)
      },
      getVipPackageList(opts){
        core.vipPackageList(opts).then(res => {
          //console.log(res)
          if(res.code && '00' == res.code){
            this.vipTypeList = res.result
            this.vipTypeDefaultId = res.result[0].cardType
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
            }
          }else if(res.code && '01' === res.code && res.isLogin == 'false'){
            if(res.url){
              var index = res.url.lastIndexOf("\/");
              var str = res.url.substring(index, res.url.length);
              let regIndex = /\?/gi;
              if(str && regIndex.test(str)){
                window.location.href = res.url + "&referer=" + encodeURIComponent(tool.replaceUrlForUrpass(window.location.href))
              }else{
                window.location.href = res.url + "?referer=" + encodeURIComponent(tool.replaceUrlForUrpass(window.location.href))
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
      changeActiveIndex(index,cardType){
        this.activeIndex = index
        this.checkType = cardType
      },
      goBack(){
        this.$router.push('/member')
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
        window.scrollBy(0,10)
      },
      openExcharge(){
        this.exchangeOpen = true
        this.closeServeList()
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
                var index = res.url.lastIndexOf("\/");
                var str = res.url.substring(index, res.url.length);
                let regIndex = /\?/gi;
                if(str && regIndex.test(str)){
                  window.location.href = res.url + "&referer=" + encodeURIComponent(tool.replaceUrlForUrpass(window.location.href))
                }else{
                  window.location.href = res.url + "?referer=" + encodeURIComponent(tool.replaceUrlForUrpass(window.location.href))
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
        if(month){
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
        }
      },
      openServeList(){
        this.hideSuccessPopup()
        this.showServeList = true
        this.$refs.addVip.style.bottom = "0"
        this.$refs.addVip.style.transition = "bottom 0.3s ease"
      },
      closeServeList(){
        this.showServeList = false
        this.$refs.addVip.style.bottom = "-100%"
        this.$refs.addVip.style.transition = "bottom 0.5s ease"
        setTimeout(() => {
          
        }, 100)
      },
      onLoaded(){
        this.scroll.refresh()
      },
    }
  }
</script>


<style lang="stylus" rel="stylesheet/stylus" scoped>
.members
  //兑换按钮
  .gotoExchange
    position fixed
    right 0
    top 23.781rem
    width 8.406rem
    height 2.875rem

  // 弹窗遮罩
  .addVipWrap
    position fixed
    left 0
    top 0
    right 0
    bottom 0
    max-width 750PX
    height 100vh
    z-index 1000
    background rgba(0,0,0,.4)
  //底部弹出定位按钮
  .addVip
    position fixed
    bottom -19.3125rem
    left 0
    /*height 19.3125rem*/
    text-align center
    width 100%
    max-width 750PX
    z-index 1001
    button
      flex 1
      border none
      box-sizing border-box
      background: #2d2b32;
      width 100%
      height 3rem
      line-height 3rem
      outline none
      font-size 1.125rem
      color #fcd494
      font-weight bold
    //底部弹出content
    .addvip-toast
      .addvip-toast-wrap
        height 100%
        width 100%
        max-width 750PX
        background #fff
        border-radius 0.5rem 0.5rem 0rem 0rem
        padding-top 1.75rem
        .addvip-toast-title
          height 1rem
          padding 0 0.78rem
          display flex
          justify-content space-between
          .title-text
            font-weight bold
            -moz-box-shadow:0px 0.25rem 0px #fbf2d9;
            -webkit-box-shadow:0px 0.25rem 0px #fbf2d9;
            box-shadow:0px 0.25rem 0px #fbf2d9;
            background linear-gradient(to bottom, #fff 0%, #fbf2d9 100%);
          .title-close
            extend-click()
            i
              font-size 0.75rem
              height 0.75rem
              width 0.75rem
              color #cacaca
        .addvip-toast-content
          display inline-block
          position relative
          text-align center
          width 100%
          /*height 13.5625rem*/
          .addvip-type-list
            margin-top 1.75rem
            margin-bottom 2rem
            padding 0 0.78rem
            display flex
            justify-content space-between
            .addvip-item
              height 7.8125rem
              box-sizing border-box
              width 6.75rem
              position relative
              .center-text
                width 100%
                height 100%
                text-align center
                box-sizing border-box
                padding-top 2.25rem
                background url('./images/default.png') no-repeat center
                background-size 100% 100%
                .center-text-title
                  color #2d2b32
                  font-size 1.125rem
                  font-weight 600
                  width 100%
                .center-text-sp
                  color #bf9228
                  font-size 1.875rem
                  width 100%
                  margin-top 0.75rem
                  font-weight 900
                  span
                    font-size 1rem
                    font-weight 900

            .addvip-item-active
              box-shadow: 0rem 0.25rem 0.75rem 0rem rgba(255, 189, 58, 0.4);
              .center-text
                background rgba(255, 189, 58, 0.2) url('./images/active.png') no-repeat center
                background-size 100% 100%
                .center-text-title
                  color #2d2b32
                .center-text-sp
                  color #bf9228

          .addvip-excharge-btn
            width 100%
            height 3rem
            line-height 3rem
            background-color: #2d2b32;
            display flex
            .left, .right {
              flex 1
              text-align center
              font-weight bold
            }
            .right{
              background-color #2d2b32
              color #fcd494
            }
            .left{
              background url("./images/code_btn.png") no-repeat center center
              background-size 100% 100%
            }

  

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
    .left, .right
      flex 1
      text-align center
      font-weight bold

    .right
      background-color #2d2b32
      color #fcd494

    .left
      background url("./images/code_btn.png") no-repeat center center
      background-size 100% 100%

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
        height 19.72rem
        font-size 0
        .success-open-topImg
          background url('./images/success-open.png') no-repeat center
          background-size 100%,100%
          height 11.25rem
          display flex
          flex-direction column
          .success-title
            color rgb(245,217,166)
            width 100%
            text-align center
            margin-bottom 1.3125rem
            font-size 1.125rem
            margin-top 4.25rem
            font-weight 600
          .success-month
            color rgb(245,217,166)
            width 100%
            text-align center
            font-size 1.5625rem
            font-weight 600

        .success-open-btmImg
          background -o-linear-gradient(top, #fae6c6, #f0cd9d)
          background -moz-linear-gradient(top, #fae6c6, #f0cd9d)
          background -webkit-gradient(linear,top,from(#fae6c6),to(#f0cd9d))
          background -webkit-linear-gradient(top, #fae6c6, #f0cd9d)
          height 8.47rem
          margin-top -2px
          display flex
          flex-direction column
          border-bottom-left-radius 0.45rem
          border-bottom-right-radius 0.45rem
          .success-mon-info
            width 100%
            text-align center
            color rgb(45,43,50)
            margin-bottom 0.75rem
            font-size 0.9375rem
            margin-top 1rem
            font-weight 500
          .success-text-info
            color rgb(45,43,50)
            width 100%
            text-align center
            font-size 0.9375rem
            font-weight 500
            margin-bottom 1.34rem
          .success-btnWrap
            width 18.3125rem
            margin  0 auto
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

.fade-enter,.fade-leave-to{
    opacity: 0;
}
.fade-enter-to,.fade-leave{
    opacity: 1;
}
.fade-enter-active,.fade-leave-active{
    transition: all 0.3s;
}
</style>


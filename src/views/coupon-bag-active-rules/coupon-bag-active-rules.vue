<template>
  <div class="coupon-bag-rules">
    <!-- 遮罩 -->
    <div class="content-wrap fade" @click="closeShareImg"></div>
    <!-- 分享规则 -->
    <div class="share-rule fade">
      <img class="rule-img" src="./images/rules.png" alt="">
      <div class="share-btn" @click="goShare"></div>
    </div>
    <!-- 分享图片 -->
    <div class="share-img fade" v-show="showShareImg">
      <img :src="activeShareImgUrl" alt="">
      <span @click="closeShareImg"></span>
    </div>
  </div>
</template>

<script>
  import * as core from '../../api/couponBag'
  import tool from '../../common/js/util'
  import wxShareMixin from '../../common/js/wxShareMixin'

  export default {
    name: 'couponBagActiveRules',
    mixins:[wxShareMixin],
    data () {
      return {
        merchantId: window.infoData.merchantId,
        packageId: '',
        shareUrl: location.href,
        shareLink:  window.location.href,  //分享出去的链接
        shareTitle: '',  //分享的标题
        shareDesc: '', //分享的详情介绍
        activeShareImgUrl: '',
        showShareImg: false
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
      if(this.$route.query.packageId){
        this.packageId = this.$route.query.packageId
      }
    },
    methods: {
      closeShareImg(){
        this.showShareImg = false
      },
      goShare(){
        this.$toast.loading({
          message: '加载中...',
          overlay: true,
          forbidClick: true,
          loadingType: 'spinner',
          duration: 0
        });
        core.getShareImg({merchantId: this.merchantId, packageId: this.packageId}).then(res => {
          if(res.code && '00' == res.code){
            this.activeShareImgUrl = res.result
            this.showShareImg = true
            this.$toast.clear()
          } else if(res.code && '01' === res.code && res.isLogin == 'false'){
            this.getLoginUrl()
          } else {
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(error => {
          this.$toastBox.showToastBox("网络错误")
        })
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
      }
    }
  }
</script>


<style lang="stylus" rel="stylesheet/stylus" scoped>
.coupon-bag-rules
  background-color #fff
  position relative
  .share-rule
    position fixed
    top 50%
    left 50%
    transform translate(-50%, -50%)
    height 30.44rem
    width 20rem
    z-index 101
    .rule-img
      width 100%
      height auto
    .share-btn
      position absolute
      left 50%
      top 10.8rem
      transform translateX(-50%)
      width 15rem
      height 3rem
    span
      position absolute
      right 0
      top -1.34rem
      width 1.34rem
      height 1.34rem
      img 
        width 100% 
        height 100%
  // 弹窗遮罩
  .content-wrap
    position fixed
    left 0
    top 0
    right 0
    bottom 0
    max-width 750PX
    z-index 100
    background rgba(0,0,0,.6)

  .share-img
    position fixed
    top 50%
    left 50%
    transform translate(-50%, -50%)
    z-index 101
    width 20.625rem
    img
      width 100%
      height auto
    span
      position absolute
      right 0.65rem
      top 0.5rem
      width 1.34rem
      height 1.34rem

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



<template>
  <div class="menmbers ">
    <shop-header ref="shopHeader" v-if="showHeader" style="position: absolute;top:0;left: 0;z-index: 999;max-width:750px" line-style="background:#fff" title="会员特权"></shop-header>
    <div :style="menmbersStyle" class="menmbersContent" ref="menmbersContent">
      <div class="addvip-toast">
        <div class="addvip-toast-wrap">
          <div class="addvip-toast-content">
            <img @load="onLoaded" src="./images/img1.png" alt="">
            <img @load="onLoaded" src="./images/img2.png" alt="">
          </div>
        </div>
        <div class="goMyCoupon" @click="goMyCoupon">
          <button type="button">我的卡券</button>
        </div>
      </div>
    </div>
    <div class="subAddVip">
      <button v-if="noGet" type="button" @click="getVipCode">立即领取</button>
      <button v-else type="button" @click="goMyCoupon" class="geted">已领取<span>（前往我的卡券查看）</span></button>
    </div>


    <div class="exchange-popup fade" v-show="showSuccessReceive">
      <div class="exchange-content">
        <div class="exchange-open-top">
          <p class="exchange-err-title">恭喜您领取成功</p>
          <p class="exchange-err-text">兑换码复制成功后请前往街电进行兑换</p>
          <p class="exchange-vip-option" v-for="(item,index) in vipCodeArr" :key="index">
            <span>{{ item.card }}</span>
            <button type="button" class="vip-code-copy-btn"
              v-clipboard:copy="item.card"
              v-clipboard:success="onCopySuccess"
              v-clipboard:error="onCopyError">复制</button>
          </p>
          <p class="exchange-btnWrap">
            <button type="button" class="exchange-btn" @click="goBack">确定</button>
          </p>
        </div>
        <!-- <div class="exchange-open-close" @click="hideSuccessPopup">
          <i class="iconfont">&#xe63f;</i>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll  from 'better-scroll'
  import ShopHeader from '../../base/shop-header/shop-header'
  import * as core from '../../api/member'
  import tool from '../../common/js/util'
  import wxShareMixin from '../../common/js/wxShareMixin'

  export default {
    components: {
      ShopHeader
    },
    mixins:[wxShareMixin],
    data () {
      return {
        showHeader: false,
        imgList:[

        ],
        noGet: true,
        backUrl: '',
        showSuccessReceive: false,
        vipCodeArr: [],
        shareUrl: location.href.split('#')[0],
        shareLink:  window.location.href.split("#")[0]+'#'+window.location.href.split("#")[1],  //分享出去的链接
        shareTitle: '',  //分享的标题
        shareDesc: '', //分享的详情介绍
        shareImgUrl: '',
      }
    },
    created () {
      document.title = this.$route.meta.title
      //判断是否为微信
      let ua = navigator.userAgent.toLowerCase();
      let isWeixin = ua.indexOf('micromessenger') != -1;
      if (!isWeixin) {
        this.showHeader=true
        this.menmbersStyle = "top:2.75rem"
      } else {
        this.showHeader=false
        this.menmbersStyle = "top:0rem"
      }

      this.isGift()
    },
    watch:{
      showSuccessReceive(){
        window.scrollBy(0,1)
      }
    },
    mounted(){
      this.$nextTick(()=>{
        this._initScroll()
      });
    },
    methods: {
      onCopySuccess(){
        this.$toastBox.showToastBox("复制成功")
      },
      onCopyError(){
        this.$toastBox.showToastBox("复制失败")
      },
      onLoaded(){
        this.scroll.refresh()
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
      goMyCoupon() {
        this.$router.push("/myCoupon")
      },
      isGift(){
         core.isGift().then(res => {
          if(res.code && '00' == res.code){
            this.noGet = res.result
          }else if(res.code && '01' === res.code && res.isLogin == 'false'){
            if(res.url){
              window.location.href = res.url
            }
          } else {
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(error => {
          this.$toastBox.showToastBox("网络错误")
        })
      },
      getVipCode(){
        core.getGift().then(res => {
          console.log(res)
          if(res.code && '00' == res.code){
            this.showSuccessReceive = true
            this.noGet = false
            this.vipCodeArr = this.vipCodeArr.concat(res.result)
          } else {
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(error => {
          this.$toastBox.showToastBox("网络错误")
        })
      },
      goBack(){
        this.showSuccessReceive = false
      },
      hideSuccessPopup(){
        this.showSuccessReceive = false

        window.scrollBy(0,1)
      },

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
    max-width 750px
    .addvip-toast
      position relative
      .goMyCoupon
        position absolute
        top 0.969rem
        right 0
        text-align center
        button
          border none
          box-sizing border-box
          background-color #44b471
          width 100%
          outline none
          font-size 0.875rem
          color #fff
          font-weight 600
          height: 1.5rem;
          line-height: 1;
          padding 0  0.5rem
          border-radius 0.8rem 0 0 0.8rem

      .addvip-toast-wrap
        .addvip-toast-content
          background: #FFF
          display inline-block
          position relative
          text-align center
          height 100%
          width 100%
          img
            width 100%
.subAddVip
  position fixed
  bottom 0
  left 0
  height 3.05rem
  text-align center
  width 100%
  max-width 750px
  background-color #44b471
  button
    border none
    box-sizing border-box
    background-color #44b471
    width 100%
    height 3rem
    line-height 3rem
    outline none
    font-size 1.125rem
    color #fff
    font-weight 600
    text-align center
  .geted
    background-color #acacac
    span
      font-size 0.875rem
      margin-left 0.1rem

.exchange-popup
  position fixed
  bottom 0
  left 0
  right 0
  top 0
  background rgba(0,0,0,0.5)
  .exchange-content
    min-height 1rem
    width 20rem
    position absolute
    left 50%
    top 50%
    transform translate(-50%,-50%)
    .exchange-open-top
      width 100%
      font-size 0
      background #fff
      border-radius 0.375rem
      text-align center
      display flex
      flex-direction column
      position relative
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
        margin 1rem 0
      .exchange-btnWrap
        width 100%
        margin-top: 1.375rem;
        .exchange-btn
          width 100%
          height 2.563rem
          line-height 2.563rem
          background #44b471
          color #fff
          text-align center
          font-size 1.125rem
          outline none
          border none
          border-radius 0 0 0.3125rem 0.3125rem
      .exchange-vip-option
        display flex
        justify-content center
        margin-bottom 0.5rem
        align-items center
        span
          display inline-block
          font-size 0.938rem
          background-color #fef8f2
          padding 0.531rem 2rem
          border-radius 0.3rem
          font-weight 600
        .vip-code-copy-btn
          border none
          outline none
          background #fff
          color #44b471
          border-bottom 1px solid #44b471
          font-size 0.938rem
          margin-left 0.5rem
          text-align center
          height max-content

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


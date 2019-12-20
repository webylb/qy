<template>
  <div style="padding: 1rem 0.75rem 0.75rem 0.75rem;">
    <div v-if="!isMember" class="car">
      <div class="car-gb">
        <img @load="onLoaded" :src="plotBGImage" alt="">
        <div class="top-wrap">
          <img src="./images/top-wrap.png" alt="">
        </div>
      </div>
      <div class="unlock" @click="unlockMember">{{ btnText ? btnText : '卡开立享折扣'}}</div>
      <div class="merchantNames-info">
        <div class="merchantNames-logo" v-if="logo"><img :src="logo" alt="logo"></div>
        <p class="merchantNames-name">{{ logoCase }}</p>
      </div>
      <div class="merchantNames-text">
        <p class="merchantNames-title">{{ mainTitle }}</p>
        <p class="merchantNames-subtitle">{{ subhead }}</p>
      </div>
    </div>
    <div v-if="isMember" class="member-car">
      <div class="car-bg-img"><img :src="plotBGImage" alt=""></div>
      <dir class="member-title">
        <img src="./images/vip.png" alt="">
        <span>{{ vipName ? vipName : merchantName }}</span>
      </dir>
      <span class="validity">有效期至{{ expireTime }}</span>
      <div class="member-info-wrapper">
        <div class="member-info-left" @click="goToCouponList">
          <span class="member-info-left-icon"><img src="./images/member_coupon-icon.png" /><span>我的卡券</span></span>
        </div>
        <div class="member-info-right" @click="goToOrderList">
          <span class="member-info-right-icon"><img src="./images/member_order-icon.png" /><span>我的订单</span></span>
        </div>
      </div>
      <div class="vt-renew" :class="[merchantId == '100000' ? 'urp-vt-renew' : '']" @click="unlockMember">
        <p>立即续费</p>
      </div>
      <div class="card-security" v-if="merchantId == '100000'" @click="goCardSecurity">
        <div>退卡保障<img src="./images/right.svg" alt=""></div>
      </div>
      <div class="merchantNames-info" v-if="merchantId != '100000'">
        <div class="merchantNames-logo" v-if="logo"><img :src="logo" alt=""></div>
        <p class="merchantNames-name">{{ logoCase }}</p>
      </div>
    </div>
    <div v-if="isHaveFavorite&&isMember" @click="toMyLike" class="my-like">
      <span><i class="iconfont">&#xe642;</i> 我喜欢</span>
      <span><i class="iconfont">&#xe713;</i></span>
    </div>
  </div>
</template>

<script>
  import tool from '../../common/js/util'
  export default {
    data() {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    props: {
      merchantId: {
        type: String
      },
      isMember: {
        type: Boolean,
        default: false
      },
      merchantName: {
        type: String,
        default: ''
      },
      isHaveFavorite: {
        type: Boolean,
        default: true
      },
      expireTime: {
        type: String,
        default: ''
      },
      plotBGImage: { //大背景
        type: String,
        default: ''
      },
      vipName: {
        type: String,
        default: ''
      },
      logo: { //小logo
        type: String,
        default: ''
      },
      logoCase: { //logo文案
        type: String,
        default: ''
      },
      mainTitle: { //主标题
        type: String,
        default: ''
      },
      subhead: { //二级标题
        type: String,
        default: ''
      },
      btnText: { //按钮文字
        type: String,
        default: ''
      }
    },
    mounted() {

    },
    activated(){

    },
    beforeUpdate() {

    },
    methods: {
      formatDate(val){
        if(val){
          return tool.formatDate(val)
        }
      },
      onLoaded(){
        this.$emit('onLoaded')
      },
      unlockMember(){
        this.$emit('unlockMember')
      },
      goToCouponList(){
        this.$emit('goToCouponList')
      },
      goToOrderList(){
        this.$emit('goToOrderList')
      },
      toMyLike(){
        this.$emit('toMyLike')
      },
      goCardSecurity(){
        tool.callService(this.merchantId)
        // window.location.href = 'https://tb.53kf.com/code/client/10187208/1'
      }
    },
    destroyed() {

    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .car
    // padding 1rem 0.75rem 0.75rem 0.75rem
    position relative
    .car-gb
      width 100%
      height 8.563rem;
      border-radius 0.75rem 0.75rem 0 0
      position relative
      overflow: hidden;
      .top-wrap
        width 120%
        height 2.5625rem
        position absolute
        left -10%
        content ''
        background transparent
        bottom 0rem

    .unlock
      position absolute
      left 50%
      bottom 0.8rem
      transform translateX(-50%)
      background-image linear-gradient(90deg, #f1c488 0%, #f3d19b 55%, #f5ddae 100%)
      box-shadow 0rem 0.063rem 0.188rem 0rem rgba(198, 147, 73, 0.84)
      border-radius 1.063rem
      height 2.125rem
      width 6.688rem
      font-size: 0.938rem;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0rem;
      color: #2f2c33;
      text-align center;
      line-height 2.125rem

    .merchantNames-info
      position absolute
      right 2.063rem
      top 2.188rem
      display flex
      flex-direction column
      .merchantNames-logo
        text-align center
        img
          width 2.188rem
          height 2.188rem
          display inline-block
          background #ffffff
          border-radius 50%
      .merchantNames-name
        margin-top 0.25rem
        text-align center
        color #f8deaf
        font-size 0.745rem

    .merchantNames-text
      position absolute
      left 1.125rem
      top 1.594rem
      display flex
      flex-direction column
      .merchantNames-title
        color #edd3ae
        font-size 1.188rem
      .merchantNames-subtitle
        margin-top 0.75rem
        color #c5a67f
        font-size 0.813rem

  .member-car
    .car-bg-img
      min-height 10rem
      border-radius 0.75rem
      box-shadow 0 0.1875rem 0.5rem rgba(49, 46, 54, 0.65)
      overflow hidden
      img
        width 100%
    width 100%
    margin 0 auto
    position relative

    .member-title
      position absolute
      left 1.125rem
      top 15.45%
      padding 0
      margin 0
      display: flex;
      align-items: flex-end;
      img
        width: 1.813rem;
      span
        color: #f5dcad;
        font-size: 1.375rem;
        margin-left: 0.4rem;

    .vt-renew
      position absolute
      top 46.35%
      right 3.7%
      width 4.5rem
      height: 1.375rem;
      background-image: linear-gradient(90deg, #f1c488 0%, #f5dcad 100%);
      border-radius: 0.688rem;
      font-size: 0.813rem;
      text-align center
      line-height 1.375rem
      p
        width 9rem
        height 2.75rem
        line-height 2.75rem
        font-size: 1.625rem;
        font-weight bold
        color: #2d2b32;
        transform: scale(0.5);
        transform-origin:left top;
    .urp-vt-renew
      top 3.906rem

    .card-security
      position absolute
      top 6.219rem
      right 3.7%
      width 4.5rem
      font-size: 0.75rem;
      color: #f1c488;
      text-align center
      &::before
        content ''
        position absolute
        top -10px
        left -10px
        right -10px
        bottom -10px
      img
        width 0.75rem

    .merchantNames-info
      position absolute
      right 1.375rem
      top 1.188rem
      display flex
      flex-direction column
      .merchantNames-logo
        text-align center
        img
          width 2.188rem
          height 2.188rem
          display inline-block
          background #ffffff
          border-radius 50%
      .merchantNames-name
        margin-top 0.25rem
        text-align center
        color #f8deaf
        font-size 0.745rem

    .validity
      left 5.13%
      position absolute
      font-size 0.813rem
      color #f1c488
      top 46.35%
      display flex
      align-items center
      height 12.36%

    .member-info-wrapper
      position absolute
      display flex
      flex-direction row
      width 100%
      height 21.91%
      bottom 6%

      .member-info-left, .member-info-right
        font-size 0.688rem
        text-align center
        display flex
        justify-content center
        align-items center
        color #f1c488
        flex 1
        font-size 0.75rem
        span
          font-size 0.75rem
          display flex
          justify-content center
          align-items center
        img
          width 0.594rem
          height 0.75rem
          margin-right 0.375rem

  .my-like
    margin 0 0.75rem
    height 2.03125rem
    background-color #ecd3a5
    border-radius 0 0 0.75rem 0.75rem
    box-shadow 0 0.1rem 0.1rem #ecd3a5
    display flex
    flex-direction row
    justify-content space-between
    box-sizing border-box
    padding 0 0.625rem
    line-height 2.03125rem
    font-size 0.75rem
    color #d59960
    vertical-align middle
    span
      i
        vertical-align baseline

</style>


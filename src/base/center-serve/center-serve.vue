<template>
  <div style="padding: 0rem;">
    <div class="center-serve">
      <div class="center-title">我的服务</div>
      <div class="center-wrap">
        <div class="order-item" @click="goServe('coupon')">
          <img src="./images/serve-coupon.png" alt="">
          <p>我的卡券</p>
        </div>
        <div class="order-item" @click="goServe('favorite')">
          <img src="./images/serve-favorite.png" alt="">
          <p>我的收藏</p>
        </div>
        <div class="order-item" @click="goServe('preferential')">
          <img src="./images/serve-preferential.png" alt="">
          <p>我的优惠</p>
        </div>
      </div>
      <div class="center-wrap" style="padding-top:1.75rem;">
        <div class="order-item" v-if="noSecurity" @click="goServe('security')">
          <img src="./images/serve-security.png" alt="">
          <p>差价赔付</p>
        </div>
        <div class="order-item" @click="goServe('question')">
          <img src="./images/serve-question.png" alt="">
          <p>常见问题</p>
        </div>
        <div class="order-item" @click="goServe('customer')">
          <img src="./images/serve-customer.png" alt="">
          <p>客服售后</p>
        </div>
        <div class="order-item" v-if="!noSecurity" style="opacity: 0;">
          <img src="./images/serve-security.png" alt="">
          <p>差价赔付</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import tool from '../../common/js/util'
  export default {
    data() {
      return {
        userAvatar: null
      }
    },
    props: {
      merchantId: {
        type: Number,
        default: 0
      },
      isMember: {
        type: Boolean,
        default: false
      },
      isLogin: {
        type: Boolean,
        default:false
      },
      noSecurity: {
        type: Boolean,
        default: false
      }
    },
    mounted() {

    },
    activated(){

    },
    beforeUpdate() {

    },
    methods: {
      onLoaded(){
        this.$emit('onLoaded')
      },
      goServe(type){
        if(this.isLogin){
          switch (type) {
            case 'coupon':
              this.$router.push('/myCoupon')
              break;
            case 'favorite':
              this.$router.push('/favorites')
              break;
            case 'preferential':
              //this.$router.push('/myCoupon')
              break;
            case 'security':
              //this.$router.push('/myCoupon')
              break;
            case 'question':
              //this.$router.push('/myCoupon')
              break;
            case 'customer':
              window.location.href = 'https://tb.53kf.com/code/client/10187208/1'
              break; 
            default:
              break;
          }
        }
      }
    },
    destroyed() {

    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.center-serve
  min-height:13.38rem;
  background:rgba(255,255,255,1);
  border-radius: 0.5rem;
  margin 0 0.75rem 0.75rem 0.75rem
  box-sizing border-box
  padding 1.22rem 0.72rem 0 0.72rem 
  .center-title
    font-size 1.25rem
    color rgba(61,58,57,1)
    font-weight 500
  .center-wrap
    display flex
    justify-content space-around
    align-items center
    padding-top 1.22rem
    box-sizing border-box
    .order-item
      text-align center
      img 
        width 2rem
        height 2rem
      p 
        font-size:0.81rem;
        color:rgba(61,58,57,1);
        margin-top 0.28rem
  
</style>


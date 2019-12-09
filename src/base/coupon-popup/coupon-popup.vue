<template>
  <transition name="fade">
    <div class="coupon-popup" @click="closeCouponPopup">
      <div class="popup-wrapper" @click.stop>
        <div class="popup-title" v-if="isShowTitle">{{ title }}</div>
        <div v-else class="no-title"></div>
        <div class="popup-info">
          <slot></slot>
        </div>
        <div class="colse" @click="closeCouponPopup">
          <img src="./images/success-close2.png" alt="">
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
    export default {
        name: "couponPopup",
        props:{
          isShowTitle: {
            type: Boolean,
            default: true
          },
          title:{
            type: String,
            default: '提示'
          }
        },
        methods:{
          closeCouponPopup(){
            this.$emit('cancel')
          }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .coupon-popup
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    background-color rgba(0,0,0,0.5)
    z-index 501
    animation  popup-dialog-in .5
    .popup-wrapper
      position fixed
      width 20rem
      // display table
      text-align center
      margin auto
      background-color #fff
      top 45%
      left 50%
      transform translate(-50%, -50%)
      z-index 502
      border-radius 0.5rem
      overflow hidden
      .popup-title
        font-size 1.13rem
        color rgba(61,58,57,1)
        padding 1.84rem 0.75rem 0 
      .no-title 
        padding-top 1rem
      .popup-info
        font-size 1rem
        line-height 1.5rem
        color rgba(61,58,57,1)
      .colse
        position absolute
        top 0.75rem
        right 0.75rem
        width 1.3rem
        height 1.3rem 
        img 
          width 100%
          height 100%       
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
.fadeIn {
  -webkit-animation: fadeIn .3s;
          animation: fadeIn .3s;
}

@-webkit-keyframes fadeIn {
    from {
      opacity: 0
    }
    to {
      opacity: 1
    }
}

@keyframes fadeIn {
    from {
        opacity: 0
    }
    to {
        opacity: 1
    }
}
</style>

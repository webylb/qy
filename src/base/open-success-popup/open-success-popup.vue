<template>
  <transition name="fade">
    <div class="success-open-popup  fade">
      <div class="success-content">
        <div class="success-open-top">
          <div class="success-open-topImg">
            <p class="success-title">{{ successTitle }}成功</p>
            <img class="success-img" src="./images/vip-success-open.png" alt="">
          </div>
          <div class="success-open-btmImg">
            <slot></slot>
          </div>
        </div>
        <div class="success-open-close" @click="hideSuccessPopup">
          <i class="iconfont">&#xe63f;</i>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
    export default {
        name: "openSuccessPopup",
        props:{
          successTitle:{
            type: String,
            default: '开通'
          }
        },
        methods:{
          hideSuccessPopup() {
            this.$emit('hideSuccessPopup')
          },
          cancel(){
            this.$emit('cancel')
          }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
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
        min-height 19.72rem
        font-size 0
        border-radius 0.5rem
        background-color #fff
        padding 0 1.25rem
        box-sizing border-box
        .success-open-topImg
          padding-top 1.88rem
          text-align center
          .success-title
            color rgb(245,217,166)
            width 100%
            text-align center
            font-size 1.13rem
            margin 0
            font-weight 600
            color rgba(61,58,57,1)
          .success-img
            width 11.69rem
            height 10.81rem
            margin-top 1.84rem

        .success-open-btmImg
          padding-top 1.4rem
          padding-bottom 1.88rem
          display flex
          flex-direction column
          .success-mon-info
            width 100%
            text-align center
            color rgba(61,58,57,1)
            line-height 1.5rem
            font-size 1rem
            margin-top 1rem
            font-weight 500
          .success-text-info
            color rgba(61,58,57,1)
            width 100%
            text-align center
            font-size 1rem
            font-weight 500
            line-height 1.5rem
          .success-btnWrap
            text-align center
            margin-top 2.3rem
            .success-btn
              padding 0.95rem 1.81rem
              background rgba(183,130,49,1)
              color rgba(255,255,255,1)
              text-align center
              font-size 1.13rem
              font-weight 600
              outline none
              border none
              border-radius 0.25rem
      .success-open-close
        margin-top 1.25rem
        width 100%
        text-align center
        i
          color rgb(255,255,255,1)
          font-size 1.75rem


  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>

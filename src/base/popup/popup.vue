<template>
  <transition name="fade">
    <div class="popup">
      <div class="popup-wrapper">
        <div class="popup-title" v-show="showPopupTitle">{{title}}</div>
        <div class="popup-info">
          <slot></slot>
        </div>
        <div class="popup-operation">
          <div @click="cancel" v-show="showCancel">{{cancelCart}}</div>
          <div @click="confirm" class="popup-sure" v-if="defaultBtn">{{confirmCart}}</div>
          <div @click="confirm" class="popup-sure" v-else><a :href="'tel:'+ phoneNum">{{confirmCart}}</a></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
    export default {
        name: "popup",
        props:{
          title:{
            type:String,
            default:'操作提示'
          },
          cancelCart:{
            type: String,
            default: '取消'
          },
          confirmCart:{
            type:String,
            default:'确定'
          },
          showCancel: {
            type: Boolean,
            default: true
          },
          showPopupTitle: {
            type: Boolean,
            default: true
          },
          defaultBtn: {
            type: Boolean,
            default: true
          },
          phoneNum: {
            type: String,
            default: '000'
          }
        },
        methods:{
          confirm(){
            this.$emit('confirm')
          },
          cancel(){
            this.$emit('cancel')
          }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .popup
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
      max-width 300px
      display table
      text-align center
      margin auto
      background-color #fff
      top 0
      bottom 0
      left 0
      right 0
      width 80%
      z-index 502
      border-radius 0.5rem
      .popup-title
        font-size 18px
        padding 1.3rem 1.6rem 0.5rem
      .popup-operation
        position relative
        display flex
        padding 0.875rem 0
        line-height 1.2rem
        font-size 1rem
        color #999
        &:after
          content: " "
          position: absolute
          left: 0
          top: 0
          right: 0
          height: 1px
          border-top: 1px solid #D5D5D6
          color: #D5D5D6
          -webkit-transform-origin: 0 0
          transform-origin: 0 0
          -webkit-transform: scaleY(0.5)
          transform: scaleY(0.5)
        .popup-sure
          color #ff4800
          position relative
          &:after
            content " "
            position absolute
            left 0
            top  0
            bottom  0
            width  1px
            border-left 1px solid #D5D5D6
            color #D5D5D6
            -webkit-transform-origin 0 0
            transform-origin 0 0
            -webkit-transform scaleX(0.5)
            transform scaleX(0.5)
          a
            color #ff4800
            width 100%
            height 100%
            display inline-block
        div
          flex 1
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>

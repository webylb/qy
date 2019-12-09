<template>
  <transition name="fade">
    <div class="ex-popup">
      <div class="popup-wrapper">
        <div class="popup-title" v-if="isShowTitle">{{ title }}</div>
        <div v-else class="no-title"></div>
        <div class="popup-info">
          <slot></slot>
        </div>
        <div class="popup-operation" v-if="isShowCancel">
          <div class="cancel" @click="cancel">{{ cancelText }}</div>
          <div class="confirm" @click="confirm">{{ confirmText }}</div>
        </div>
        <div class="popup-operation" v-else>
          <div class="cancel" @click="cancel">{{ confirmText }}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
    export default {
        name: "exchangePopup",
        props:{
          isShowTitle: {
            type: Boolean,
            default: true
          },
          title:{
            type: String,
            default: '操作提示'
          },
          cancelText:{
            type: String,
            default: '取消'
          },
          confirmText:{
            type: String,
            default: '确定'
          },
          isShowCancel: {
            type: Boolean,
            default: true
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
  .ex-popup
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
      display table
      text-align center
      margin auto
      background-color #fff
      top 0
      bottom 0
      left 0
      right 0
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
      .popup-operation
        position relative
        display flex
        color #999
        &:after
          content: " "
          position: absolute
          left: 0
          top: 0
          right: 0
          height: 1px
          border-top: 1px solid rgba(221,221,221,1);
          color: rgba(221,221,221,1);
          -webkit-transform-origin: 0 0
          transform-origin: 0 0
          -webkit-transform: scaleY(0.5)
          transform: scaleY(0.5)
          z-index: -1;
        .confirm
          color rgba(255,255,255,1)
          background-color rgba(183,130,49,1)
          font-size 1.13rem
        div
          flex 1
          padding 1rem 0
          letter-spacing 0.05rem
        .cancel
          font-size 1.13rem
          color rgba(183,130,49,1)

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>

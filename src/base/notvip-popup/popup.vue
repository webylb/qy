<template>
  <transition name="fade">
    <div class="notvip-popup">
      <div class="content">
        <div class="top">
          <p class="title" v-show="title">{{ title }}</p>
          <p class="text">{{ defaultText }}</p>
          <p class="btnWrap">
            <button type="button" class="btn" @click.prevent="openMember">前去开通</button>
          </p>
        </div>
        <div class="close" @click.prevent="hidePopup">
          <i class="iconfont">&#xe63f;</i>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
    export default {
        name: "notVipPopup",
        props:{
          title:{
            type: String,
            default: '提醒'
          },
          defaultText: {
            type: String,
            default: '很遗憾,您现在还不是尊贵的会员用户 请前去开卡在进行购买'
          }
        },
        methods:{
          hidePopup(){
            this.$emit('hidePopup')
          },
          openMember(){
            this.$emit('openMember')
          }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .notvip-popup
    position fixed
    bottom 0
    left 0
    right 0
    top 0
    background rgba(0,0,0,0.5)
    z-index 101
    .content
      min-height 1rem
      width 20rem
      position absolute
      left 50%
      top 50%
      transform translate(-50%,-50%)
      .top
        width 100%
        font-size 0
        background #fff
        border-radius 0.375rem
        text-align center
        display flex
        flex-direction column
        .title
          width 100%
          text-align center
          font-size 1.125rem
          font-weight bold
          color #333333
          margin-top 1.25rem
        .text
          width 100%
          text-align center
          font-size 1rem
          color #666666
          margin 1.1rem 0 1rem 0
          padding 0 1.563rem
          box-sizing border-box
          line-height 1.438rem
        .btnWrap
          width 18.3125rem
          margin  0 auto
          margin-bottom 1.5rem
          .btn
            width 100%
            height 2.75rem
            line-height 2.75rem
            outline none
            border none
            text-align center
            font-size 1.125rem
            font-weight bold
            border-radius 0.313rem
            background-color #fae2b3
            color #333333
      .close
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
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>

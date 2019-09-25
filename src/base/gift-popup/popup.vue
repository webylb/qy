<template>
  <div class="notvip-popup">
    <div class="content fade">
      <div class="top">
        <p class="btnWrap">
          <button type="button" class="btn" @click.prevent="receiveGift">立即领取</button>
        </p>
      </div>
      <div class="close" @click.prevent="hidePopup">
        <i class="iconfont">&#xe63f;</i>
      </div>
    </div>
  </div>
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
          receiveGift(){
            this.$emit('receiveGift')
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
    background rgba(0,0,0,0.6)
    z-index 10000
    .content
      min-height 1rem
      width 20rem
      position absolute
      left 50%
      top 50%
      transform translate(-50%,-50%)
      .top
        width 16.91rem
        height 18.97rem
        font-size 0
        background url("./images/gift.png") no-repeat center top
        background-size auto 100%
        margin 0 auto
        position relative
        .btnWrap
          position absolute
          left 50%
          transform translateX(-50%)
          bottom 1rem
          width 13.13rem
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
            background rgba(250,226,179,1)
            color rgba(140,82,42,1)
      .close
        margin-top 1rem
        width 100%
        text-align center
        i
          color rgb(188,188,188)
          font-size 1.75rem

  .fade  {
    -webkit-animation: fade 2s;
            animation: fade 2s;
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

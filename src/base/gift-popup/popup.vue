<template>
  <div class="gift-popup">
    <div class="content zoomIn">
      <div class="top">
        <img src="./images/gift.png" alt="">
        <p class="btnWrap" @click.prevent="receiveGift">
          <button type="button" class="btn">立即领取</button>
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
        name: "giftPopup",
        props:{
          
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
  .gift-popup
    position fixed
    bottom 0
    left 0
    right 0
    top 0
    background rgba(0,0,0,0.6)
    max-width 750PX
    z-index 10000
    .content
      min-height 1rem
      width 16.91rem
      position absolute
      left 50%
      top 9.84rem
      margin-left -8.455rem
      .top
        width 16.91rem
        height 18.97rem
        font-size 0
        margin 0 auto
        position relative
        img 
          width 100%
          height 100%
        .btnWrap
          position absolute
          left 1.89rem
          //transform translateX(-50%)
          bottom 1rem
          width 13.13rem
          height 2.75rem
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
    -webkit-animation: scale 1s;
            animation: scale 1s;
  }
  .zoomIn {
    -webkit-animation: zoomIn 0.2s;
            animation: zoomIn 0.2s;
  }

  @keyframes zoomIn {
    from {
      opacity: 0;
      -webkit-transform: scale3d(0.3, 0.3, 0.3);
      transform: scale3d(0.3, 0.3, 0.3);
    }

    50% {
      opacity: 1;
    }
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
  @keyframes scale {
    0% {transform: scale(0.5)}
    100% {transform: scale(1.0)}
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>

<template>
  <div class="gift-popup" @click="hidePopup">
    <div class="content zoomIn" @click.stop>
      <div class="top">
        <img src="./images/wofen-gift.png" alt="">
        <p class="btnWrap" @click.prevent="receiveGift"></p>
      </div>
      <div class="close" @click.prevent="hidePopup">
        <img src="./images/success-close.png" alt="">
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
      width 18.75rem
      position absolute
      left 50%
      top 12%
      margin-left -9.375rem
      .top
        width 18.75rem
        height 26rem
        font-size 0
        margin 0 auto
        position relative
        img 
          width 100%
          height 100%
        .btnWrap
          position absolute
          left 2.85rem
          //transform translateX(-50%)
          bottom 3.7rem
          width 13.2rem
          height 3rem
      .close
        position absolute
        right 0.6rem
        top -0.67rem
        width 1.34rem
        height 1.34rem
        img 
          width 100%
          height 100%
    
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

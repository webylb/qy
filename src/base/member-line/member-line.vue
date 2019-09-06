<template>
  <div>
    <div class="line-wrap" :style="{ backgroundColor: bgColor, padding: '0.75rem 0'}">
      <div class="scale-line">
        <div class="line" :style="{borderColor: lineColor,borderStyle: borderStyle,borderRadius:'none'}"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    props: {
      bgColor: {
        type: String,
        default: '#fff'
      },
      lineColor: {
        type: String,
        default: '#e5e5e5'
      },
      borderStyle: {
        type: String,
        default: 'solid'
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
      jumplinkUrl(url){
        this.$emit('jumplinkUrl', url)
      }
    },
    destroyed() {

    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
   .line-wrap
      /* --- 缩放实现物理 1px 开始 ---- */
      .scale-line {
        width: 100%;
        position: relative;
      }
      .line {
        height: 1px;
        border-top-width: 1px;
      }

      .line {
        box-sizing: border-box;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        -webkit-transform: scale(1);
        transform: scale(1);
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        pointer-events: none;
      }
      @media only screen and (-webkit-min-device-pixel-ratio: 2) {
        .line {
          right: -100%;
          bottom: -100%;
          -webkit-transform: scale(0.5);
          transform: scale(0.5);
        }
      }
      @media only screen and (-webkit-min-device-pixel-ratio: 3) {
        .line {
          right: -200%;
          bottom: -200%;
          -webkit-transform: scale(0.33);
          transform: scale(0.33);
        }
      }
</style>

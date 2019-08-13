<template>
  <div>
    <div style="padding: 0.5rem 0" class="banner">
      <slider :is-show-dots="false" class="slider-wrapper" :loop="false" :auto-play="false">
        <div v-for="(item, index) in bannerList" :key="index">
          <a @click.stop="jumplinkUrl(item.jumpUrl)"><img @load="onLoaded" class="needsclick" :src="item.img_url" ></a>
        </div>
      </slider>
    </div>
  </div>
</template>

<script>
  import Slider from '../slider/slider'
  export default {
    data() {
      return {

      }
    },
    props: {
      bannerList: {
        type: Array
      }
    },
    components: {
      Slider
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
   .banner
      .slider-wrapper
        overflow hidden
</style>


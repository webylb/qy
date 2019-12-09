<template>
  <div>
    <div style="padding: 0.375rem 0.75rem" class="banner" v-if="bannerList.length > 0">
      <slider class="slider-wrapper" :loop="bannerList.length > 1 ? true : false" :interval="intervals">
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
      },
      intervals: {
        type: Number,
        default: 4000
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
        position relative
        img
          width 100%
          height auto
</style>


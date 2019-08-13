<template>
  <div>
    <div class="classify">
      {{ title }}
    </div>
    <div class="hot-wrapper" v-if="hotList && hotList.length > 0">
      <div class="hot-two">
        <div><a @click.stop="jumplinkUrl(hotList[0].jumpUrl)" ><img @load="onLoaded" :src="hotList[0].img_url" alt=""></a></div>
        <div><a @click.stop="jumplinkUrl(hotList[1].jumpUrl)" ><img :src="hotList[1].img_url" alt=""></a></div>
      </div>
      <div class="hot-three">
        <div><a @click.stop="jumplinkUrl(hotList[2].jumpUrl)"><img @load="onLoaded" :src="hotList[2].img_url" alt=""></a></div>
        <div><a @click.stop="jumplinkUrl(hotList[3].jumpUrl)"><img :src="hotList[3].img_url" alt=""></a></div>
        <div><a @click.stop="jumplinkUrl(hotList[4].jumpUrl)"><img :src="hotList[4].img_url" alt=""></a></div>
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
      hotList: {
        type: Array
      },
      title: {
        type: String,
        default: ''
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
  .classify
      padding 1rem 3.2%
      color #333

  .hot-wrapper
      width 93.6%
      margin 0 auto

      .hot-two
        display flex
        justify-content space-between

        div
          width 49.57%
          overflow hidden
          /*padding-bottom 24.43%*/
          border-radius 0.25rem

      .hot-three
        display flex
        margin-top 0.1875rem
        justify-content space-between

        div
          width 32.76%
          overflow hidden
          border-radius 0.25rem
</style>


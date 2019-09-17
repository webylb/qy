<template>
  <div>
    <div class="hot-wrapper" v-if="hotList && hotList.length == 2">
      <div class="hot-twos">
        <div><a @click.stop="jumplinkUrl(hotList[0].jumpUrl)" ><img @load="onLoaded" :src="hotList[0].img_url" alt=""></a></div>
        <div><a @click.stop="jumplinkUrl(hotList[1].jumpUrl)" ><img :src="hotList[1].img_url" alt=""></a></div>
      </div>
    </div>
    <div class="hot-wrapper" v-else-if="hotList && hotList.length == 3">
      <div class="hot-threes">
        <div class="left-img"><a @click.stop="jumplinkUrl(hotList[0].jumpUrl)"><img @load="onLoaded" :src="hotList[0].img_url" alt=""></a></div>
        <div class="right-wrap">
          <div><a @click.stop="jumplinkUrl(hotList[1].jumpUrl)"><img :src="hotList[1].img_url" alt=""></a></div>
          <div><a @click.stop="jumplinkUrl(hotList[2].jumpUrl)"><img :src="hotList[2].img_url" alt=""></a></div>
        </div>
      </div>
    </div>
    <div class="hot-wrapper" v-else-if="hotList && hotList.length == 5">
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
  .hot-wrapper
      width 100%
      padding 0.75rem
      box-sizing border-box
      margin 0 auto

      .hot-twos
        display flex
        justify-content space-between

        div
          // width 10.8125rem
          width 49.29%
          overflow hidden
          border-radius 0.25rem
          a
            display block
            width 100%
            img
              width 100%
              height auto

      .hot-threes
        display flex
        justify-content space-between

        .left-img
          // width 10.8125rem
          width 49.29%
          height 8.9375rem
          overflow hidden
          border-radius 0.25rem
          a
            display block
            width 100%
            height 100%
            img
              width 100%
              height 100%

        .right-wrap
          // width 10.8125rem
          width 49.29%
          overflow hidden

          div
            width 100%
            height 4.3125rem
            border-radius 0.25rem
            overflow hidden
            &:last-child
              margin-top 0.3125rem
            a
              display block
              width 100%
              height 100%
              img
                width 100%
                height 100%

      .hot-two
        display flex
        justify-content space-between

        div
          // width 10.8125rem
          width 49.29%
          height 8.9375rem
          overflow hidden
          border-radius 0.25rem
          a
            display block
            width 100%
            height 100%
            img
              width 100%
              height 100%

      .hot-three
        display flex
        margin-top 0.3125rem
        justify-content space-between

        div
          // width 7.0625rem
          width 32.50%
          overflow hidden
          border-radius 0.25rem
          a
            display block
            width 100%
            img
              width 100%
              height auto
</style>


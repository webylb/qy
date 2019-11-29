<template>
  <div class="user-info">
    <scroll ref="centerScroll" class="center-scroll">
      <div>
        <img src="./images/security.png" @load="onLoaded" alt="">
      </div>
    </scroll>
  </div>
</template>

<script>
  import Scroll from '../../base/scroll/scroll'
  import * as core from '../../api/member'
  import tool from '../../common/js/util'

  export default {
    name: "userInfo",
    components: {
      Scroll
    },
    data() {
      return {
      
      }
    },
    created() {
  
    },
    methods: {
      onLoaded(){
        this.$refs.centerScroll.refresh()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .user-info
    .center-scroll
      position fixed
      top 0
      left 0
      right 0
      bottom 0
      max-width 750PX
      // margin 0 auto
      z-index 10
      background rgba(255,255,255,1)
      .img
        width 100%
        height auto
</style>

<template>
  <div class="main">
    <div class="main-wrap">
        <img src="./images/404.png" alt="">
        <p>啊哦，页面飞到外太空去了~</p>
        <button @click="goHome">回到首页</button>
    </div>
  </div>
</template>
<script>

  export default {
    name: '404',
    methods: {
      goHome(){
        this.$router.push('/')
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .main
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    background-color #fff
    width 100%
    max-width 750PX
    .main-wrap
      text-align center
      position absolute
      left 50%
      top 7.5rem
      transform translateX(-50%)
      width 15rem
      img
        width 7.5rem
        height 7.5rem
        margin-bottom 1.5rem
      p
        font-size 1rem
        color rgba(153, 153, 153, 1)
      button
        margin-top 1.5rem
        outline none 
        border none
        background-color rgba(196, 143, 73, 1)
        color rgba(255, 255, 255, 1)
        font-size 1.13rem
        border-radius 0.25rem
        padding 0.59rem 1.46rem
        box-sizing border-box
</style>

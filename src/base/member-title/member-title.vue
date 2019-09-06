<template>
  <div>
    <div style="padding: 0.74rem" class="title">
      <p>{{ titleText }}</p>
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
      bannerList: {
        type: Array
      },
      titleText: {
        type: String
      }
    },
    mounted() {

    },
    methods: {
      jumplinkUrl(url){
        this.$emit('jumplinkUrl', url)
      }
    },
    destroyed() {

    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
   .title
      p
        margin 0
        overflow hidden
        font-size 1.125rem
        font-weight bold
        color #212121
        line-height 1.2
</style>


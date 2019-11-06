<template>
  <div>
    <div style="padding: 0.75rem 0.75rem 0 0.75rem" class="title">
      <p :style="{textAlign: textCss}">{{ titleText }}</p>
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
      titleText: {
        type: String
      },
      textCss: {
        type: String,
        default: 'left'
      },
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
        font-size 1.25rem
        font-weight bold
        color #212121
        line-height 1.2
</style>


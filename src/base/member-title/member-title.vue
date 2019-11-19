<template>
  <div>
    <div style="padding: 0.75rem 0.75rem 0 0.75rem" class="title">
      <div class="title-wrap" :style="{textAlign: textCss}">{{ titleText }}
        <div class="title-link" v-if="urlOptionsValue === 'enabled'" @click="jumplinkUrl(jumpTypeOptionsValue == 'input' ? urlInputValue : urlSelectOptionsValue)">
        <span>{{ urlTitle }}</span> <img src="./images/right_icon.png" alt="">
        </div>
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
      titleText: {
        type: String
      },
      textCss: {
        type: String,
        default: 'left'
      },
      urlOptionsValue: {
        type: String,
        default: 'disabled'
      },
      jumpTypeOptionsValue: {
        type: String,
        default: 'input'
      },
      urlSelectOptionsValue: {
        type: String,
        default: ''
      },
      urlInputValue: {
        type: String,
        default: ''
      },
      urlTitle: {
        type: String,
        default: ''
      }
    },
    mounted() {

    },
    methods: {
      jumplinkUrl(url){
        // console.log(this.jumpTypeOptionsValue,url)
        this.$emit('jumplinkUrl', url)
      }
    },
    destroyed() {

    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
   .title
      .title-wrap
        margin 0
        overflow hidden
        font-size 1.25rem
        font-weight bold
        color #212121
        line-height 1.2
        position relative
      .title-link
        display flex
        justify-content flex-start
        align-items baseline 
        position relative
        position absolute
        top 50%
        transform translateY(-50%)
        right 0.75rem
        &::after 
          content ''
          position absolute
          top -10px
          left -10px
          right -10px
          bottom -10px
        span 
          font-size 0.82rem
          color rgba(153, 153, 153, 1)
        img  
          width 0.38rem
          height 0.55rem
          margin-left 0.4rem
</style>


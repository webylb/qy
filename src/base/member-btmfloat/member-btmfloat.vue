<template>
  <div>
    <div class="bottom-float" v-if="title" @click="jumplinkUrl(urlValue)">
      <div class="title">
        {{ title }}
      </div>
      <button type="button">{{ btnText }}
        <i class=""></i>
      </button>
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
      title: {
        type: String,
        default: ''
      },
      btnText: {
        type: String,
        default: ''
      },
      urlValue: {
        type: String,
        default: '/'
      },
      merchantId: {
        type: Number
      }
    },
    components: {
  
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
   .bottom-float
    background url('./images/bottom_float_bg.png') no-repeat center
    background-size 100% 100%
    height 3.125rem
    width 100%
    max-width 750PX
    position fixed
    bottom 0px
    left 0px
    z-index 10
    display flex
    padding 0 0.75rem
    box-sizing border-box
    justify-content space-between
    align-items center
    .title 
      color rgba(117,67,36,1)
      font-weight bold
      font-size 0.875rem
    button 
      font-size:0.75rem;
      font-family:PingFang SC;
      font-weight:bold;
      color:rgba(255,255,255,1);
      padding 0.25rem 0.5rem
      text-align center
      outline none 
      border none
      background rgba(61,58,57,1)
      border-radius 0.25rem
      display flex
      align-items center
      i 
        width: 0
        border: 0.3rem solid transparent
        border-left 0.3rem solid #fff
        border-right none
        margin-left 0.22rem
</style>


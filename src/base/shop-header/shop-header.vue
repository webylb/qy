<template>
  <div v-if="showHeader" :style="lineStyle" class="j-header">
    <div onClick="javascript:history.back(-1)" class="go-back" v-if="showGoBack"></div>
    <h1 class="title">{{title}}</h1>
  </div>
</template>

<script>
  export default {
    name: 'j-header',
    data(){
      return {
        showHeader : false
      }
    },
    created(){
      let ua = navigator.userAgent.toLowerCase();
      let isWeixin = ua.indexOf('micromessenger') != -1;

      if (!isWeixin) {
        this.showHeader=true
        // alert('Dragondean说这不是通过微信内置浏览器');
      }else{
        this.showHeader=true
      }
    },
    props:{
      title:{
        type:String,
        default:''
      },
      showGoBack:{
        type:Boolean,
        default:true
      },
      lineStyle:{
        type:String,
        default:''
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .j-header
    width 100%
    height 2.75rem
    position relative
  .go-back
    width 2.75rem
    height 100%
    position absolute
    &:before
      content ''
      position absolute
      width 0.8rem
      height 0.8rem
      border 2px solid #000
      border-width 2px 0 0 2px
      transform rotate(315deg)
      top 0.9rem;
      left 1rem
  .title
    text-align center
    line-height 2.75rem
    font-size 1.125rem

</style>

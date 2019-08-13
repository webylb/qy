<template>
  <div>
    <div style="padding-top: 1.875rem" class="classify">
      {{ title }}
    </div>
    <div class="recommend-wrapper">
      <div @click="toDetail(i.jumpUrl)" v-for="(i,index) in recommendList" :key="index" class="recommend-item-wrapper">
        <div class="img-wrapper">
          <img :src="i.skuCover" alt="">
        </div>
        <div class="info-wrapper">
          <p class="name">{{i.itemTitle}}</p>
          <p class="price"><span style="text-decoration:line-through;font-size: 0.875rem">¥{{ priceToFixed(i.marketPrice) }}</span>
            <span style="font-size: 0.875rem">官方价</span></p>
          <p class="now-price"><span class="goods-lable">会员价</span><span style="padding-left: 0.5rem;font-weight:600;font-size:0.875rem">¥<span style="font-weight:600;font-size:1.125rem;margin-left:0.2rem">{{ priceToFixed(i.settlementPrice) }}</span></span></p>
        </div>
      </div>
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
      recommendList: {
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
    methods: {
      priceToFixed(val){
        if(val){
          let price = parseFloat(val)
          return price.toFixed(2)
        }else{
          return ''
        }
      },
      onLoaded(){
        this.$emit('onLoaded')
      },
      jumplinkUrl(url){
        this.$emit('jumplinkUrl', url)
      },
      toDetail(url){
        this.$emit('toDetail', url)
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

  .recommend-wrapper
      width 93.6%
      margin 0 auto
      padding-bottom 1px

      .recommend-item-wrapper
        margin-bottom 1.656rem
        width 100%
        height 4.844rem
        position relative

        .img-wrapper
          position absolute
          height 100%
          border-radius 0.25rem
          overflow hidden
          width 7.188rem

          img
            height 100%
            width 100%

        .info-wrapper
          p
            span
              // vertical-align middle
          display flex
          flex-direction column
          justify-content space-between
          box-sizing border-box
          width 100%
          height 100%
          padding-left 7.937rem

          .name
            color #333
            font-size 0.938rem

          .price
            color #999

          .now-price
            font-size 1.125rem
            font-weight 800
            color #ff4800
            display flex
            height 1.25rem

            .goods-lable
              background-color: #2d2c32;
              border-radius: 0rem 0.563rem 0.563rem 0.563rem;
              font-size 0.688rem
              color #f1c488
              padding 0.25rem 0.844rem
</style>


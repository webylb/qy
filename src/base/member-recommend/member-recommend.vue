<template>
  <div>
    <div class="recommend-wrapper" v-if="type == 'listFile'">
      <div v-for="(i,index) in recommendList" :key="index" @click="jumplinkUrl(i.jumpUrl)" class="recommend-item-wrapper">
        <div class="img-wrapper">
          <img :src="i.cover || i.skuCover" alt="">
        </div>
        <div class="info-wrapper">
          <p class="name">{{i.itemName || i.itemTitle}}</p>
          <p class="price"><s>¥{{ priceToFixed(i.marketPrice) }}</s>
            <span> 官方价</span></p>
          <p class="now-price">
            <span class="left">
              <span>¥<span>{{ priceToFixed(i.settlementPrice) }}</span></span>
              <img src="./images/label.png" alt="会员价">
            </span>
            <button type="button">购买</button>
          </p>
        </div>
      </div>
    </div>
    <div class="recommend-wrapper double-wrap" v-else-if="type == 'double'">
      <div v-for="(i,index) in recommendList" :key="index" @click="jumplinkUrl(i.jumpUrl)" class="recommend-item-wrapper">
        <div class="img-wrapper">
          <img :src="i.cover || i.skuCover" alt="">
        </div>
        <div class="info-wrapper">
          <p class="name" style="-webkit-box-orient: vertical">{{ i.itemName || i.itemTitle }}</p>
          <p class="price">
            <s>¥{{ priceToFixed(i.marketPrice) }}</s>
            <span>官方价</span>
          </p>
          <p class="now-price">
            <span>¥<span>{{ priceToFixed(i.settlementPrice) }}</span></span>
            <img src="./images/label.png" alt="会员价">
          </p>
        </div>
      </div>
    </div>
    <div class="recommend-wrapper single-big-wrap" v-else-if="type == 'singleBig'">
      <div v-for="(i,index) in recommendList" :key="index" @click="jumplinkUrl(i.jumpUrl)" class="recommend-item-wrapper">
        <div class="img-wrapper">
          <img :src="i.cover || i.skuCover" alt="">
        </div>
        <div class="info-wrapper">
          <p class="name" style="-webkit-box-orient: vertical">{{i.itemName || i.itemTitle}}</p>
          <p class="price">
            <s>¥{{ priceToFixed(i.marketPrice) }}</s><span>官方价</span>
          </p>
          <p class="now-price">
            <span class="left"><span>¥<span>{{ priceToFixed(i.settlementPrice) }}</span></span>
            <img src="./images/label.png" alt="会员价"></span>
            <button type="button">立即购买</button>
          </p>
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
      type: {
        type: String,
        default: 'listFile'
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
      }
    },
    destroyed() {

    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

  .recommend-wrapper
    width 100%
    box-sizing border-box
    margin 0 auto
    padding 0.75rem

    .recommend-item-wrapper
      margin-bottom 1rem
      width 100%
      height 6.25rem
      position relative
      &:last-child
        margin-bottom 0

      .img-wrapper
        position absolute
        height 100%
        border-radius 0.25rem
        overflow hidden
        width 9.38rem
        height 6.25rem
        text-align center
        overflow hidden
        img
          height 100%
          width auto
          border-radius 0.25rem

      .info-wrapper
        width 100%
        height 100%
        padding 0.5rem 0 0.5rem 10.125rem
        box-sizing border-box

        .name
          color rgba(61,58,57,1)
          font-size 1rem
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          line-height 1.2

        .price
          margin 1.25rem 0 0.5rem 0
          color #999
          font-size: 0.8125rem
          line-height 1.2
          display flex
          align-items center
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          span:last-child
            font-size: 0.75rem
            margin-left 0.1rem

        .now-price
          font-size 1rem
          font-weight 800
          color #ff4800
          display flex
          justify-content space-between
          align-items center

          .left
            display flex
            align-items center
            span
              padding-left: 0;
              font-weight: bold;
              font-size: 0.75rem;
              color: rgba(179,151,93,1)
              span
                font-weight 600
                font-size 1rem
                margin-left 0.2rem
            img
              width 2rem
              height auto
              margin-top 0rem
              margin-left 0.2rem

          button
            outline none
            border none
            background rgba(179,151,93,1)
            font-size 0.75rem
            color #fff
            padding 0
            margin 0
            min-width 3.0625rem
            height 1.25rem

  .double-wrap
    display flex
    justify-content space-between
    flex-wrap wrap

    .recommend-item-wrapper
      // width 10.8125rem
      width 49.29%
      height auto

      .img-wrapper
        width 100%
        height 7.1875rem
        overflow hidden
        position relative
        text-align center
        img
          width atuo
          height 100%
          border-radius 0.25rem

      .info-wrapper
        display block
        box-sizing border-box
        width 100%
        height auto
        padding 0 0.40625rem

        .name
          // height 3.1875rem
          padding-top 0.5rem
          line-height 1.5
          font-size 1rem
          color rgba(61,58,57,1)
          line-clamp 2
          overflow hidden
          display -webkit-box
          text-overflow ellipsis
          -webkit-line-clamp 2
          -webkit-box-orient vertical


        .price
          margin 0.25rem 0
          color #999
          font-size 0.8125rem
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          span
            display inline-block
            margin-left 0.4rem

        .now-price
          display flex
          justify-content flex-start
          align-items center
          span
            padding-left: 0;
            font-weight: bold;
            font-size: 0.75rem;
            color: rgba(179,151,93,1)
            span
              font-weight 600
              font-size 1rem
              margin-left 0.2rem
          img
            width 2rem
            height auto
            margin-top 0rem
            margin-left 0.2rem

  .single-big-wrap
    .recommend-item-wrapper
      width 100%
      height auto

      .img-wrapper
        position relative
        border-radius 0.5rem
        overflow hidden
        width 100%
        height 14.625rem
        text-align center
        img
          width auto
          height auto

      .info-wrapper
        display block
        box-sizing border-box
        width 100%
        height auto
        padding 0 0.40625rem

        .name
          // height 3.1875rem
          padding-top 0.5rem
          line-height 1.5
          font-size 1rem
          color rgba(61,58,57,1)
          line-clamp 2
          overflow hidden
          display -webkit-box
          text-overflow ellipsis
          -webkit-line-clamp 2
          -webkit-box-orient vertical


        .price
          margin 0.25rem 0
          color #999
          font-size 0.8125rem
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          span
            display inline-block
            margin-left 0.4rem

        .now-price
          display flex
          justify-content space-between
          align-items flex-end
          .left
            span
              padding-left: 0;
              font-weight: bold;
              font-size: 0.75rem;
              color: rgba(179,151,93,1)
              span
                font-weight 600
                font-size 1rem
                margin-left 0.2rem
            img
              width 2rem
              height auto
              margin-top 0rem
              margin-left 0.2rem

          button
            outline none
            background #fff
            border 1px solid rgba(255,46,0,1)
            border-radius 1rem
            font-size 0.875rem
            color rgba(255,46,0,1)
            padding 0
            margin 0
            min-width 5rem
            height 1.75rem
</style>


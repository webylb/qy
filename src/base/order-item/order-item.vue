<template>
    <div @click="detail" class="order-item">
      <img :src="itemData.cover" alt="">
      <div class="order-info">
        <p class="title">{{itemData.skuName}}</p>
        <!-- <p class="kind"><span>规格：{{itemData.specValueStr}}</span><span>x{{itemData.count}}</span></p> -->
        <p class="price">{{price(0,itemData.money)}}</p>
      </div>
    </div>
</template>

<script>
  import tool from '../../common/js/util'
  export default {
    name: 'order-item',
    props:{
      itemData:{
        type:Object,
        default:null
      }
    },
    methods:{
      price(a,b){
        return tool.priceStr(a,b)
      },
      detail(){
        this.$emit('detail')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.order-item
  font-size 0.813rem
  color #333
  width 100%
  padding 0 0 0.75rem 8rem
  min-height 6.406rem
  box-sizing border-box
  position relative
  .order-info
    min-height 5rem
    display flex
    flex-direction column
    justify-content space-between
    .title
      text-overflow: ellipsis;
      white-space:nowrap;
      overflow:hidden;
      line-height 1.439rem
    .kind
      display flex
      padding-top 0.313rem
      font-size 0.75rem
      justify-content space-between
      color #999
    .price
      font-size 0.875rem
      color #ff4800
      padding-top 1rem
  img
    position absolute
    left 0
    top 0
    width 7.5rem
    height 5rem
</style>

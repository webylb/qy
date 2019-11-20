<template>
    <div @click="detail" class="order-item">
      <img :src="itemData.cover" alt="">
      <div class="order-info">
        <p class="title" style="-webkit-box-orient: vertical">{{itemData.skuName}}</p>
        <p v-show="itemData.payTime" class="time">{{timeFormat(itemData.payTime)}}</p>
        <!-- <p class="kind"><span>规格：{{itemData.specValueStr}}</span><span>x{{itemData.count}}</span></p> -->
        <p class="price" v-if="itemData.money">¥ <span>{{price(0,itemData.money)}}</span></p>
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
      timeFormat(e) {
        return tool.formatDate(e, 'Y/M/DH')
      },
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
  font-size 0.94rem
  color rgba(61, 58, 57, 1)
  width 100%
  padding 0 0 0.63rem 10.13rem
  min-height 6.406rem
  box-sizing border-box
  position relative
  .order-info
    min-height 6.25rem
    position relative
    padding 0.3rem 0 0.5rem
    box-sizing border-box
    .title
      line-clamp 2
      overflow hidden
      display -webkit-box
      text-overflow ellipsis
      -webkit-line-clamp 2
      -webkit-box-orient vertical
      font-size 0.94rem
      line-height 1.4
      color rgba(61,58,57,1);
    .kind
      display flex
      padding-top 0.313rem
      font-size 0.75rem
      justify-content space-between
      color #999
    .time
      margin-top 0.2rem
      font-size:0.69rem;
      line-height:1rem;
      color:rgba(153, 153, 153, 1);
    .price
      position absolute
      bottom 0.5rem
      left 0
      font-size 0.75rem
      color rgba(61, 58, 57, 1)
      padding-top 1rem
      span
        font-size 0.94rem
  img
    position absolute
    left 0
    top 0
    width 9.38rem
    height 6.25rem
    border-radius 0.25rem
</style>

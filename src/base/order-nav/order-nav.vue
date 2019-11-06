<template>
  <div class="order-nav">
    <div class="nav-item" @click="handleNav(index)"
         v-for="(item,index) in navList" :key="index"
         :class="activeIndex===index?'active':''">{{item}}
      <div v-show="item==='待付款' && numData.unpaidOrderCount!==0"
           :class="numData.unpaidOrderCount>9?'num1':'num'">
        {{numData.unpaidOrderCount}}
      </div>
      <div v-show="item==='待激活' && numData.unShipOrderCount!==0"
           :class="numData.unShipOrderCount>9?'num1':'num'">
        {{numData.unShipOrderCount}}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'order-nav',
    data() {
      return {
        navList: ['全部', '待付款', '待激活', '待发货', '已完成']
      }
    },
    props: {
      numData: {
        type: Object,
        default: {
          unReceiptOrderCount: 0,
          unShipOrderCount: 0,
          unpaidOrderCount: 0
        }
      },
      activeIndex: {
        type: Number,
        default: 0
      }
    },
    methods: {
      handleNav(e) {
        this.$emit('handleNav', e)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .order-nav
    background-color: #ffffff;
    box-shadow: 0rem 0.063rem 0.25rem 0rem rgba(102, 102, 102, 0.3);
    display flex
    justify-content space-around
    .nav-item
      flex 1
      position relative
      text-align center
      height 2.75rem
      line-height 2.75rem
      font-size 0.875rem
      color #666
      .num, .num1
        font-size 0.75rem
        box-sizing border-box
        border 1px solid #ff4800
        color #ff4800
        position absolute
        right 0.3rem
        min-width 1rem
        height 1rem
        border-radius 0.5rem
        text-align center
        line-height 1rem
        background-color #fff
        top 0.5rem
      .num1
        padding 0 3px
    .active
      color #ff4800
      position relative
      &:before
        content ''
        position absolute
        width 2.188rem
        left 50%
        transform translate(-50%, -50%)
        bottom 0
        height 0.094rem
        background-color #ff4800
</style>

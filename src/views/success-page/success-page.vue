<template>
  <div class="redemption-success">
    <scroll :pullup="true"
            @scrollToEnd="loadMore"
            :data="list" class="redemption-scroll" ref="redemptionScroll">
      <div>
        <p class="success-icon"><i class="iconfont">&#xe644;</i></p>
        <p class="success-p">恭喜您购买成功!</p>
        <p class="success-p2">商品将在 <span>3</span> 分钟内到账!</p>
        <div class="operation-wrapper">
          <div @click="toMoney" class="left">继续购买</div>
          <div @click="toRedemption" class="right">查看订单</div>
        </div>
        <loading v-show="showLoad" class="loading"
                 :title="loadingTitle"></loading>
      </div>
    </scroll>
  </div>

</template>

<script>
  import tool from '../../common/js/util'
  import Loading from '../../base/loading/loading'
  import Scroll from '../../base/scroll/scroll'

  export default {
    name: 'redemption-success',
    data() {
      return {
        recommendData: [],
        list: [],
        value: '',
        currentPage: 1,
        pageSize: 10,
        loadingTitle: '正在加载...',
        showLoad: true,
        noSearch: false
      }
    },
    components: {
      Loading,
      Scroll
    },
    created() {
      document.title = this.$route.meta.title     // console.log(this.$route.query.cartIds)

      this.getLikeGoods()
    },
    methods: {
      loadImage() {
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          this.$refs.redemptionScroll.refresh()
        }, 500)
      },
      toMoney() {
        this.$router.push({path: '/member'})
      },
      toRedemption() {
        this.$router.push({path: '/orderForm'})
      },
      getLikeGoods() {
        this.showLoad = false
      },
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .redemption-success
    text-align center
    .redemption-scroll
      position fixed
      top 0
      left 0
      right 0
      bottom 0
      background-color #f5f5f5
      .success-icon
        padding-top 3.1rem
        i
          font-size 5rem
          color #00d500;
      .success-p
        font-size 1.25rem
        padding-top 1.5rem
      .success-p2
        font-size 1rem
        padding-top 0.5rem
        span
          font-size 1.25rem
          color  #ff4800
      .operation-wrapper
        width 82.61%
        margin 0 auto
        padding-top 3rem
        display flex
        justify-content space-between
        div
          width 8.375rem
          height 2.75rem
          line-height 2.75rem
          border-radius 0.313rem
          color #ff4800
          font-size 1.125rem
          border 1px solid #ff4800
        .right
          color #fff
          background-color #ff4800
      .tuijian
        padding 0 4.27%
        .you-like
          margin 4rem 0 0.375rem 0
        .list-wrapper
          text-align left
          width 100%
          padding 0.625rem 0 1rem
          box-sizing border-box
          margin 0 auto
          .list
            display flex
            justify-content space-between
            flex-wrap wrap
            padding-bottom 1rem
            .list-item
              width 49.43%
              overflow hidden
              border-radius 0.25rem
              margin-bottom 0.25rem
              break-inside: avoid;
</style>

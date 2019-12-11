<template>
  <div class="redemption-success">
    <scroll :pullup="true"
            @scrollToEnd="loadMore"
            :data="list" class="redemption-scroll" ref="redemptionScroll">
      <div>
        <p class="success-icon">
          <img src="./images/success.png" alt="">
        </p>
        <p class="success-p">恭喜您购买成功!</p>
        <p class="success-p2">收到卡券内请在<span>一个月</span>内使用！</p>
        <div class="operation-wrapper">
          <!-- <div @click="toMoney" class="left">继续购买</div> -->
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
        padding-top 5.63rem
        img 
          width 4.19rem
          height 5.44rem
      .success-p
        font-size 1.13rem
        padding-top 1.5rem
        color rgba(61,58,57,1)
      .success-p2
        font-size 0.88rem
        padding-top 0.75rem
        color rgba(153, 153, 153, 1)
        span
          font-size 0.88rem
          color rgba(196, 143, 73, 1)
      .operation-wrapper
        width 82.61%
        margin 0 auto
        padding-top 3rem
        display flex
        justify-content center
        div
          width 8.375rem
          height 2.5rem
          line-height 2.5rem
          font-size 1.125rem
          border-radius 0.25rem
          border 1px solid rgba(196, 143, 73, 1)
        .left 
          color rgba(196, 143, 73, 1)
        .right
          color rgba(196, 143, 73, 1)
          background-color rgba(196, 143, 73, 1)
          color #fff
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

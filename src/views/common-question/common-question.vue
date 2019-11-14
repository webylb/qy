<template>
  <div class="common-question">
    <scroll ref="centerScroll" class="center-scroll">
      <div>
        <div v-if="!loaded" class="main-wrapper">
          <div class="wrap">
            <div class="wrap-title">会员相关问题</div>
            <van-collapse v-model="activeNames" accordion>
              <van-collapse-item name="1" :border=false>
                <div slot="title">
                  <div class="q-title">
                    <span class="num">Q1</span> <span class="text">会员可以享受哪些权益？</span>
                  </div>
                </div>
                <div class="des">
                  根据您购买的会员卡类型，可享受不同的会员权益。具体权益内容可在商品页中查看，主要包含商品权益及会员专属服务权益。 
                </div>
              </van-collapse-item>
              <van-collapse-item name="2" :border=false>
                <div slot="title">
                  <div class="q-title">
                  <span class="num">Q2</span> <span class="text">直充商品未到账怎么办？</span>
                  </div>
                </div>
                <div  class="des">
                  直充商品支付后若10分钟内未到账，请您仔细核对充值账号是否正确，可联系人工客服为您解决。 
                </div>
              </van-collapse-item>
              <van-collapse-item name="3" :border=false>
                <div slot="title">
                  <div class="q-title">
                    <span class="num">Q3</span> <span class="text">卡券商品点击“激活并使用”后未收到卡券怎么办？ </span>
                  </div>
                </div>
                <div  class="des">
                  卡券商品购买后点击“激活并使用”后未收到卡券，请联系人工客服为您解决。
                </div>
              </van-collapse-item>
            </van-collapse>
          </div>
        </div>
        <loading v-else style="padding-top: 50%"></loading>
      </div>
    </scroll>
    <div class="coupon-customer-service">
      <!-- 客服电话：<a href="tel:4006680091">4006680091</a> 转 2 -->
      <van-divider :style="{ fontSize: '0.75rem',color: 'rgba(61, 58, 57, 1)', borderColor: 'rgba(221, 221, 221, 1)', padding: '0 3rem' }">
        客服电话：<a href="tel:4006680091">4006680091</a>&nbsp;转&nbsp;<span>2</span>
      </van-divider>
    </div>
  </div>
</template>

<script>
  import { Collapse, CollapseItem, Divider } from 'vant';
  import Scroll from '../../base/scroll/scroll'
  import Loading from '../../base/loading/loading'
  import * as core from '../../api/member'
  import tool from '../../common/js/util'

  export default {
    name: "commonQuestion",
    components: {
      Scroll,
      Loading,
      [Collapse.name]: Collapse,
      [CollapseItem.name]: CollapseItem,
      [Divider.name]: Divider
    },
    data() {
      return {
        merchantId: window.infoData.merchantId || '',
        loaded: true,
        activeNames: '1'
      }
    },
    created() {
      setTimeout(() => {
        this.loaded = false
      },200)
    },
    methods: {
    
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .common-question
    .center-scroll
      position fixed
      top 0
      left 0
      right 0
      bottom 0
      max-width 750PX
      // margin 0 auto
      z-index 10
      background rgba(255,255,255,1)
      padding-top 1.56rem
      .wrap
        background-color rgba(255, 255, 255, 1)
        margin-bottom 0.75rem
        .wrap-title
          margin 0 0.75rem 1rem
          font-size:1rem;
          font-weight:bold;
          color:rgba(61,58,57,1);
          text-indent 0.72rem
          position relative
          &::before
            content ''
            position absolute
            left 0
            top 0px
            width:0.25rem;
            height:1rem;
            background:rgba(196,143,73,1);    
        .q-title
          display flex
          justify-content flex-start
          .num 
            color rgba(196, 143, 73, 1)
            font-size:1.13rem;
            margin-right 0.3rem
          .text
            font-size:0.88rem;
            color:rgba(61,58,57,1);
        .des
          background:rgba(245,245,245,1);
          padding 0.75rem
          box-sizing border-box
          border-radius 0.25rem
          color rgba(102, 102, 102, 1)
  .coupon-customer-service
    font-size 0.75rem
    color #999999
    position fixed
    left 0
    right 0
    bottom 0
    text-align center
    z-index 11
    a
      font-size: 0.75rem;
      font-weight: normal;
      letter-spacing: 0rem;
      color: rgba(73, 109, 94, 1)
    span
      color: rgba(73, 109, 94, 1)


.common-question /deep/ .van-collapse-item__content {
  padding-top 0
  padding-bottom 1.2rem
}

.common-question /deep/ .van-cell {
  padding: 1.2rem 1rem;
}
</style>

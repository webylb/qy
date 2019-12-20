<template>
  <div>
  <div class="coupon-bag-toast" ref="couponBagToast" :style="couponBagToastStyle">
    <Scorll ref="toastScroll" class="toast-scroll">
      <div>
        <div class="coupon-bag-toast-wrap" v-if="itemCouponDetail">
          <div class="coupon-bag-toast-title">
            <div class="left-line"></div>
            <div class="title-text">
              【{{ itemCouponDetail.itemName }}】
            </div>
            <div class="right-line"></div>
          </div>
          <div class="coupon-bag-toast-sub-title" v-if="itemCouponDetail.ticketType == 'DiJiaQuan'">
            <div class="title-text">
              {{ itemCouponDetail.skuName }}
            </div>
          </div>
          <div class="coupon-bag-toast-sub-title coupon-bag-toast-sub-title2">
            <div class="title-text">
              {{ itemCouponDetail.ticketName }}
            </div>
          </div>
          <div class="img-list">
            <div v-if="itemCouponDetail.count > 1">
              <slider class="slider-toast-warp" :loop="false" :auto-play="false" ref="toastSlider">
                <div class="slider-toast-page" v-for="(item, index) in itemCouponDetail.couponList" :key="index">
                  <div class="slider-toast-item" v-for="(i, index2) in item" :key="index2">
                    <div class="default-coupon" :class="[index2 === useIndex && index == usePageIndex ? 'actice-coupon' : '', i.isUsed == 'N' ? '' : 'used-coupon']">
                      <div class="used" v-if="i.isUsed === 'Y' && i.orderStatus === 'WAIT'">
                          <div class="used-text used-wait-text">待支付</div>
                      </div>
                      <div class="used" v-if="i.isUsed === 'Y' && i.orderStatus === 'SUCCESS'">
                          <div class="used-text">已使用</div>
                          <div class="used-time">
                            {{ formatDate(i.useTime) }}
                          </div>
                      </div>
                      <img :src="itemCouponDetail.ticketImageUrl" alt="">
                      <span></span>
                    </div>
                  </div>
                </div>
              </slider>
            </div>
            <div v-else class="single-coupon" :class="[itemCouponDetail.recordResults[0].isUsed == 'N' ? 'actice-coupon' : 'used-coupon']">
                <div class="used" v-if="itemCouponDetail.recordResults[0].isUsed == 'Y' && itemCouponDetail.recordResults[0].orderStatus === 'WAIT'">
                  <div class="used-text used-wait-text">待支付</div>
              </div>
              <div class="used" v-if="itemCouponDetail.recordResults[0].isUsed == 'Y' && itemCouponDetail.recordResults[0].orderStatus === 'SUCCESS'">
                  <div class="used-text">已使用</div>
                  <div class="used-time">
                    {{ formatDate(itemCouponDetail.recordResults[0].useTime) }}
                  </div>
              </div>
              <img :src="itemCouponDetail.ticketImageUrl" alt="">
              <span></span>
            </div>
          </div>
          <div class="instructions" v-html="itemCouponDetail.instructions"></div>
        </div>
      </div>
    </Scorll>
    <div class="use-btn">
      <button  v-if="itemCouponDetail && itemCouponDetail.count > 1" type="button" @click="goUse()">前去使用</button>
      <button  v-if="itemCouponDetail && itemCouponDetail.count == 1" type="button" @click="goUse(itemCouponDetail.recordResults[0].receiveImmediatelyUrl)">前去使用</button>
    </div>
  </div>
  </div>
</template>

<script>
  import Scorll from '../../base/scroll/scroll'
  import Slider from '../../base/slider/slider'
  import tool from '../../common/js/util'
  export default {
    name: "couponBagToast",
    components: {
      Slider,
      Scorll
    },
    props:{
      itemCouponDetail:{
        type: Object 
      },
      couponBagToastStyle: {
        type: String
      },
      useIndex: {
        type: Number
      },
      usePageIndex: {
        type: Number
      }
    },
    methods:{
      formatDate(val){
        return tool.formatDate(val,1)
      },
      goUse(url){
        this.$emit('goUse', url)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.coupon-bag-toast
  position absolute
  bottom 0
  left 0
  text-align center
  width 100%
  max-width 750PX
  z-index 101
  background #fff
  overflow hidden
  border-radius 0.5rem 0.5rem 0rem 0rem
  .toast-scroll
    position absolute
    top 0
    bottom 3rem
    left 0
    right 0
    text-align center
    width 100%
    max-width 750PX
    z-index 101
  .coupon-bag-toast-wrap
    height 100%
    width 100%
    max-width 750PX
    background #fff
    padding 1.25rem 0
    box-sizing border-box
    .coupon-bag-toast-title
      height 1rem
      display flex
      justify-content flex-start
      align-items center
      margin-bottom 0.625rem
      box-sizing border-box
      padding 0 0.75rem
      .right-line, .left-line
        flex 1
        height 1px
        background #b78231
      .title-text
        font-size 1rem
        font-weight bold
        line-height 1.375rem
        letter-spacing 0rem
        color #b78231
        text-align center

    .coupon-bag-toast-sub-title
      margin-bottom 0.625rem

    .coupon-bag-toast-sub-title2
      color #999999
      font-size 0.875rem

    .img-list
      margin-top 1.128rem
      position relative
      padding 0.5rem 0
      .single-coupon
        border: solid 0.063rem #eee;
        margin 0 auto
        text-align center
        height 4.406rem
        width 6.594rem
        border-radius: 0.25rem;
        position relative
        overflow hidden
        img
          width auto
          height 4.406rem
        .used
          position absolute
          left 0
          top 0
          width 100%
          height 100%
          z-index 1
          .used-text
            position absolute
            left 50%
            top 0.469rem
            width 2.5rem
            height 2.5rem
            line-height 2.5rem
            text-align center
            transform translateX(-50%)
            color #fff
            background rgba(0,0,0,0.5)
            border-radius 50%
            font-size 0.688rem
          .used-wait-text
            top 50%
            transform translate(-50%, -50%)
          .used-time
            position absolute
            left 0
            bottom 0
            height 1rem
            line-height 1rem
            width 100%
            color #fff
            background rgba(0,0,0,0.5)
            font-size  0.625rem
      .actice-coupon
        border: solid 0.063rem #feac36;
        span
          position absolute
          right 0.313rem
          bottom 0.313rem
          width 1.156rem
          height 1.156rem
          background url('./images/check.png') no-repeat center
          background-size 100% 100%
      .used-coupon
        opacity 0.5
      .slider-toast-warp
        .slider-toast-page
          width 100%
          display flex
          justify-content flex-start
          flex-wrap wrap
          box-sizing border-box
          padding 0 0.75rem
          .slider-toast-item
            margin 0 0.26rem
            margin-bottom 0.9rem
            height 4.406rem
            width 6.594rem
            .default-coupon
              border: solid 0.063rem #eee;
              border-radius 0.25rem
              margin 0 auto
              overflow hidden
              position relative
              height 4.406rem
              width 6.594rem
              text-align center
              img
                width auto
                height 4.406rem
                margin 0 auto
              .used
                position absolute
                left 0
                top 0
                width 100%
                height 100%
                z-index 1
                .used-text
                  position absolute
                  left 50%
                  top 0.469rem
                  width 2.5rem
                  height 2.5rem
                  line-height 2.5rem
                  text-align center
                  transform translateX(-50%)
                  color #fff
                  background rgba(0,0,0,0.5)
                  border-radius 50%
                  font-size 0.688rem
                .used-wait-text
                  top 50%
                  transform translate(-50%, -50%)
                .used-time
                  position absolute
                  left 0
                  bottom 0
                  height 1rem
                  line-height 1rem
                  width 100%
                  color #fff
                  background rgba(0,0,0,0.5)
                  font-size  0.625rem

            .actice-coupon
              position relative
              border: solid 0.063rem #feac36;
              box-sizing border-box
              span
                position absolute
                right 0.313rem
                bottom 0.313rem
                width 1.156rem
                height 1.156rem
                background url('./images/check.png') no-repeat center
                background-size 100% 100%

    .instructions
      margin-top 0.85rem
      box-sizing border-box
      padding 0 0.75rem
      text-align left
      word-break break-all
      line-height 1.2
      font-size 0.938rem
      p
        line-height 1.375rem
        text-align left
        font-size 0.938rem
        color #333333
        &:first-child
          font-size 1rem
          span
            color #b78231
            margin-right 0.281rem
  .use-btn
    position absolute
    bottom 0
    left 0
    width 100%
    max-width 750PX
    z-index 102
    button
      outline none
      border none
      width 100%
      height 3rem
      background-color rgba(196,143,73,1);
      color #fff
      font-size 1.125rem

</style>

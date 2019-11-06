<template>
  <div class="coupon-goods home-page" ref="homePage">
    <shop-header ref="shopHeader" v-if="showHeader" style="position: absolute;top:0;left: 0;z-index: 999" line-style="background:#fff" :title="title"></shop-header>
    <div :style="couponGoodsStyle" class="couponGoodsContent" ref="couponGoodsContent" v-show="!showLoad">
      <div class="goods-detail" v-if="prodData">
        <div class="goods-cont">
          <div class="goods-img">
            <img :src="prodData.cover" alt="">
          </div>
          <div class="goods-attr">
            <div class="goods-name">
              <span class="name">{{ prodData.title }}</span>
              <span class="num">x1</span>
            </div>
            <div class="goods-price">
              <span class="unit">¥ </span>
              <span class="price">{{ priceToFixed(prodData.marketPrice) }}</span>
              <span>官方价</span>
            </div>
          </div>
        </div>
        <div class="use-cont-hint">
          <div class="use-wrap">
            <div class="v-ext">
              商品原价
            </div>
            <div class="v-price">
              ¥ {{ priceToFixed(prodData.marketPrice) || '--' }}
            </div>
          </div>
        </div>
        <div class="use-cont-hint">
          <div class="use-wrap">
            <div class="v-ext">
              抵用券
            </div>
            <div class="v-price">
              -¥ {{ priceToFixed(prodData.deductionPrice) || '--' }}
            </div>
          </div>
        </div>
        <div class="use-cont-hint">
          <div class="use-wrap">
            <div class="v-ext">
            </div>
            <div class="v-price">
              <span class="all-price-text">总计:</span><span class="all-price"><span>¥</span>{{ priceToFixed(prodData.payPrice) || '--' }}</span>
            </div>
          </div>
        </div>
        <p class="customer-service-text">
          客服电话: <a href="tel:4006680091" style="letter-spacing: 0rem;color: #42b0e9;font-size: 0.875rem;">4006680091 转 2 </a>
        </p>
      </div>
    </div>

    <div class="immediate-payment fadeIn" ref="immediatePayment" v-if="prodData">
      <div class="pay-hint">
        <div class="pay-pricetext">还需支付:</div>
        <div class="pay-goodprice"> <span> ¥ </span> {{ priceToFixed(prodData.payPrice) || '--' }}</div>
      </div>
      <div class="pay-btn" @click="immediatePay">
        去支付
      </div>
    </div>
    <loading v-show="showLoad" style="padding-top: 50%"></loading>
  </div>
</template>

<script>
  import BScroll  from 'better-scroll'
  import ShopHeader from '../../base/shop-header/shop-header'
  import Loading from '../../base/loading/loading'
  import * as core from '../../api/couponBag'
  import tool from '../../common/js/util'
  import wxShareMixin from '../../common/js/wxShareMixin'

  export default {
    components: {
      ShopHeader,
      Loading
    },
    mixins:[wxShareMixin],
    data () {
      return {
        merchantName: window.infoData.merchantName,
        merchantId: window.infoData.merchantId,
        loadingTitle: '加载中...',
        showLoad: true,
        showHeader: false,
        title: "收银台",
        couponGoodsStyle: "",
        prodData: null,
        cover: "",
        code: null,
        skuId: null,
        providerId: null,
        outItemNo: null,
        isPaying: true,
        shareUrl: location.href,
        shareLink:  window.location.href,  //分享出去的链接
        shareTitle: '',  //分享的标题
        shareDesc: '', //分享的详情介绍
        shareImgUrl: '',
        codeStatus: null,
        account: null
      }
    },
    beforeCreate() {

    },
    created () {
      document.title = this.$route.meta.title

      //判断是否为微信
      let ua = navigator.userAgent.toLowerCase();
      let isWeixin = ua.indexOf('micromessenger') != -1;
      if (!isWeixin) {
        this.showHeader = true
        this.couponGoodsStyle = "top:2.75rem"
      } else {
        this.showHeader = false
        this.couponGoodsStyle = "top:0rem"
      }
      if(!this.$route.query.code){
        this.$toastBox.showToastBox("无效礼品码")
        this.$router.go(-1)
        return;
      }else{
        this.merchantGiftPackageId = this.$route.query.merchantGiftPackageId
        this.code = this.$route.query.code
        this.account = this.$route.query.account
      }

      this.getItemCouponSkuDetail()

    },
    mounted(){

    },
    methods: {
      priceToFixed(val){
        if(val){
          return (val).toFixed(2)
        }else{
          return ''
        }
      },
      scrollToTop(){
        window.scrollBy(0,1)
      },
      changeTitle(){
        let head = document.getElementsByTagName('head');
        let meta = document.createElement('meta');
        head[0].appendChild(meta)
        document.title = this.title
      },
      onLoaded(){
        //this.scroll.refresh()
      },
      getItemCouponSkuDetail(){
        core.getItemCouponSkuDetail({code: this.code, merchantId: this.merchantId}).then(res => {
          //console.log(res)
          if(res.code && '00' == res.code){
            this.showLoad = false
            this.prodData = res.result.qySkuResultList[0]
            this.cover = res.result.qySkuResultList[0].cover
            this.skuName = res.result.qySkuResultList[0].title
            this.skuId = res.result.qySkuResultList[0].id
            this.providerId = res.result.qySkuResultList[0].providerId
            this.outItemNo = res.result.qySkuResultList[0].outItemNo
            //this._initScroll()
          } else if (res.code && '02' === res.code){
            //this.$toastBox.showToastBox(res.message)
            //this.$router.push('/orderForm')
            this.codeStatus = 'used'
            let timer = null
            clearTimeout(timer)
            timer = setTimeout(() => {
              this.$router.go(-1)
            }, 1500)
          } else {
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(error => {
          this.$toastBox.showToastBox("网络错误")
        })
      },
      _initScroll () {

        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.couponGoodsContent,{
            probeType: 3,
            startY: 0,
            bounce: false,
            click: true
          })
        }else{
          this.scroll.refresh()
        }

      },
      immediatePay(){
        if(this.isPaying){
          this.isPaying = false
          this.toPlay()
        }else{
          this.$toastBox.showToastBox("请求中...")
        }
      },
      toPlay(){
        let data = {}
        if(this.account){
          data.account = this.account
        }
        data.returnUrl  = window.location.href.split(".html")[0]+'.html/successPage'
        data.skuId      = this.skuId
        data.providerId = this.providerId,
        data.outItemNo  = this.outItemNo,
        data.code       = this.code
        core.payItemCouponSkuOrder(data).then(res => {
          if(res.code && '00' == res.code){
            if(res.result.goUrl){
              window.location.href = res.result.goUrl
              this.isPaying = true
            }
          }else if(res.code && '01' === res.code && res.isLogin == 'false'){
            this.isPaying = true
            if(res.url){
              var index = res.url.lastIndexOf("\/");
              var str = res.url.substring(index, res.url.length);
              let regIndex = /\?/gi;
              if(str && regIndex.test(str)){
                window.location.href = res.url + "&referer=" + encodeURIComponent(tool.replaceUrlForUrpass(window.location.href))
              }else{
                window.location.href = res.url + "?referer=" + encodeURIComponent(tool.replaceUrlForUrpass(window.location.href))
              }
            }
          } else {
            this.isPaying = true
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(error => {
          this.isPaying = true
          this.$toastBox.showToastBox("网络错误")
        })
      }
    }
  }
</script>


<style lang="stylus" rel="stylesheet/stylus" scoped>
  .coupon-goods
    background-color #fff
    .immediate-payment
      position fixed
      left 0
      bottom 0
      right 0
      width 100%
      max-width 750PX
      height 3.063rem
      line-height 3.063rem
      background-color #fff
      color rgb(111,65,9)
      font-size 1.125rem
      font-weight 600
      display flex
      align-items center
      .pay-hint
        flex 1
        height 3.063rem
        padding-left 1rem
        display flex
        .pay-pricetext
          font-size 0.938rem
          color: #2d2b32
          font-weight 600
        .pay-goodprice
          font-size 1.25rem
          font-weight 600
          color #ff1414
          padding-left 0.5rem
          span
            font-size 0.938rem
            font-weight 600
      .pay-btn
        width 8.75rem
        background-image: linear-gradient(90deg,#f6cf8d 0%,#fbe5b8 100%);
        font-size 1.125rem
        font-weight 600
        color #2d2b32
        text-align center
        box-sizing border-box

    .couponGoodsContent
      position fixed
      left 0
      top 0
      right 0
      bottom 3.063rem
      width 100%
      max-width 750PX
      background-color rgb(245,245,245)
      padding-bottom 0.063rem
      .goods-detail
        min-height 1px
        .goods-cont
          padding 1.25rem 0.75rem
          display flex
          justify-content flex-start
          background #fff
          margin-bottom 0.5rem
          .goods-img
            height 4.406rem
            width 6.594rem
            img
              width 100%
              height auto
              object-fit cover
          .goods-attr
            flex 1
            margin-left 0.625rem
            position relative
            .goods-name
              display flex
              justify-content space-between
              font-size  0.938rem
              .name
                color #333
              .num
                color #999
            .goods-price
              position absolute
              bottom 0
              left 0
              font-size 0.813rem
              color #999999
              span
                display inline-block
              .unit
                color #ff4800
                font-weight bold
              .price
                color #ff4800
                font-size 1.125rem
                font-weight bold
                margin-right 0.5rem
                margin-left 0.2rem

        .use-cont-hint
          padding 0 0.75rem
          box-sizing border-box
          background #ffffff
          &:nth-last-child(2)
            .use-wrap
              border-bottom none
          .use-wrap
            height 3rem
            width 100%
            display flex
            justify-content space-between
            align-items center
            box-sizing border-box
            border-bottom 1px solid #e6e6e6
            .v-ext
              font-size 0.938rem
              color #333
            .v-price
              font-size 0.75rem
              color #999
              .all-price-text
                font-size 0.938rem
                color #333
              .all-price
                font-size 0.938rem;
                color #ff1414
                margin-left 0.3rem
                span
                  font-size 0.75rem
                  display inline-block
                  margin-right 0.2rem
        .customer-service-text
          position absolute
          bottom 2rem
          width 100%
          max-width 750PX
          text-align center
          color #999
          font-size 0.875rem

        .good-descript
          margin-top 0.5rem
          padding 0 0.75rem
          box-sizing border-box
          background #ffffff
          .good-descript-title
            padding-top 0.75rem
            margin-bottom 0.938rem
            font-size 1.063rem
            height 1rem
            position relative
            padding-left 0.5rem
            &:before
              position absolute
              left 0
              bottom 0
              content ""
              width 0.188rem
              height 1rem
              background-color #ff4800
	            border-radius 0.094rem
          .good-descript-text
            padding-bottom 0.5rem
            font-size 0.813rem
            text-align justify
            text-justify newspaper
            word-break normal
            overflow hidden
            line-height 1.2rem
            padding-top 0.2rem
            p
              text-align justify
              text-justify newspaper
              word-break normal
              overflow hidden
            span
              text-align justify
              text-justify newspaper
              word-break normal
              overflow hidden

// 改变placeholder
::-webkit-input-placeholder { /* WebKit, Blink, Edge */
  color:  #c1c1c1;
}
:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
  color: #c1c1c1;
}
::-moz-placeholder { /* Mozilla Firefox 19+ */
  color:  #c1c1c1;
}
:-ms-input-placeholder { /* Internet Explorer 10-11 */
  color:  #c1c1c1;
}

// 改变后来生成html样式
.good-descript-text >>> p + p
  margin-top 0.375rem

.good-descript-text >>> p > img
  //margin 0 auto
  width 100%
  height auto
  padding 0.4rem
  box-sizing border-box


.good-descript-text >>> b
  font-weight bold !important

.good-descript-text >>> strong
  font-weight bold

@-webkit-keyframes fadeIn {
    from {
      opacity: 0.5
    }
    to {
      opacity: 1
    }
}

@keyframes fadeIn {
    from {
        opacity: 0.5
    }
    to {
        opacity: 1
    }
}
</style>

<template>
  <div class="coupon-goods home-page" ref="homePage">
    <shop-header ref="shopHeader" v-if="showHeader" style="position: absolute;top:0;left: 0;z-index: 999" line-style="background:#fff" :title="title"></shop-header>
    <div :style="couponGoodsStyle" class="couponGoodsContent" ref="couponGoodsContent" v-show="!showLoad">
      <div class="goods-detail">
        <div v-if="swiperList" class="goods-list" ref="goodsList">
          <div class="goodsList-wrapper" ref="goodsListWrapper">
            <div v-for="(item,index) in swiperList" :key="index" class="goods-item" ref="goodsItem">
              <div class="good-item-content">
                <img class="good-item-img" :src="item.cover" :alt="item.title" @load="onLoaded">
                <p class="good-item-title" style="-webkit-box-orient: vertical">{{ item.title }}</p>
                <p class="good-item-marketPrice">
                  <span class="marketPrice">
                    <span class="slogn">¥</span>
                    <span class="price">{{ priceToFixed(item.marketPrice) }}</span>
                    <span class="text">官方价</span>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div v-if="rechargeType == 1" class="shop-num shop-recharge-wrap">
          <div class="shop-num-hint">
            <div class="hint-text">充值账号：</div>
            <div class="hint-num">
              <input type="number" v-model="rechargeNum" ref="rechargeInputItem" @click.stop="focusInput"  @blur="scrollToTop" :placeholder="rechargePlaceHolder" v-on:keyup="check_count($event)" maxlength="16" />
            </div>
          </div>
        </div>
        <div class="use-cont-hint">
          <div class="use-time">
            <div class="v-ext">
              抵用券
            </div>
            <div class="v-time">
              -¥ {{ priceToFixed(deductionPrice) || '--' }}
            </div>
          </div>
        </div>
        <div class="use-cont-hint">
          <div class="use-time">
            <div class="v-ext">
              发货时间
            </div>
            <div class="v-time">
              3分钟内发货
            </div>
          </div>
        </div>
        <div class="use-cont-hint">
          <div class="use-time">
            <div class="v-ext">
              使用期限
            </div>
            <div class="v-time">
              {{ useExpireTimeLimit  }}
            </div>
          </div>
        </div>
        <div class="good-descript">
          <div class="good-descript-title">商品描述</div>
          <div class="good-descript-text" id="good-descript-text" v-html="goodDescript">{{ goodDescript }}</div>
        </div>
      </div>
    </div>
    <div class="immediate-payment fadeIn" ref="immediatePayment">
      <div class="pay-btn" @click="immediatePay">
        立即购买
      </div>
    </div>
    <loading v-show="showLoad" style="padding-top: 50%"></loading>
    <div class="to-service-wrap">
      <div class="to-service" @click="toServiceCall">
        <img src="./images/coustom_serve.png" alt="">
      </div>
    </div>
    <popup v-show="showCallPopup" :showPopupTitle="false" :defaultBtn="false" phoneNum='4006680091' cancelCart="我知道了" confirmCart="呼叫客服" @confirm="confirmCall" @cancel="cancel">
      <p style="padding: 1.25rem 0.8rem;font-size: 1rem;font-weight: normal;font-stretch: normal;line-height: 1.375rem;letter-spacing: 0rem;color: #333333;text-align:left;">
        客服电话：<a href="tel:4006680091" style="letter-spacing: 0rem;color: #ff4800;">4006680091 转 2 </a>（会员权益业务），如有疑问，请致电工作人员。
      </p>
    </popup>
  </div>
</template>

<script>
  import BScroll  from 'better-scroll'
  import ShopHeader from '../../base/shop-header/shop-header'
  import Popup from '../../base/popup/popup'
  import Loading from '../../base/loading/loading'
  import * as core from '../../api/couponBag'
  import tool from '../../common/js/util'
  import wxShareMixin from '../../common/js/wxShareMixin'

  export default {
    components: {
      ShopHeader,
      Loading,
      Popup
    },
    mixins:[wxShareMixin],
    data () {
      return {
        merchantName: window.infoData.merchantName,
        merchantId: window.infoData.merchantId,
        loadingTitle: '加载中...',
        showLoad: true,
        showHeader: true,
        title: "",
        couponGoodsStyle: "",
        swiperList: [],
        useExpireTimeLimit: '', //使用期限提示
        goodDescript: '',//商品描述
        skuId: null,
        providerId: null,
        outItemNo: null,
        count: null,
        account: null,
        code: null,
        showCallPopup: false,
        isPaying: true,
        shareUrl: location.href,
        shareLink:  window.location.href,  //分享出去的链接
        shareTitle: '',  //分享的标题
        shareDesc: '', //分享的详情介绍
        shareImgUrl: '',
        codeStatus: null,
        rechargeType: null,
        rechargeNum: null,
        rechargePlaceHolder: null,
        deductionPrice: null
      }
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
        this.showHeader=false
        this.couponGoodsStyle = "top:0rem"
      }
      if(!this.$route.query.code){
        this.$toastBox.showToastBox("无效礼品码")
        this.$router.go(-1)
        return;
      }else{
        this.packageId = this.$route.query.packageId
        this.code = this.$route.query.code
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
      focusInput(e){
        e.target.focus()
      },
      scrollToTop(){
        window.scrollBy(0,1)
      },
      check_count(event) {
        let value = event.target.value;
        //console.log(value)
        if(value.length > 16){
          this.$toastBox.showToastBox('最多可输入16位')
          value = value.slice(0,16)
        }
        if (!/^\+?[0-9]*$/.test(value)) {
          this.$toastBox.showToastBox('请输入正确的账号')
          event.target.value = null
        }else{
          event.target.value = value
        }
      },
      changeTitle(){
        let head = document.getElementsByTagName('head');
        let meta = document.createElement('meta');
        head[0].appendChild(meta)
        document.title = this.title;

        let _this = this
        setTimeout(() => {
          let imgDom = document.getElementById('good-descript-text').querySelectorAll('img')
          if (imgDom.length > 0) {
            for (var i = 0; i < imgDom.length; i++) {
              imgDom[i].onload = function () {
                _this.scroll.refresh();
              }
            }
          }
        }, 20)
      },
      onLoaded(){
        this.scroll.refresh()
      },
      _initScroll () {
        // 创建分类列表的Scroll对象
        this.$nextTick(()=>{
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
        })
      },
      getItemCouponSkuDetail(){
        core.getItemCouponSkuDetail({code: this.code, merchantId: this.merchantId}).then(res => {
          //console.log(res)
          if(res.code && '00' == res.code){
            this.title = res.result.title
            this.swiperList = res.result.qySkuResultList
            this.goodDescript = res.result.content
            this.useExpireTimeLimit = res.result.qySkuResultList[0].useExpireTimeLimit
            this.skuId = res.result.qySkuResultList[0].id
            this.providerId = res.result.qySkuResultList[0].providerId
            this.outItemNo = res.result.qySkuResultList[0].outItemNo
            this.deductionPrice = res.result.qySkuResultList[0].deductionPrice
            if(res.result.type && res.result.type === "直充"){
              this.rechargeType = 1
              this.rechargePlaceHolder = res.result.tips
            }else{
              this.rechargeType = 0
            }
            this._initScroll()
            this.changeTitle()
          } else if (res.code && '02' === res.code){
            this.$toastBox.showToastBox("券码已经使用,请到订单中查看")
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
          this.showLoad = false
        }).catch(error => {
          this.showLoad = false
          this.$toastBox.showToastBox("网络错误")
        })
      },
      immediatePay(){
        let data = {}
        if(this.$refs.rechargeInputItem){
          if(this.rechargeNum){
            this.$router.push({path: '/cashier', name: 'cashier', query: {code: this.code, packageId: this.packageId,account:this.rechargeNum}})
          }else{
            this.$toastBox.showToastBox("请输入充值账号!")
            return;
          }
        } else {
          this.$router.push({path: '/cashier', query: {code: this.code, packageId: this.packageId}})
        }
      },
      toServiceCall(){
        // this.showCallPopup = true
        // window.location.href = 'https://tb.53kf.com/code/client/10187208/1'
        tool.callService(this.merchantId)
      },
      confirmCall(){
        this.showCallPopup = false
      },
      cancel(){
        this.showCallPopup = false
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
      color rgb(111,65,9)
      font-size 1.125rem
      text-align center
      font-weight: 600;
      display flex
      align-items center

      .pay-btn
        width 100%
        background-size 100% 100%
        font-size 1.125rem
        font-weight 600
        background-color rgba(196,143,73,1);
        color #fff
        text-align center
        box-sizing border-box

    .to-service-wrap
      position fixed
      bottom 8.5rem
      right 0.75rem
      width 2.375rem
      height 2.375rem
      line-height 2.375rem
      border-radius 50%
      background-color rgb(255,255,255)
      box-shadow 0rem 0.2rem 0.35rem 0rem rgba(0, 0, 0, 0.08)
      text-align center
      color #3992ff
      img 
        width: 1.38rem;
        height: 1.38rem;

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
        .goods-list
          background #fff
          overflow hidden
          margin-bottom 0.5rem
          .goodsList-wrapper
            box-sizing border-box
            .goods-item
              width 100%
              max-width 750PX
              box-sizing border-box
              .good-item-content
                background-color #ffffff
                .good-item-img
                  height auto
                  width 100%
                  display block
                .good-item-title
                  margin 0.9rem 0 0.7rem 0
                  font-size 0.938rem
                  color #333
                  padding 0 0.75rem
                  box-sizing border-box
                  line-clamp 2
                  line-height 1.188rem
                  overflow hidden
                  display -webkit-box
                  text-overflow ellipsis
                  -webkit-line-clamp 2
                  /* autoprefixer: ignore next */
                  -webkit-box-orient: vertical;

                .good-item-marketPrice
                  padding 0 0.75rem
                  font-size 0.688rem
                  margin-bottom 0.7rem
                  box-sizing border-box
                  .marketPrice
                    color #ff4800
                    .slogn
                      display inline-block
                      font-size 0.813rem
                      margin-right 0.2rem
                      font-weight bold
                    .price
                      font-size 1.125rem
                      display inline-block
                      font-weight bold
                    .text
                      display inline-block
                      font-size 0.9rem
                      color #999999
                      transform scale(0.8)
        .shop-num
          padding 0 0.75rem
          box-sizing border-box
          height 3rem
          width 100%
          background #ffffff
          display flex
          justify-content space-between
          align-items center
          .shop-num-hint
            display flex
            align-items center
            .hint-text
              font-size 1.063rem
              color #333
            .hint-num
              margin-left 0.75rem
              font-size 0.75rem
              color #999

        .shop-recharge-wrap
          margin 0.5rem 0
          .shop-num-hint
            height 100%
            width 100%
            .hint-text
              //width 4.5rem
            .hint-num
              height 100%
              margin-left 0
              flex 1
              input
                -webkit-user-select auto
                height 100%
                outline none
                border none
                font-size 1.125rem
                width 100%
                //font-family 'PingFang SC', 'STHeitiSC-Light', 'Helvetica-Light', arial, sans-serif, 'Droid Sans Fallback'

        .use-cont-hint
          padding 0 0.75rem
          box-sizing border-box
          background #ffffff
          &:nth-child(4)
            .use-time
              border-bottom none
              .v-time
                color #ff1414
          .use-time
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
            .v-time
              font-size 0.813rem
              color #ff1414

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
            color rgba(102, 102, 102, 1)
            p
              text-align justify
              text-justify newspaper
              word-break normal
              overflow hidden
              color rgba(102, 102, 102, 1)
            span
              text-align justify
              text-justify newspaper
              word-break normal
              overflow hidden
              color rgba(102, 102, 102, 1)

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
  vertical-align bottom

.good-descript-text >>> b
  // font-weight bold !important
  color rgba(61, 58, 57, 1)!important

.good-descript-text >>> strong
  // font-weight bold
  color rgba(61, 58, 57, 1)!important

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

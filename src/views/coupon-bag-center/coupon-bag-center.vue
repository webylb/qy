<template>
  <!-- 会员礼包库展示 -->
  <div class="coupon-center">
    <shop-header ref="shopHeader" v-if="showHeader" style="position: absolute;top:0;left: 0;z-index: 999" line-style="background:#fff" title="礼包中心"></shop-header>

    <div :style="couponCenterStyle" class="couponCenterContent">
      <div class="all-service"  v-show="!showLoad">
        <div class="menu-wrapper">
          <div class="menu-item" ref="menuItem" v-for="(item, index) in couponMeunData" :key="index"
            :class="[ index === activeMeunIndex  ? 'active-menu-item' : '']"
            @click="clickMenuItem(index)">
              {{item.name}}
          </div>
          <div class="tabs-line" ref="tabsLine"></div>
        </div>
        <div>
          <transition-group tag="div" :name="transitionName">
            <div v-show="index == activeMeunIndex" v-for="(i, index) in couponMeunData" :key="i.id" class="couponTabs">
              <scroll ref="couponWrapper" class="coupon-Wrapper" :key="i.id">
                <div>
                  <div class="coupon-cont" v-if="index === 0">
                    <div v-if="!showLoad" class="main-wrapper" :style="mainWrapperStyle">
                      <div v-for="item in allData" :key="item.uid">
                        <div v-if="item.moduleType === 'banner'">
                          <member-banner
                            v-if="showBanner"
                            ref="memberBanner"
                            :bannerList="item.configJson.sub_entry"
                            @onLoaded="onLoaded"
                            @jumplinkUrl="jumpChecklinkUrl"
                          ></member-banner>
                        </div>
                        <div v-if="item.moduleType === 'Top'">
                          <member-title 
                            :titleText="item.configJson.title" 
                            :textCss="item.configJson.optionsValue" 
                            :urlOptionsValue="item.configJson.urlOptionsValue"
                            :jumpTypeOptionsValue="item.configJson.jumpTypeOptionsValue"
                            :urlSelectOptionsValue="item.configJson.urlSelectOptionsValue"
                            :urlInputValue="item.configJson.urlInputValue"
                            :urlTitle="item.configJson.urlTitle"
                            @jumplinkUrl="jumplinkUrl">
                          </member-title>
                        </div>
                        <div v-if="item.moduleType === 'couponListBanner'">
                          <coupon-banner 
                            :bannerList="item.configJson.coupon_entry"
                            @onLoaded="onLoaded"
                            @jumpBagDetail="jumpBagDetail">
                          </coupon-banner>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="coupon-cont" v-if="index === 1">
                    <div v-if="!showLoad" class="main-wrapper" :style="mainWrapperStyle">
                      <coupon-banner 
                        :bannerList="userBagList"
                        @onLoaded="onLoaded"
                        @jumpBagDetail="jumpBagDetail">
                      </coupon-banner>
                    </div>
                  </div>
                  <loading v-if="showLoad" style="padding-top: 50%"></loading>
                </div>
              </scroll>
            </div>
          </transition-group>
        </div>
      </div>
    </div>
    <div v-show="noCoupon" class="no-coupon">
      <div class="no-coupon-content fadeIn">
        <img src="./images/no-coupon.png" alt="no coupon" class="">
        <p class="no-coupon-text">暂无礼包~</p>
        <button type="button" class="goShop" @click="goShop">去逛逛</button>
      </div>
    </div>
    <div class="float-wrap">
      <div v-for="item in allData" :key="item.uid">
        <div v-if="item.moduleType === 'bottomFloat' && isShowFloat">
          <member-btmfloat
            :title="item.configJson.title"
            :btnText="item.configJson.btnText"
            :urlValue="item.configJson.urlSelectOptionsValue || item.configJson.urlInputValue"
            :merchantId="merchantId"
            @onLoaded="onLoaded"
            @jumplinkUrl="jumplinkUrl"
          ></member-btmfloat>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Scroll from '../../base/scroll/scroll'
  import ShopHeader from '../../base/shop-header/shop-header'
  import MemberTitle from '../../base/member-title/member-title'
  import MemberBanner from '../../base/member-banner/member-banner'
  import MemberBtmfloat from '../../base/member-btmfloat/member-btmfloat'
  import CouponBanner from '../../base/coupon-banner/coupon-banner'
  import * as core from '../../api/couponBag'
  import tool from '../../common/js/util'
  import wxShareMixin from '../../common/js/wxShareMixin'
  import Loading from '../../base/loading/loading'

  export default {
    name: 'serviceCenter',
    components: {
      ShopHeader,
      Loading,
      Scroll,
      MemberTitle,
      MemberBanner,
      CouponBanner,
      MemberBtmfloat
    },
    mixins:[wxShareMixin],
    data () {
      return {
        merchantId: window.infoData.merchantId,
        giftPackagePageUuid: window.infoData.giftPackagePageUuid || '',
        showLoad: true,
        allData: null,
        loadingTitle: '正在加载...',
        showHeader: false,
        couponCenterStyle: "",
        servicesTopstyle:"",
        activeMeunIndex: 0,
        couponMeunData: [
          {
            name: '热卖礼包',
            id: '1'
          },
          {
            name: '我的礼包',
            id: '2'
          }
        ],
        serviceMenuList: [],
        tops: [],
        scrollY: 0,
        listLastHeight:'',
        shareUrl: location.href,
        shareLink:  window.location.href,  //分享出去的链接
        shareTitle: '会员特权',  //分享的标题
        shareDesc: '多达100余种会员特权，每年能帮您节省5998元，畅享世界从这里开始！', //分享的详情介绍
        shareImgUrl: 'https://c1.51jujibao.com/static/mkt/2019/05/shareImages/huiyuan.png',
        passIdList: null,//要过滤掉的商品id
        transitionName: 'slide-left',
        hasLabel: false,
        isShowFloat: null,
        mainWrapperStyle: 'padding-bottom:0;',
        userBagList: [],
        showBanner: true,
        noCoupon: false
      }
    },
    created () {
      this.getShare()
      document.title = this.$route.meta.title
      let ua = navigator.userAgent.toLowerCase();
      let isWeixin = ua.indexOf('micromessenger') != -1;
      if (!isWeixin) {
        this.showHeader=false
        this.couponCenterStyle = "top:0rem"
        // alert('Dragondean说这不是通过微信内置浏览器');
      } else {
        this.showHeader=false
        this.couponCenterStyle = "top:0rem"
      }

      if(this.$route.query.pageUuid){
        this.giftPackagePageUuid = this.$route.query.pageUuid
      }
      if (this.giftPackagePageUuid) {
        this.loaded = false
        this.getNewShopTequan({pageUuid: this.giftPackagePageUuid})
        // this.getUserBagList()
      }
    },
    mounted(){

    },
    methods: {
      jumplinkUrl(url) {
        if (url) {
          window.location.href = tool.replaceUrlMerchantId(url, this.merchantId)
        }
      },
      jumpChecklinkUrl(url){
        if(url){
          window.location.href = tool.replaceUrlMerchantId(url, this.merchantId)
          if(this.merchantId === '100036'){
            tool.trackEvent('活动规则')
          }else if(this.merchantId === '100000'){
            tool.trackEvent('礼包页分享')
          }
        }
      },
      jumpBagDetail(i, index) {
        if(i && i.orderId) { //个人礼包中心
          switch (true) {
            case /联通/.test(i.packageName):
              this.$router.push({path: '/wofenCouponBag', query:{ packageId: i.urlSelectOptionsValue, type: 'vip', orderId: i.orderId, isShowPopup: 'showPopup'}})
              break;
            case /圣诞/.test(i.packageName):
              this.$router.push({path: '/christmasCouponBag', query:{ packageId: i.urlSelectOptionsValue, type: 'vip', orderId: i.orderId, isShowPopup: 'showPopup'}})
              break;
            default:
              this.$router.push({path: '/vipUserCouponBag', query:{ packageId: i.urlSelectOptionsValue, type: 'vip', orderId: i.orderId,isShowPopup: 'showPopup'}})
              break;
          }
          if(this.merchantId === '100036'){
            tool.trackEvent('我的礼包立即使用')
          }
        }else{ //热卖礼包
          switch (true) {
            case /联通/.test(i.packageName):
              this.$router.push({path: '/wofenCouponBag', query:{ packageId: i.urlSelectOptionsValue}})
              break;
            case /圣诞/.test(i.packageName):
              this.$router.push({path: '/christmasCouponBag', query:{ packageId: i.urlSelectOptionsValue}})
              break;
            default:
              this.$router.push({path: '/vipUserCouponBag', query:{ packageId: i.urlSelectOptionsValue}})
              break;
          }
          if(this.merchantId === '100036'){
            switch (index) {
              case 0:
                tool.trackEvent('热卖礼包立即抢购')
                break;
              default:
                tool.trackEvent('礼包购买')
                break;
            }
          }else if(this.merchantId === '100000'){
            switch (index) {
              case 0:
                tool.trackEvent('9.9元抢购')
                break;
              case 1:
                tool.trackEvent('兑换码兑换')
                break;
              default:
                tool.trackEvent('礼包购买')
                break;
            }
          }
        }
      },
      onLoaded() {
        this.refreshScroll()
      },
      getNewShopTequan(opts) {
        core.newShopTequan(opts).then(res => {
          // console.log(res)
          if (res.code && '00' === res.code) {
            if (res.result.data) {
              let data = JSON.parse(res.result.data)
              for(let i=0, length = data.length; i<length; i++){
                if(data[i].moduleType == 'bottomFloat'){
                  this.isShowFloat = true
                  this.mainWrapperStyle = 'padding-bottom:3.125rem'
                }
              }
              this.allData = data
              this._initScroll()
            }
            this.showLoad = false
          } else {
            this.showLoad = false
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(e => {
          this.showLoad = false
          this.$toastBox.showToastBox(e)
        })
      },
      getUserBagList() {
        core.getUserBagList().then(res => {
          if (res.code && '00' === res.code) {
            if (res.result) {
              let data =  res.result
              let arr = []
              for(let i=0, length = data.length; i<length; i++){
                arr[i] = { }
                arr[i].orderId = data[i].id
                arr[i].packageName = data[i].packageName
                arr[i].urlSelectOptionsValue = data[i].packageId
                arr[i].img_url = data[i].buyAfterBannerImageUrl
              }
              this.userBagList = arr
              if(this.userBagList.length < 1){
                this.noCoupon = true
              }else{
                this.noCoupon = false
              }
            }
          } else if(res.code && '01' === res.code && res.isLogin == 'false'){
            this.getLoginUrl()
          } else {
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(e => {
          this.$toastBox.showToastBox(e)
        })
      },
      goShop(){
        this.clickMenuItem(0)
      },
      _initScroll () {
        if(this.$route.query.index > -1){
          // console.log(this.$route.query.index)
          this.clickMenuItem(parseInt(this.$route.query.index))
        }else{
          this.clickMenuItem(0)
        }
      },
      clickMenuItem(index){
        this.noCoupon = false
        if(index === 1){
          this.showBanner = false
          this.getUserBagList()
        }else{
          this.showBanner = true
        }
        if(index < this.activeMeunIndex){
          this.transitionName = 'slide-right'
        }else if(index > this.activeMeunIndex){
          this.transitionName = 'slide-left'
        }
        this.activeMeunIndex = index
        this.$nextTick(() => {
          this.tabsLineChange(index)
        })
        this.refreshScroll()
      },
      getLoginUrl(){
        core.getLoginUrl({merchantId: this.merchantId}).then(res => {
          if(res.code && '00' == res.code){
            if(res.result && res.result.url){
              window.location.href = res.result.url + "?referer=" + encodeURIComponent(tool.replaceUrlForUrpass(window.location.href))
            }else {
              this.$router.push('/login')
            }
          } else {
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(error => {
          this.$toastBox.showToastBox("网络错误")
        })
      },
      tabsLineChange(index){
        this.$refs.menuItem[index].style.animation = 'changeType 0.1s linear'
        // console.log(this.$refs.menuItem[index].getBoundingClientRect().width)
        setTimeout(() => {
          let width = this.$refs.menuItem[index].getBoundingClientRect().width
          // console.log(this.$refs.menuItem[index].getBoundingClientRect().width)
          this.$refs.tabsLine.style.width = width + 'px' 
          this.$refs.tabsLine.style.transform = 'translateX('+ this.$refs.menuItem[index].getBoundingClientRect().x +'px)'
          this.$refs.tabsLine.style.transitionDuration = '0.2s'
        }, 20)
      },
      refreshScroll(){
        if(this.couponMeunData && this.couponMeunData.length > 1){
          for(let i = 0; i<this.couponMeunData.length; i++){
            setTimeout(() => {
              this.$refs.couponWrapper[i].refresh();
            }, 20)
          }
        }else{
          setTimeout(() => {
            this.$refs.couponWrapper[0].refresh();
          },20)
        }
      }
    },
    computed: {
    
    },
    watch: {
    },
    activated(){
      if(this.$refs.couponWrapper){
        this.refreshScroll()
      }
    }
  }
</script>
<style lang="css">
  @-webkit-keyframes changeType {
    from {
      font-size: 1rem;
    }
    to {
      font-size: 1.25rem;
    }
  }

  @keyframes changeType {
    from {
      font-size: 1rem;
    }
    to {
      font-size: 1.25rem;
    }
  }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .coupon-center
    background-color rgba(245, 245, 245, 1)
    .no-coupon
      position absolute
      top 3.5rem
      left 0
      right 0
      bottom 0
      z-index 100
      .no-coupon-content
        height: 100%;
        padding-top 4rem
        text-align center
        background-color #fff
        img
          width 7.5rem
          height 7.5rem
        .no-coupon-text
          margin 1.5rem 0
          font-size 0.75rem
          color rgba(153, 153, 153, 1)
          font-size 1rem
        .goShop
          outline none
          background rgba(196, 143, 73, 1)
          color rgb(255,255,255)
          border none
          border-radius 0.25rem
          padding 0.59rem 1.45rem
          font-size 1.13rem;

    .couponCenterContent
      position fixed
      left 0
      top 0
      bottom 0
      right 0
      max-width 750PX
      .all-service
        min-height 1px
        .menu-wrapper
          width 100%
          height 3.5rem
          position relative
          display flex
          justify-content space-evenly
          align-items center
          border-bottom 0.0625rem solid rgba(238,238,238,1)
          box-sizing border-box
          background-color rgba(255,255,255,1)
          .tabs-line
            position: absolute;
            bottom: 0px;
            left: 0;
            z-index: 1;
            height: 0.15rem;
            background-color: rgba(183,130,49,1);
            border-radius: 0.1rem;
          .menu-item
            height 3.5rem
            font-size: 1rem;
            color: rgba(153,153,153,1);
            font-weight: normal;
            height: 100%;
            box-sizing border-box
            line-height 3.5rem
          .active-menu-item
            color: rgba(196,143,73,1);
            animation: changeType 0.1s linear;
            font-size: 1.25rem;
            font-weight bold
        .couponTabs
          position absolute
          top 3.5rem
          left 0
          right 0
          bottom 0
          .coupon-Wrapper
            position absolute
            left 0
            top 0
            bottom 0
            right 0
            overflow hidden
            max-width 750PX
            .coupon-list
              padding 0.75rem 0
              .coupon-img
                font-size 1.13rem
                // padding-bottom 0.25rem
                box-sizing border-box
                color rgba(61, 58, 57, 1)
               

.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
    will-change: transform;
    transition: all .3s;
    position: absolute;
    width:100%;
    left:0;
}
.slide-right-enter {
    transform: translateX(-100%);
}
.slide-right-leave-active {
    transform: translateX(100%);
}
.slide-left-enter {
    transform: translateX(100%);
}
.slide-left-leave-active {
    transform: translateX(-100%);
}
</style>

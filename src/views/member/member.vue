<template>
  <div class="member home-page">
    <scroll ref="memberScroll" class="member-scroll">
      <div>
        <div v-if="loaded" class="main-wrapper" :style="mainWrapperStyle">
          <div v-for="(item, index) in allData" :key="item.uid">
            <div v-if="item.moduleType === 'themes'">
              <member-header
                :merchantId="merchantId"
                :isMember="isMember"
                :merchantName="merchantName"
                :isHaveFavorite="isHaveFavorite"
                :expireTime="expireTime"
                :logo="item.configJson.logo"
                :vipName="item.configJson.vipName"
                :plotBGImage="item.configJson.plotBGImage"
                :logoCase="item.configJson.logoCase"
                :mainTitle="item.configJson.mainTitle"
                :subhead="item.configJson.subhead"
                :btnText="item.configJson.btnTest"
                @onLoaded="onLoaded"
                @unlockMember="unlockMember"
                @goToCouponList="goToCouponList"
                @goToOrderList="goToOrderList"
                @toMyLike="toMyLike"
              ></member-header>
            </div>
            <div v-if="item.moduleType === 'banner'">
              <member-banner
                v-if="index === 0"
                style="padding-top:0.375rem"
                :intervals=3500
                :bannerList="item.configJson.sub_entry"
                @onLoaded="onLoaded"
                @jumplinkUrl="jumpChecklinkUrl"
              ></member-banner>
              <member-banner
                v-else
                :intervals=5000
                :bannerList="item.configJson.sub_entry"
                @onLoaded="onLoaded"
                @jumplinkUrl="jumpChecklinkUrl"
              ></member-banner>
            </div>
            <div v-if="item.moduleType === 'classify'">
              <member-classify
                :privilegeList="item.configJson.class_entry"
                :showStyle="item.configJson.optionsValue"
                @onLoaded="onLoaded"
                @jumplinkUrl="jumplinkUrl"
              ></member-classify>
            </div>
            <div v-if="item.moduleType === 'hotTopic'">
              <member-hot
                :hotList="item.configJson.hot_entry"
                @onLoaded="onLoaded"
                @jumplinkUrl="jumplinkUrl"
              ></member-hot>
            </div>
            <div v-if="item.moduleType === 'recommend'">
              <member-recommend
                :recommendList="item.configJson.recommed_entry"
                :type="item.configJson.optionsValue"
                @onLoaded="onLoaded"
                @jumplinkUrl="jumplinkUrl"
              ></member-recommend>
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
            <div v-if="item.moduleType === 'line'">
              <member-line></member-line>
            </div>
          </div>
        </div>
        <loading v-if="!loaded" style="padding-top: 50%"></loading>
      </div>
    </scroll>
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
        <div v-if="item.moduleType === 'Menu'">
          <member-menu
            :menuList="item.configJson.menu_entry"
            :merchantId="merchantId"
            @jumplinkUrl="jumplinkUrl"
          ></member-menu>
        </div>
      </div>
    </div>
    <div class='error-wrap' v-show="showErrWrap">
      <p>页面未配置,请前往配置</p>
    </div>
    <!-- <div class="gift-wrap" v-show="showGiftCont">
      <div class="gift" v-if="isNewUser" @click="handleNewUserGift">
        <img src="./images/new-user-gift.gif" alt="newUserGift">
      </div>
      <div class="gift" v-else @click="handleMyGift">
        <img src="./images/my-gift.gif" alt="myGift">
      </div>
    </div> -->
    <!-- <gift-popup v-show="showGiftPopup" @receiveGift="receiveGift" @hidePopup="hidePopup"></gift-popup> -->
    <div class="gift-wrap wofen-gift-wrap" v-show="showGiftCont">
      <div class="gift" v-if="isNewUser" @click="handleNewUserGift">
        <img src="./images/wofen-gift.gif" alt="newUserGift">
      </div>
    </div>
    <gift-popup v-show="showGiftPopup" @receiveGift="goVipPay" @hidePopup="hidePopup"></gift-popup>
    <OpenSuccessPopup v-show="successOpen" :successTitle="successTitle" @hideSuccessPopup="hideSuccessPopup">
      <p class="success-mon-info">点击下方领取爱奇艺免费券码</p>
      <!-- <p class="success-text-info">开始享受您精彩的会员之旅吧!</p> -->
      <p class="success-btnWrap">
        <button type="button" class="success-btn" @click="goToCouponList">领取券码</button>
      </p>
    </OpenSuccessPopup>
  </div>
</template>

<script>
  import Scroll from '../../base/scroll/scroll'
  import Loading from '../../base/loading/loading'
  import MemberHeader from '../../base/member-header/member-header'
  import MemberTitle from '../../base/member-title/member-title'
  import MemberBanner from '../../base/member-banner/member-banner'
  import MemberClassify from '../../base/member-classify/member-classify'
  import MemberHot from '../../base/member-hot/member-hot'
  import MemberRecommend from '../../base/member-recommend/member-recommend'
  import MemberLine from '../../base/member-line/member-line'
  import MemberBtmfloat from '../../base/member-btmfloat/member-btmfloat'
  import MemberMenu from '../../base/member-menu/member-menu'
  import GiftPopup from '../../base/gift-popup/gift-popup'
  import OpenSuccessPopup from '../../base/open-success-popup/open-success-popup'
  import * as core from '../../api/member'
  import tool from '../../common/js/util'

  export default {
    name: "member",
    components: {
      Scroll,
      Loading,
      MemberHeader,
      MemberTitle,
      MemberBanner,
      MemberClassify,
      MemberHot,
      MemberRecommend,
      MemberLine,
      GiftPopup,
      MemberBtmfloat,
      MemberMenu,
      OpenSuccessPopup
    },
    data() {
      return {
        merchantName: window.infoData.merchantName || '',
        merchantId: window.infoData.merchantId || '',
        privilegePageUuid: window.infoData.privilegePageUuid || '',
        isMember: true,
        loaded: true,
        isHaveFavorite: false,
        expireTime: '0000/00/00',
        privilegeList: [],
        bannerList: [],
        imgList: [],
        recommendList: [],
        allData: null,
        showErrWrap: false,
        isNewUser: null,
        showGiftPopup: false,
        showGiftCont: false,
        packageConfigId: null ,//礼包配置的id
        merchantGiftPackageId: null ,//礼包id,
        passIdList: null ,//要过滤掉的商品id
        mainWrapperStyle: 'padding-bottom:0;',
        isShowFloat: null,
        goodsLibraryId: null,
        vipSystemId: null,
        userId: null,
        successOpen: false,
        successTitle: '恭喜您沃粉会员开通'
      }
    },
    created() {
      document.title = this.$route.meta.title
      if(this.$route.query.pageUuid){
        this.privilegePageUuid = this.$route.query.pageUuid
      }
      if (this.privilegePageUuid) {
        this.loaded = false
        this.getPassId({merchantId: this.merchantId})
      } else {
        this.showErrWrap = true
      }
      //开通成功返回
      if(this.$route.query.type && this.$route.query.type != 0){
        this.isSuccess()
      }
    },
    mounted() {
  
    },
    methods: {
      jumplinkUrl(url) {
        if (url) {
          window.location.href = tool.replaceUrlMerchantId(url, this.merchantId)
        }
      },
      jumpChecklinkUrl(url){
        if(url){
          // if(this.merchantId == '100000'){
          //   core.getPassMerchantUser({merchantId: this.merchantId}).then(res => {
          //   //console.log(res)
          //     if (res.code && '00' === res.code) {
          //       if (res.result) {
          //         window.location.href = tool.replaceUrlMerchantId(url, this.merchantId)
          //       }else{
          //         this.goOpenMember()
          //       }
          //     } else {
          //       this.loaded = true
          //       this.$toastBox.showToastBox(res.message)
          //     }
          //   }).catch(e => {
          //     this.$toastBox.showToastBox(e)
          //   })
          // }else{
          window.location.href = tool.replaceUrlMerchantId(url, this.merchantId)
          let reg = /couponBagCenter/
          if(reg.test(url)) {
            if(this.merchantId === '100000'){
              tool.trackEvent('首页banner')
            }
          }  
          // }
        }
      },
      onLoaded() {
        this.$refs.memberScroll.refresh()
      },
      goToCouponList() {
        this.$router.push({path: '/myCoupon'})
      },
      goToOrderList() {
        this.$router.push({path: '/orderForm'})
      },
      toMyLike() {
        this.$router.push({path: '/favorites'})
      },
      getPassId(opts){
        core.getPassId(opts).then(res => {
          //console.log(res)
          if (res.code && '00' === res.code) {
            if (res.result.length > 0) {
              this.passIdList = res.result
            }
            this.getNewShopTequan({pageUuid: this.privilegePageUuid})
          } else {
            this.loaded = true
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(e => {
          this.$toastBox.showToastBox(e)
        })
      },
      getNewShopTequan(opts) {
        core.newShopTequan(opts).then(res => {
          // console.log(res)
          if (res.code && '00' === res.code) {
            if (res.result.data) {
              let data = JSON.parse(res.result.data)
              // if (this.passIdList){
              //   for(let i=0, length = data.length; i<length; i++){
              //     if(data[i].moduleType == 'recommend' && data[i].configJson.recommed_entry.length > 0){
              //       for(let k=0, length3 = this.passIdList.length; k<length3; k++){
              //         for(let j = data[i].configJson.recommed_entry.length - 1; j>= 0; j--){
              //           if(data[i].configJson.recommed_entry[j].id == this.passIdList[k]){
              //             data[i].configJson.recommed_entry.splice(j, 1)
              //           }
              //         }
              //       }
              //     }
              //   }
              // }
              for(let i=0, length = data.length; i<length; i++){
                if(data[i].moduleType == 'bottomFloat'){
                  this.isShowFloat = true
                  this.mainWrapperStyle = 'padding-bottom:3.125rem'
                }
              }
              this.allData = data
              this.getMemberInfo({merchantId: this.merchantId})
            }
            this.$nextTick(() => {
              this.loaded = true
            })
          } else {
            this.loaded = true
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(e => {
          console.log(e)
          this.$toastBox.showToastBox(e)
        })
      },
      getMemberInfo(opts) {
        core.memberInfo(opts).then(res => {
          if (res.code && '00' === res.code) {
            if (res.result.qyMerchantUserVipResults && res.result.qyMerchantUserVipResults.length > 0) {
              this.expireTime = tool.formatDate(res.result.qyMerchantUserVipResults[0].expireTime, "Y/M/D")
              this.isMember = true
              for(let i=0, length = this.allData.length; i<length; i++){
                if(this.allData[i].moduleType == 'bottomFloat'){
                  this.isShowFloat = false
                  this.mainWrapperStyle = 'padding-bottom:0rem'
                  setTimeout(() => {
                    this.$refs.memberScroll.refresh()
                  }, 20)
                }
              }
            }else{
              this.isMember = false
            }
            // this.isMember = res.result.id ? true : false
            this.isHaveFavorite = res.result.like
            this.isNewUser = res.result.xinShou
           
            if(res.result.xinShou){
              if(res.result.recriveXinShouLiBao){ //已领取新人礼包
                this.showGiftPopup = false //礼包popup
                this.showGiftCont = false
              }else{ //未领取新人礼包
                if(!tool.getCookie('isShowGift')){
                  this.showGiftPopup = true
                  this.showGiftCont = false
                }else{
                  this.showGiftPopup = false
                  this.showGiftCont = true
                }
              }
            }else{
              if(res.result.recriveXinShouLiBao){ //已领取新人礼包
                this.showGiftPopup = false //礼包popup
                this.showGiftCont = false
              }
            }
            
            // this.packageConfigId = res.result.packageConfigId
            // this.merchantGiftPackageId = res.result.merchantGiftPackageId

            this.goodsLibraryId = res.result.goodsLibraryAndVipCardId
            this.vipSystemId = res.result.qyMerchantVipSystemId
            this.userId = res.result.id

          } else if(res.code && '01' === res.code) {
            this.isMember = false
          } else {
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(e => {
          this.$toastBox.showToastBox(e)
        })
      },
      unlockMember() {
        this.goOpenMember()
      },
      hidePopup() {
        this.showGiftPopup = false
        this.showGiftCont = true
        tool.setCookie('isShowGift', '0', 1)
      },
      receiveGift() {
        if(this.packageConfigId){
          core.receiveGiftBag({packageConfigId: this.packageConfigId}).then(res => {
            //console.log(res)
            if (res.code && '00' === res.code) {
              this.$router.push({path: '/newUserCouponBag', query: {merchantGiftPackageId:this.merchantGiftPackageId, packageConfigId:this.packageConfigId}})
            } else if(res.code && '01' === res.code && res.isLogin == 'false'){
              this.getLoginUrl()
            } else {
              this.$toastBox.showToastBox(res.message)
            }
          }).catch(e => {
            this.$toastBox.showToastBox(e)
          })
        }else{
          this.$toastBox.showToastBox('礼包配置出错')
        }
      },
      handleNewUserGift() {
        this.showGiftPopup = true
        this.showGiftCont = false
      },
      handleMyGift() {
        if(this.packageConfigId){
          this.$router.push({path: '/newUserCouponBag', query: {merchantGiftPackageId:this.merchantGiftPackageId, packageConfigId:this.packageConfigId}})
        }
      },
      goVipPay(){
        let data = {channelNumber: null,outOrderId: null};
        if(!this.goodsLibraryId || !this.vipSystemId || !this.userId){
          this.getLoginUrl()
          return
        }
        data.goodsLibraryId = this.goodsLibraryId
        data.userId = this.userId
        data.vipSystemId = this.vipSystemId
        let returnUrl = window.location.href
        let reg = /\?/
        if(reg.test(returnUrl)){
          returnUrl = returnUrl + "&type=opensuccess"
        }else{
          returnUrl = returnUrl + "?type=opensuccess"
        }
        data.returnUrl = returnUrl
        core.vipPackagePay(data).then(res => {
          //console.log(res)
          if(res.code && '00' == res.code){
            if(this.merchantId === '100036'){
              tool.trackEvent('立即开通按钮')
            }
            if(res.result.goUrl){
              window.location.href = res.result.goUrl
            }
          }else if(res.code && '01' === res.code && res.isLogin == 'false'){
            this.getLoginUrl()
          } else {
            this.$toastBox.showToastBox(res.message)
          }
          this.isPaying = true
        }).catch(error => {
          this.$toastBox.showToastBox(error)
          this.isPaying = true
        })
      },
      getLoginUrl(){
        core.getLoginUrl({merchantId: this.merchantId}).then(res => {
          //console.log(res)
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
      goOpenMember() {
        core.getOpenMemberUrl({merchantId: this.merchantId}).then(res => {
          if(res.code && '00' == res.code){
            if(res.result){
              window.location.href = res.result
            }
          }else {
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(error => {
          this.$toastBox.showToastBox("网络错误")
        })
      },
      hideSuccessPopup(){
        this.successOpen = false
      },
      isSuccess(){
        let type = this.$route.query.type
        if(type && type != 0){
          this.successOpen = true
          let data = {}
          for(let item in this.$route.query){
            if(item == 'type'){
              data[item] = 0
            }else{
              data[item] = this.$route.query[item]
            }
          }
          this.$router.replace({path:'/member', query: data})
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .member
    .member-scroll
      position fixed
      top 0
      left 0
      right 0
      bottom 0
      max-width 750PX
      // margin 0 auto
      z-index 10
    .error-wrap
      position absolute
      top 0
      left 0
      right 0
      bottom 0
      max-width 750PX
      margin 0 auto
      background rgba(0, 0, 0, 0.6)
      z-index: 11;

      p
        color #fff
        font-size 1rem
        position absolute
        top 50%
        left 50%
        transform translate(-50%, -50%)
        max-width 750PX

    .gift-wrap
      position fixed
      right 0.66rem
      top 13.75rem
      width 4.875rem
      height 4.875rem
      z-index 10
      .gift
        width 100%
        height auto

    .wofen-gift-wrap
      position absolute
      right 0.44rem
      top auto
      bottom 8.75rem
      width 5.375rem
      height 4.03rem
      z-index 10

    .success-open-btmImg
      padding-top 1.4rem
      padding-bottom 1.88rem
      display flex
      flex-direction column
      .success-mon-info
        width 100%
        text-align center
        color rgba(61,58,57,1)
        line-height 1.5rem
        font-size 1rem
        margin-top 1rem
        font-weight 500
      .success-text-info
        color rgba(61,58,57,1)
        width 100%
        text-align center
        font-size 1rem
        font-weight 500
        line-height 1.5rem
      .success-btnWrap
        text-align center
        margin-top 2.3rem
        .success-btn
          padding 0.95rem 1.81rem
          background rgba(183,130,49,1)
          color rgba(255,255,255,1)
          text-align center
          font-size 1.13rem
          font-weight 600
          outline none
          border none
          border-radius 0.25rem
  

.animate-swing {
  animation: swing 1.2s ease-in-out infinite;
  transform: rotate(-5deg);
  transform-origin: center;
}

@keyframes swing {
  0% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg);}
  100% { transform: rotate(-5deg);}
}

</style>

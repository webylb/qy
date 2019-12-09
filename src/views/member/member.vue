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
    <div class="gift-wrap" v-show="showGiftCont">
      <div class="gift" v-if="isNewUser" @click="handleNewUserGift">
        <img src="./images/new-user-gift.gif" alt="newUserGift">
      </div>
      <div class="gift" v-else @click="handleMyGift">
        <img src="./images/my-gift.gif" alt="myGift">
      </div>
    </div>
    <gift-popup v-show="showGiftPopup" @receiveGift="receiveGift" @hidePopup="hidePopup"></gift-popup>
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
  import GiftPopup from '../../base/gift-popup/popup'
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
      MemberMenu
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
        isShowFloat: null
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
            tool.trackEvent('首页banner')
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
                this.showGiftCont = true
              }else{ //未领取新人礼包
                this.showGiftPopup = true
                this.showGiftCont = false
              }
            }else{
              if(res.result.recriveXinShouLiBao){ //已领取新人礼包
                this.showGiftPopup = false //礼包popup
                this.showGiftCont = true
              }
            }

            this.packageConfigId = res.result.packageConfigId
            this.merchantGiftPackageId = res.result.merchantGiftPackageId

          } else if(res.code && '01' === res.code) {
            this.isMember = false
            // this.$toastBox.showToastBox(res.message)
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
      position absolute
      right 0.66rem
      top 13.75rem
      width 4.875rem
      height 4.875rem
      z-index: 11;

      .gift
        width 100%
        height auto

</style>

<template>
  <div class="my-center">
    <scroll ref="centerScroll" class="center-scroll">
      <div>
        <div v-if="loaded" class="main-wrapper" :style="mainWrapperStyle">
          <div v-for="item in allData" :key="item.uid">
            <div v-if="item.moduleType === 'centerTheme'">
              <center-header
                :merchantId="merchantId"
                :isMember="isMember"
                :isLogin="isLogin"
                :vipInfo="vipInfo"
                :vipTypeList="vipTypeList"
                @onLoaded="onLoaded"
                @unlockMember="unlockMember"
                @goLogin="getLoginUrl"
              ></center-header>
            </div>
            <div v-if="item.moduleType === 'centerOrder'">
              <center-order
                :isLogin="isLogin"
                :orderNumData="orderNumData"
                @onLoaded="onLoaded"
                @goLogin="getLoginUrl"
              ></center-order>
            </div>
            <div v-if="item.moduleType === 'centerServe'">
              <center-serve
                :isLogin="isLogin"
                :merchantId="merchantId"
                :isSupportRefund="isSupportRefund"
                @onLoaded="onLoaded"
                @goLogin="getLoginUrl"
              ></center-serve>
            </div>
            <div v-if="item.moduleType === 'banner'">
              <member-banner
                :bannerList="item.configJson.sub_entry"
                @onLoaded="onLoaded"
                @jumplinkUrl="jumpChecklinkUrl"
              ></member-banner>
            </div>
            <div v-if="item.moduleType === 'classify'">
              <!-- <member-title :titleText="item.name"></member-title> -->
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
      <div v-for="item in menuData" :key="item.uid">
        <!-- <div v-if="item.moduleType === 'bottomFloat'">
          <member-btmfloat
            :title="item.configJson.title"
            :btnText="item.configJson.btnText"
            :urlValue="item.configJson.urlSelectOptionsValue || item.configJson.urlInputValue"
            :merchantId="merchantId"
            @onLoaded="onLoaded"
            @jumplinkUrl="jumplinkUrl"
          ></member-btmfloat>
        </div> -->
        <div v-if="item.moduleType === 'Menu'">
          <member-menu
            :menuList="item.configJson.menu_entry"
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
    <!-- <gift-popup v-show="showGiftPopup" @receiveGift="receiveGift" @hidePopup="hidePopup"></gift-popup> -->
  </div>
</template>

<script>
  import Scroll from '../../base/scroll/scroll'
  import Loading from '../../base/loading/loading'
  import CenterHeader from '../../base/center-header/center-header'
  import CenterOrder from '../../base/center-order/center-order'
  import CenterServe from '../../base/center-serve/center-serve'
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
    name: "myCenter",
    components: {
      Scroll,
      Loading,
      CenterHeader,
      CenterOrder,
      CenterServe,
      MemberTitle,
      MemberBanner,
      MemberClassify,
      MemberHot,
      MemberRecommend,
      MemberLine,
      MemberMenu
    },
    data() {
      return {
        merchantName: window.infoData.merchantName || '',
        merchantId: window.infoData.merchantId || '',
        privilegePageUuid: window.infoData.privilegePageUuid || '',
        personalCenterPageUuid: window.infoData.personalCenterPageUuid || '',
        isMember: true,
        loaded: true,
        privilegeList: [],
        bannerList: [],
        imgList: [],
        recommendList: [],
        allData: null,
        menuData: null,
        showErrWrap: false,
        isNewUser: null,
        showGiftPopup: false,
        showGiftCont: false,
        packageConfigId: null ,//礼包配置的id
        merchantGiftPackageId: null ,//礼包id,
        passIdList: null, //要过滤掉的商品id
        isLogin: null,
        vipInfo: {},
        orderNumData: null,
        userVipInfoList: null,
        vipTypeList: null,
        isSupportRefund: 'N',
        mainWrapperStyle: 'padding-bottom:0;'
      }
    },
    created() {
      document.title = this.$route.meta.title
      if(this.$route.query.pageUuid){
        this.personalCenterPageUuid = this.$route.query.pageUuid
      }
      if (this.personalCenterPageUuid) {
        this.loaded = false
        this.getMemberInfo({merchantId: this.merchantId})
        this.getNewShopTequan({pageUuid: this.personalCenterPageUuid})
        this.getNewShopTequanMenu({pageUuid: this.privilegePageUuid})
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
          // }
        }
      },
      onLoaded() {
        this.$refs.centerScroll.refresh()
      },
      getNewShopTequan(opts) {
        core.newShopTequan(opts).then(res => {
          // console.log(res)
          if (res.code && '00' === res.code) {
            if (res.result.data) {
              let data = JSON.parse(res.result.data)
              for(let i=0, length = data.length; i<length; i++){
                if(data[i].moduleType == 'bottomFloat'){
                  this.mainWrapperStyle = 'padding-bottom:3.125rem'
                }
              }
              this.allData = data
            }
            this.$nextTick(() => {
              this.loaded = true
            })
          } else {
            this.loaded = true
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(e => {
          this.$toastBox.showToastBox(e)
        })
      },
      getNewShopTequanMenu(opts) {
        core.newShopTequan(opts).then(res => {
          if (res.code && '00' === res.code) {
            if (res.result.data) {
              let data = JSON.parse(res.result.data)
              this.menuData = data
            }
          } else {
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(e => {
          this.$toastBox.showToastBox(e)
        })
      },
      getMemberInfo(opts) {
        core.memberInfo(opts).then(res => {
          if (res.code && '00' === res.code) {
            if(res.result){
              this.isLogin = res.result.id ? true : false
              this.vipInfo.userId = res.result.id
              this.vipInfo.userName = res.result.nickname
              this.vipInfo.headImage = res.result.headImage
              if(res.result.qyMerchantUserVipResults && res.result.qyMerchantUserVipResults.length > 0){
                this.userVipInfoList = []
                this.vipInfo.id = res.result.qyMerchantUserVipResults[0].goodsLibraryId
                this.vipInfo.vipType = res.result.qyMerchantUserVipResults[0].goodsLibraryName
                this.vipInfo.startTime = tool.formatDate(res.result.qyMerchantUserVipResults[0].startTime, "Y/M/D")
                this.vipInfo.expireTime = tool.formatDate(res.result.qyMerchantUserVipResults[0].expireTime, "Y/M/D")
                for(let i=0, length = res.result.qyMerchantUserVipResults.length; i < length; i++){
                  this.userVipInfoList[i] = {}
                  this.userVipInfoList[i].id =  res.result.qyMerchantUserVipResults[i].goodsLibraryId
                  this.userVipInfoList[i].vipType =  res.result.qyMerchantUserVipResults[i].goodsLibraryName
                  this.userVipInfoList[i].startTime = tool.formatDate(res.result.qyMerchantUserVipResults[i].startTime, "Y/M/D")
                  this.userVipInfoList[i].expireTime = tool.formatDate(res.result.qyMerchantUserVipResults[i].expireTime, "Y/M/D")
                }
              }
              this.isMember = res.result.qyMerchantUserVipResults && res.result.qyMerchantUserVipResults.length > 0 ? true :false
              this.getUserOrderNum()
              this.getVipPackageList({merchantId: this.merchantId})
            }
            
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
            this.isLogin = false
            // this.$toastBox.showToastBox(res.message)
          } else {
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(e => {
          this.$toastBox.showToastBox(e)
        })
      },
      getVipPackageList(opts){
        core.vipPackageList(opts).then(res => {
          //console.log(res)
          if(res.code && '00' == res.code){
            if(this.userVipInfoList){
              for (let i=0, length = res.result.length; i < length; i++) {
                if(res.result)
                for (let j=0, length2 = this.userVipInfoList.length; j < length2; j++) {
                  if(res.result[i].id == this.userVipInfoList[j].id){
                    res.result[i].isOpen = true
                    res.result[i].id = this.userVipInfoList[j].id
                    res.result[i].sTime = this.userVipInfoList[j].startTime
                    res.result[i].eTime = this.userVipInfoList[j].expireTime
                  }
                }
              }
            }
            this.vipTypeList = res.result
            for (let i=0, length = this.vipTypeList.length; i < length; i++) {
              for (let j=0, length2 = this.vipTypeList[i].qyMerchantVipSystemResultList.length; j < length2; j++) {
                if(this.vipTypeList[i].qyMerchantVipSystemResultList[j].isSupportRefund === 'Y'){
                  this.isSupportRefund = 'Y'
                }
              }
            }
          
          } else {
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(error => {
          this.$toastBox.showToastBox("网络错误")
        })
      },
      getUserOrderNum() {
        core.getUserOrderNum().then(res => {
          if (res.code && '00' === res.code) {
            this.orderNumData = res.result
          } else {
            // this.$toastBox.showToastBox(res.message)
          }
        }).catch(e => {
          this.$toastBox.showToastBox(e)
        })
      },
      unlockMember(id) {
        if(id){
          this.goOpenMember(id)
        }else{
          this.goOpenMember()
        }
      },
      goOpenMember(id) {
        core.getOpenMemberUrl({merchantId: this.merchantId}).then(res => {
          if(res.code && '00' == res.code){
            if(res.result){
              if(id){
                window.location.href = res.result + "?goodsLibraryId="+ id
              }else{
                window.location.href = res.result
              }
            }
          }else {
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(error => {
          this.$toastBox.showToastBox("网络错误")
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
              // if(res.url){
              //   var index = res.url.lastIndexOf("\/");
              //   var str = res.url.substring(index, res.url.length);
              //   let regIndex = /\?/gi;
              //   if(str && regIndex.test(str)){
              //     window.location.href = res.url + "&referer=" + encodeURIComponent(tool.replaceUrlForUrpass(window.location.href))
              //   }else{
              //     window.location.href = res.url + "?referer=" + encodeURIComponent(tool.replaceUrlForUrpass(window.location.href))
              //   }
              // }
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
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .my-center
    .center-scroll
      position fixed
      top 0
      left 0
      right 0
      bottom 0
      max-width 750PX
      // margin 0 auto
      z-index 10
      background rgba(245,245,245,1)
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

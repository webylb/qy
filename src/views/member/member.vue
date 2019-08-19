<template>
  <div class="member home-page" ref="homePage">
    <scroll ref="memberScroll" class="member-scroll">
      <div>
        <div v-if="loaded" class="main-wrapper">
          <div v-for="item in allData" :key="item.sort">
            <div v-if="item.moduleType === 'themes'">
              <member-header
                :isMember="isMember"
                :merchantName="merchantName"
                :isHaveFavorite="isHaveFavorite"
                :expireTime="expireTime"
                :logo="item.configJson.logo"
                :plotBGImage="item.configJson.plotBGImage"
                :logoCase="item.configJson.logoCase"
                :mainTitle="item.configJson.mainTitle"
                :subhead="item.configJson.subhead"
                :btnText="item.configJson.btnTest"
                @onLoaded="onLoaded"
                @unlockMember="unlockMember"
                @goToCouponList="goToCouponList"
                @goToOrderList="goToOrderList"
                @vtRenew="vtRenew"
                @toMyLike="toMyLike"
              ></member-header>
            </div>
            <div v-if="item.moduleType === 'banner'">
              <member-banner
                :bannerList="item.configJson.sub_entry"
                @onLoaded="onLoaded"
                @jumplinkUrl="jumplinkUrl"
              ></member-banner>
            </div>
            <div v-if="item.moduleType === 'classify'">
              <member-classify
                :privilegeList="item.configJson.class_entry"
                :title="item.name"
                @onLoaded="onLoaded"
                @jumplinkUrl="jumplinkUrl"
              ></member-classify>
            </div>
            <div v-if="item.moduleType === 'hotTopic'">
              <member-hot
                :hotList="item.configJson.hot_entry"
                :title="item.name"
                @onLoaded="onLoaded"
                @jumplinkUrl="jumplinkUrl"
              ></member-hot>
            </div>
            <div v-if="item.moduleType === 'recommend'">
              <member-recommend
                :recommendList="item.configJson.recommed_entry"
                :title="item.name"
                @onLoaded="onLoaded"
                @jumplinkUrl="jumplinkUrl"
                @toDetail="toDetail"
              ></member-recommend>
            </div>
          </div>
        </div>
        <loading v-if="!loaded" style="padding-top: 50%"></loading>
      </div>
    </scroll>
    <div class='error-wrap' v-show="showErrWrap">
      <p>页面未配置,请前往配置</p>
    </div>
  </div>
</template>

<script>
  import Scroll from '../../base/scroll/scroll'
  import Loading from '../../base/loading/loading'
  import MemberHeader from '../../base/member-header/member-header'
  import MemberBanner from '../../base/member-banner/member-banner'
  import MemberClassify from '../../base/member-classify/member-classify'
  import MemberHot from '../../base/member-hot/member-hot'
  import MemberRecommend from '../../base/member-recommend/member-recommend'
  import * as core from '../../api/member'
  import tool from '../../common/js/util'

  export default {
    name: "member",
    components: {
      Scroll,
      Loading,
      MemberHeader,
      MemberBanner,
      MemberClassify,
      MemberHot,
      MemberRecommend
    },
    data() {
      return {
        merchantName: window.infoData.merchantName || '',
        merchantId: window.infoData.merchantId || '',
        privilegePageUuid: window.infoData.privilegePageUuid || '',
        isMember: true,
        loaded: true,
        saveMoney: 0,
        useVipCount: 0,
        isHaveFavorite: false,
        num: 0,
        progressBarWidth: "width:0%",
        expireTime: '0000-00-00',
        privilegeList: [],
        bannerList: [],
        imgList: [],
        recommendList: [],
        allData: null,
        showErrWrap: false
      }
    },
    created() {
      document.title = this.$route.meta.title
      if (this.privilegePageUuid) {
        this.loaded = false
        this.getMemberInfo();
        this.getNewShopTequan({pageUuid: this.privilegePageUuid})
      } else {
        this.showErrWrap = true
      }
    },
    mounted() {

    },
    methods: {
      jumplinkUrl(url) {
        if (url) {
          window.location.href = tool.replaceUrlMerchantId(url,this.merchantId)
        }
      },
      onLoaded() {
        this.$refs.memberScroll.refresh()
      },
      toDetail(url) {
        window.location.href = url
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
      getNewShopTequan(opts) {
        core.newShopTequan(opts).then(res => {
          // console.log(res)
          if (res.code && '00' === res.code) {
            if (res.result.data) {
              this.allData = JSON.parse(res.result.data)
            }
            this.loaded = true
          } else {
            this.loaded = true
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(e => {
          this.$toastBox.showToastBox(e)
        })
      },
      getMemberInfo() {
        core.memberInfo().then(res => {
          if (res.code && '00' === res.code) {
            if (res.result.vipUser) {
              this.isHaveFavorite = res.result.like
              this.expireTime = tool.formatDate(res.result.cardExpireTime, "YYYY-MM-DD")
              this.loaded = true
            } else {
              this.loaded = true
              this.isMember = false
            }
          } else if (res.code && '01' === res.code && res.isLogin == 'false') {
            if (res.url) {
              window.location.href = res.url
            }
          } else {
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(e => {
          this.$toastBox.showToastBox(e)
        })
      },
      unlockMember() {
        this.$router.push({path: '/openMembers'})
      },
      vtRenew() {
        this.$router.push({path: '/openMembers'})
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
      max-width 750px
      margin 0 auto

    .error-wrap
      position absolute
      top 0
      left 0
      right 0
      bottom 0
      max-width 750px
      margin 0 auto
      background rgba(0, 0, 0, 0.6)

      p
        color #fff
        font-size 1rem
        position absolute
        top 50%
        left 50%
        transform translate(-50%, -50%)
        max-width 750px
</style>

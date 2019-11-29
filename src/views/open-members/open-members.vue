<template>
  <div class="menmbers ">
    <shop-header ref="shopHeader" v-if="showHeader" style="position: absolute;top:0;left: 0;z-index: 999" line-style="background:#fff" :title="title"></shop-header>
    <div :style="menmbersStyle" class="menmbersContent" ref="menmbersContent">
      <div class="cont">
        <div v-if="!loading">
          <div class="user-info">
            <img v-if="headImage" :src="headImage" alt="">
            <img v-else src="./images/vip-default-user.png" alt="user">
            <div class="detail">
              <div class="title" v-if="!isLogin" @click="getLoginUrl"><span>立即登录</span></div>
              <div class="title" v-else> <span>{{ userName || '' }}</span> <img v-if="userVipInfo > 0" class="" src="./images/power.png" ></div>
              <div class="des" v-if="!isLogin">请登录后购买会员</div>
              <div class="des" v-if="isLogin && !isMember">您还未购买任何会员</div>
              <div class="des" v-if="isLogin && isMember">我的会员：已开通{{ userVipInfo }}种</div>
            </div>
          </div>
          <div class="vip-wrap">
            <div class="title">
              <div v-for="(item, index) in vipTypeTitleList" :key="item.id" class="title-item" :class="[index == activeTitleIndex ? 'title-item-active' : '']" @click="changeTitleActiveIndex(index,item.id)" ref="titleItem">
                {{ item.libraryName }}
              </div>
              <div class="tabs-line" ref="tabsLine"></div>
            </div>
            <div class="type-list" v-if="vipTypeTitleList && vipTypeTitleList.length > 0">
              <transition-group tag="div" :name="transitionName">
                <div v-show="index == activeTitleIndex" v-for="(item, index) in vipTypeTitleList" :key="item.id" class="type-items">
                  <div class="item" v-for="(i, index) in item.qyMerchantVipSystemResultList" :key="index" :class="[index == activeVipIndex ? 'item-active' : '']" @click="changeVipActiveIndex(index, i)" ref="titleItem">
                    <div class="item-title">{{ i.vipCardType }}</div>
                    <div class="item-price"><span>￥</span>{{ avg(i.sellingPrice) }}</div>
                  </div>
                </div>
              </transition-group>
            </div>
          </div>
        </div>
        <loading v-else style="padding-top: 50%"></loading>
      </div>
    </div>
    <div class="security-content">
      <div class="cont" @click="changeSecurity">
        <img v-if="!checkSecurity" src="./images/vip-no-check.png" alt="">
        <img v-else src="./images/vip-check.png" alt="">
        <div class="text" @click.stop="goSecurity">我已阅读<span>《用户保障协议》</span></div>
      </div>
    </div>
    <div class="click-subAddVip" ref="immediatePayment">
      <div class="left" @click="openExcharge" v-if="allData.isEnable !== 'N'">兑换码激活</div>
      <div class="right" @click="immediatePay">立即开通</div>
    </div>

    <div class="addVipWrap fade" v-show=false></div>
    <div class="success-open-popup  fade" v-show="successOpen">
      <div class="success-content">
        <div class="success-open-top">
          <div class="success-open-topImg">
            <p class="success-title">{{ successTitle }}成功</p>
            <img class="success-img" src="./images/vip-success-open.png" alt="">
          </div>
          <div class="success-open-btmImg">
            <p class="success-mon-info" v-show="!isExcharge">恭喜您成功开通{{ successMonth }}</p>
            <p class="success-mon-info" style="margin: 2rem 0;" v-show="isExcharge">恭喜您,兑换成功{{ successMonth }}</p>
            <p class="success-text-info" v-show="!isExcharge">开始享受您精彩的会员之旅吧!</p>
            <p class="success-btnWrap">
              <button type="button" class="success-btn" @click="goBack">购买商品</button>
            </p>
          </div>
        </div>
        <div class="success-open-close" @click="hideSuccessPopup">
          <i class="iconfont">&#xe63f;</i>
        </div>
      </div>
    </div>
    <ExchangePopup v-show="exchangeOpen" title="兑换码激活" confirmText="立即兑换" @cancel="hideSuccessPopup" @confirm="goExcharge">
      <div class="exchange-open-top" style="padding:1.88rem 1.25rem 2.69rem;margin: 0;text-align:center;">
        <input type="text" v-model="exchangeInput" @click.stop="focusInput"  @blur="scrollToTop" class="exchange-input" placeholder="请输入兑换码" maxlength="16" />
      </div>
    </ExchangePopup>
    <ExchangePopup v-show="exchangeErrOpen" title="兑换失败" :isShowCancel=false confirmText="知道了" @cancel="hideSuccessPopup" >
      <p class="exchange-err-text" style="padding:2.56rem 2.75rem;margin: 0;text-align:center;">{{ chargeErrText }}</p>
    </ExchangePopup>
  </div>
</template>

<script>
  import BScroll  from 'better-scroll'
  import Loading from '../../base/loading/loading'
  import ShopHeader from '../../base/shop-header/shop-header'
  import ExchangePopup from '../../base/exchange-popup/exchange-popup'
  import * as core from '../../api/openMembers'
  import tool from '../../common/js/util'
  import wxShareMixin from '../../common/js/wxShareMixin'

  export default {
    components: {
      ShopHeader,
      Loading,
      ExchangePopup
    },
    mixins:[wxShareMixin],
    data () {
      return {
        merchantId: window.infoData.merchantId,
        openingPageUuid: window.infoData.openingPageUuid || '',
        loading: true,
        allData: {},
        transitionName: 'slide-left',
        showHeader: false,
        backUrl: '',
        vipTypeList: null,
        vipTypeTitleList: null,
        vipTypeDefaultId: null,
        activeTitleIndex: 0,
        activeVipIndex: 0,
        goodsLibraryId: '',
        successOpen: false,
        successTitle: '开通',
        successMonth: '--',
        isExcharge: false,
        exchangeOpen: false,
        exchangeInput: null,
        exchangeErrOpen: false,
        chargeErrText: '',
        isPaying: true,
        shareUrl: location.href,
        shareLink:  window.location.href,  //分享出去的链接
        shareTitle: '',  //分享的标题
        shareDesc: '', //分享的详情介绍
        shareImgUrl: '',
        okLink: null,
        isMember: null,
        isLogin: null,
        userName: null,
        headImage: null,
        userVipInfo: null,
        goodsLibraryName: null,
        vipTypeDefaultName: null,
        checkSecurity: false,
        userId: null,
        exchangeGoodsLibraryId: null
      }
    },
    created () {
      document.title = this.$route.meta.title
      //判断是否为微信
      let ua = navigator.userAgent.toLowerCase();
      let isWeixin = ua.indexOf('micromessenger') != -1;
      if (!isWeixin) {
        this.showHeader=false
        this.menmbersStyle = "top:0rem"
      } else {
        this.showHeader=false
        this.menmbersStyle = "top:0rem"
      }
    
      //微信分享
      this.getShare();
      //用户信息
      this.getMemberInfo({merchantId: this.merchantId})
      //价格列表
      this.getVipPackageList({merchantId: this.merchantId});
      //开通成功返回
      if(this.$route.query.type && this.$route.query.type != 0){
        this.isSuccess()
      }
    },
    watch:{
      successOpen(){
        window.scrollBy(0,1)
      },
      exchangeOpen(){
        window.scrollBy(0,1)
      },
      exchangeErrOpen(){
        window.scrollBy(0,1)
      }
    },
    mounted(){
      this.$nextTick(()=>{
        this._initScroll()
        setTimeout(() => {
          this.initHeight()
        }, 500)
      });
    },
    destroyed () {

    },
    methods: {
      getMemberInfo(opts) {
        core.memberInfo(opts).then(res => {
          //console.log(res)
          if (res.code && '00' === res.code) {
            if(res.result){
              this.userId = res.result.id
              this.isLogin = res.result.id ? true : false
              this.userName = res.result.nickname
              this.headImage = res.result.headImage
              if(res.result.qyMerchantUserVipResults && res.result.qyMerchantUserVipResults.length > 0){
                this.vipType = res.result.qyMerchantUserVipResults[0].goodsLibraryName
                this.userVipInfo = res.result.qyMerchantUserVipResults.length
                this.isMember = true
              }else{
                this.isMember = false
              }
            }
            this.loading = false
          } else if(res.code && '01' === res.code) {
            this.loading = false
            this.isLogin = false
            // this.$toastBox.showToastBox(res.message)
          } else {
            this.loading = false
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(e => {
          this.loading = false
          this.$toastBox.showToastBox(e)
        })
      },
      getNewShopTequan(opts) {
        core.newShopTequan(opts).then(res => {
          if (res.code && '00' === res.code) {
            if(res.result.data){
              this.allData = JSON.parse(res.result.data)
            }
          } else {
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(e => {
          this.$toastBox.showToastBox(e)
        })
      },
      handleScroll () {
        this.$refs.immediatePayment.style.top = "auto"
      },
      initHeight(){
        this.scroll.refresh()
      },
      focusInput(e){
        e.target.focus()
      },
      scrollToTop(){
        window.scrollBy(0,10)
      },
      _initScroll () {
        // 创建分类列表的Scroll对象
        this.$nextTick(()=>{
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.menmbersContent,{
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
      getVipPackageList(opts){
        core.vipPackageList(opts).then(res => {
          //console.log(res)
          if(res.code && '00' == res.code){
            if(res.result && res.result.length > 0){
              if(res.result && res.result.length > 0) {
                this.vipTypeList = res.result
                this.goodsLibraryId = res.result[0].id
                this.vipTypeDefaultId = res.result[0].qyMerchantVipSystemResultList[0].id
                this.goodsLibraryName = res.result[0].libraryName
                this.vipTypeDefaultName = res.result[0].qyMerchantVipSystemResultList[0].vipCardType
                this.vipTypeTitleList = [] 
                for (let i = 0 ; i < this.vipTypeList.length; i++) {
                  if(this.vipTypeList[i].qyMerchantVipSystemResultList.length > 0){
                    this.vipTypeTitleList.push(this.vipTypeList[i])
                  }
                }
                //续费
                if(this.$route.query.goodsLibraryId && this.$route.query.goodsLibraryId !=0){
                  this.checkDefaultLibrary(this.$route.query.goodsLibraryId)
                }else{
                  setTimeout(() => {
                    //初始化tab
                    this.tabsLineChange(0)
                  }, 20)
                }
              }
            }
          } else {
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(error => {
          this.$toastBox.showToastBox(error)
        })
      },
      immediatePay(){
        if(this.isPaying){
          this.isPaying = false
          this.goVipPay()
        }else{
          this.$toastBox.showToastBox("请求中...")
        }
      },
      goVipPay(){
        if(!this.userId){
          this.isPaying = true
          this.getLoginUrl()
          return false;
        }
        // if(!this.checkSecurity){
        //   this.$toastBox.showToastBox("请先阅读用户保障协议")
        //   this.isPaying = true
        //   return false;
        // }
        let data = {channelNumber: null,outOrderId: null};
        data.goodsLibraryId = this.goodsLibraryId
        data.userId = this.userId
        data.vipSystemId = this.vipTypeDefaultId
        let returnUrl = window.location.href.split(".html")[0]+'.html'+ this.$route.path + '?type='+ this.goodsLibraryName + this.vipTypeDefaultName
        data.returnUrl = returnUrl
        core.vipPackagePay(data).then(res => {
          //console.log(res)
          if(res.code && '00' == res.code){
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
      avg(a){
        let res= (a).toFixed(2)
        return res
      },
      changeTitleActiveIndex(index,id){
        if(index < this.activeTitleIndex){
          this.transitionName = 'slide-right'
        }else if(index > this.activeTitleIndex){
          this.transitionName = 'slide-left'
        }
        this.activeTitleIndex = index
        this.goodsLibraryId = id
        this.vipTypeDefaultId = this.vipTypeList[index].qyMerchantVipSystemResultList[0].id
        this.goodsLibraryName = this.vipTypeList[index].libraryName
        this.vipTypeDefaultName = this.vipTypeList[index].qyMerchantVipSystemResultList[0].vipCardType
        this.activeVipIndex = 0
        this.tabsLineChange(index)
      },
      changeVipActiveIndex(index, i){
        // console.log(i)
        this.activeVipIndex = index
        this.vipTypeDefaultId = i.id
        this.vipTypeDefaultName = i.vipCardType
      },
      tabsLineChange(index){
        // this.$refs.titleItem[index].style.animation = 'changeType 0.1s linear'
        // console.log(index, this.$refs.titleItem[index].getBoundingClientRect())
        setTimeout(() => {
          let width = this.$refs.titleItem[index].getBoundingClientRect().width
          // console.log(width)
          this.$refs.tabsLine.style.width = width + 'px' 
          this.$refs.tabsLine.style.transform = 'translateX('+ this.$refs.titleItem[index].getBoundingClientRect().x +'px)'
          this.$refs.tabsLine.style.transitionDuration = '0.3s'
        }, 20)
      },
      goBack(){
        // if(this.isExcharge){
        //   this.$router.push({path: '/serviceCenter', query: {goodsLibraryId: this.exchangeGoodsLibraryId}})
        //   this.exchangeGoodsLibraryId = null
        // }else{
        //   this.$router.push({path: '/serviceCenter', query: {goodsLibraryId: this.goodsLibraryId}})
        // }
        this.$router.push({path: '/member'})
        this.hideSuccessPopup()
      },
      hideSuccessPopup(){
        this.successOpen = false
        this.exchangeOpen = false
        this.exchangeErrOpen = false
        this.exchangeInput = null
        this.isExcharge = false
        if(this.okLink){
          window.location.href = this.okLink + "?referer="+ encodeURIComponent(window.location.href)
          this.okLink = ''
        }
        window.scrollBy(0,10)
      },
      openExcharge(){
        this.exchangeOpen = true
      },
      goExcharge(){
        if(this.exchangeInput){
          core.vipPackageExchange({code: this.exchangeInput}).then(res => {
            //console.log(res)
            if(res.code && '00' == res.code){
              this.successTitle = '兑换'
              this.isExcharge = true
              this.exchangeOpen = false
              this.successOpen = true
              if(res.result.cardType == '月卡'){
                this.successMonth = res.result.goodsLibraryName + "月卡"
              }else if(res.result.cardType == '季卡'){
                this.successMonth = res.result.goodsLibraryName + "季卡"
              }else if(res.result.cardType == '年卡'){
                this.successMonth = res.result.goodsLibraryName + "年卡"
              }
              this.exchangeGoodsLibraryId = res.result.goodsLibraryId
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
              this.exchangeOpen = false
              this.exchangeErrOpen = true
              this.chargeErrText = res.message
              this.exchangeInput = null
            } else {
              this.exchangeOpen = false
              this.exchangeInput = null
              setTimeout(() => {
                this.exchangeErrOpen = true
                this.chargeErrText = res.message
              },200)
            }
          }).catch(error => {
            //console.log(error)
            this.exchangeOpen = false
            this.exchangeErrOpen = true
            this.chargeErrText = "网络错误"
            this.exchangeInput = null
          })
        }else{
          this.$toastBox.showToastBox('请输入兑换码')
        }
      },
      isSuccessisSuccess(){
        let type = this.$route.query.type
        // console.log(type)
        if(type && type != 0){
          this.successTitle = '开通'
          this.isExcharge = false
          this.successOpen = true
          this.successMonth = type
          // console.log(this.successMonth)
          this.$router.replace({path:'/openMembers', query:{type: 0}})
        }
      },
      checkDefaultLibrary(id){
        let defaultLibrary = null
        for (let j = 0 ; j < this.vipTypeList.length; j++) {
          if (this.vipTypeList[j].id === parseInt(id)) {
            defaultLibrary = j
          }
        }
        if(defaultLibrary){
          this.changeTitleActiveIndex(defaultLibrary, id)
        }
        this.$router.replace({path:'/openMembers', query:{goodsLibraryId: 0}})
      },
      onLoaded(){
        this.scroll.refresh()
      },
      changeSecurity(){
        this.checkSecurity = !this.checkSecurity
      },
      goSecurity(){
        // console.log('go')
        this.$router.push('/userSecurity')
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
.menmbers
  background-color #fff
  .menmbersContent
    position fixed
    left 0
    top 0
    bottom 6rem
    right 0
    overflow hidden
    background rgba(255,255,255,1)
    max-width 750PX

    .user-info
      height:6.25rem;
      background: url('./images/vip-top-bg.png') no-repeat center;
      background-size: 100% 100%;
      padding 0 1.5rem
      box-sizing border-box
      display flex
      justify-content flex-start
      align-items center
      img
        width 2.81rem
        height 2.81rem
        border-radius 50%
        overflow hidden
        margin-right 0.47rem
      .detail
        max-width 15rem
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
        .title
          margin-bottom 0.75rem
          display flex
          align-items center
          span 
            font-size:0.88rem;
            color:rgba(251,212,177,1);
            margin-right 0.47rem
          img 
            width 0.94rem
            height 0.94rem
            margin 0
        .des
          font-size:0.75rem;
          color:rgba(240,240,240,1);
    
    .vip-wrap
      .title
        height 3.5rem
        background rgba(255,255,255,1)
        display flex
        justify-content space-evenly
        align-items center
        border 0.03rem solid rgba(238,238,238,1)
        position: relative;
        .tabs-line
          position: absolute;
          bottom: 0px;
          left: 0;
          z-index: 1;
          height: 0.15rem;
          background-color: rgba(183,130,49,1);
          border-radius: 0.1rem;
        .title-item
          font-size: 1rem;
          color: rgba(153,153,153,1);
          font-weight: normal;
          height: 100%;
          box-sizing border-box
          line-height 3.5rem
        .title-item-active
          color: rgba(196,143,73,1);
          animation: changeType 0.1s linear;
          font-size: 1.25rem;
          font-weight bold
      .type-items
        padding 0 1rem
        box-sizing border-box
        display flex
        flex-wrap wrap
        justify-content flex-start
        .item
          // width: 6.3rem;
          width 30.45%
          height: 8.13rem;
          background: rgba(252,243,231,0);
          border: 0.05rem solid rgba(183,130,49,1);
          border-radius: 0.5rem;
          margin: 1rem 0.75rem 0 0;
          overflow: hidden;
          &:nth-child(3n+3) 
            margin-right 0
          .item-title 
            width: 100%;
            height: 2.5rem;
            line-height: 2.5rem;
            background: transparent;
            border-bottom: 0.05rem solid rgba(183,130,49,1);
            box-sizing: border-box;
            font-size: 1.13rem;
            color: rgba(183,130,49,1);
            text-align: center;
          .item-price
            font-family: 'PingFang SC','DIN-BOLD';
            height: 5.63rem;
            line-height 5.63rem
            font-size: 1.5rem;
            font-weight bold
            color: rgba(183,130,49,1);
            text-align: center;
            span 
              font-size: 0.94rem;
              font-weight bold
        .item-active
          background: rgba(252,243,231,1);
          box-shadow: 0rem 0.2rem 0.2rem 0rem rgba(255,223,173,0.5);
          .item-title 
            background: rgba(183,130,49,1);
            color:rgba(254,251,237,1);
  //兑换按钮
  .gotoExchange
    position fixed
    right 0
    top 23.781rem
    width 8.406rem
    height 2.875rem

  // 弹窗遮罩
  .addVipWrap
    position fixed
    left 0
    top 0
    right 0
    bottom 0
    max-width 750PX
    z-index 100
    background rgba(0,0,0,.4)
  .security-content
    display none
    position fixed
    bottom 3rem
    left 0
    height 3rem
    width 100%
    background-color #fff
    max-width 750PX
    z-index 99
    line-height 3rem
    color rgba(61,58,57,1)
    font-size 0.81rem
    padding 0 0.75rem
    box-sizing border-box
    .cont
      display flex
      justify-content flex-start
      align-items center
      img 
        width 1rem
        height 1rem
        padding 0.75rem      
      .text
        margin-left -0.25rem
        span 
          color rgba(183, 130, 49, 1)
  .click-subAddVip
    position fixed
    bottom 0
    left 0
    height 3rem
    width 100%
    background-color #2d2b32
    max-width 750PX
    z-index 99
    display flex
    justify-content flex-start
    line-height 3rem
    color rgba(255,255,255,1)
    font-size 1.13rem
    .right
      flex 1
      text-align center
      background-color rgba(196,143,73,1)
      // padding-left 3.5rem
      box-sizing border-box

    .left
      padding-left 1.5rem
      box-sizing border-box
      width 9.84rem
      background rgba(196,143,73,1) url("./images/vip-code-btn.png") no-repeat center center
      background-size 100% 100%

  .success-open-popup
    position fixed
    bottom 0
    left 0
    right 0
    top 0
    background rgba(0,0,0,0.5)
    z-index 100
    .success-content
      min-height 1rem
      width 20rem
      position absolute
      left 50%
      top 50%
      transform translate(-50%,-50%)
      .success-open-top
        width 100%
        min-height 19.72rem
        font-size 0
        border-radius 0.5rem
        background-color #fff
        padding 0 1.25rem
        box-sizing border-box
        .success-open-topImg
          padding-top 1.88rem
          text-align center
          .success-title
            color rgb(245,217,166)
            width 100%
            text-align center
            font-size 1.13rem
            margin 0
            font-weight 600
            color rgba(61,58,57,1)
          .success-img
            width 11.69rem
            height 10.81rem
            margin-top 1.84rem

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
      .success-open-close
        margin-top 1.25rem
        width 100%
        text-align center
        i
          color rgb(255,255,255,1)
          font-size 1.75rem

  
  .exchange-open-top
    width 100%
    font-size 0
    background #fff
    box-sizing border-box
    text-align center
    display flex
    flex-direction column
    .exchange-input
      margin 0 auto
      height 2.75rem
      width 100%
      border 0.0625rem solid rgb(199,199,199);
      border-radius 0.25rem
      outline none
      font-size 1rem
      padding-left 1rem
      box-sizing border-box
    .exchange-err-title
      width 100%
      text-align center
      font-size 1.125rem
      font-weight 600
      color rgb(51,51,51)
      margin-top 1.25rem
    .exchange-err-text
      width 100%
      text-align center
      font-size 1rem
      color rgb(102,102,102)


.fade  {
  -webkit-animation: fade 0.2s;
          animation: fade 0.2s;
}

@-webkit-keyframes fade {
  from {
    opacity 0
  }
  to {
    opacity 1
  }
}

@keyframes fade {
  from {
    opacity 0
  }
  to {
    opacity 1
  }
}

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


<template>
  <div class="coupon-goods home-page" ref="homePage">
    <shop-header ref="shopHeader" v-if="showHeader" style="position: absolute;top:0;left: 0;z-index: 999" line-style="background:#fff" :title="title"></shop-header>
    <div :style="couponGoodsStyle" class="couponGoodsContent" ref="couponGoodsContent" v-show="!showLoad">
      <div class="goods-detail">
        <div v-if="swiperList.length" class="goods-list" ref="goodsList" :class="[rechargeType == 1 ? 'recharge-good-list' : '']">
          <div class="goodsList-wrapper" ref="goodsListWrapper">
            <div v-for="(item,index) in swiperList" :key="index" class="goods-item" ref="goodsItem">
              <div @click.stop="checkGoods(index,item.id,item.salePrice,item.buyLimitModelStr,item.marketPrice,item.useExpireTimeLimit,item.stock,item.singleBuyAmount,item.outItemNo,item.providerId)" class="good-item-content" :class="[ index === activeIndex ? 'good-active-item-content' : '' ]">
                <img class="good-item-img" :src="item.cover" :alt="item.title" @load="onLoaded">
                <p class="good-item-title" style="-webkit-box-orient: vertical">{{ item.title }}</p>
                <p class="good-item-cashPrice">
                  <span class="good-item-moneylable">¥</span>
                  <span> {{ priceToFixed(item.salePrice) }}</span>
                  <img class="good-item-lable" src="./images/label.png" />
                </p>
                <p class="good-item-oldPrice">
                  官方价: <s>¥{{ priceToFixed(item.marketPrice) }}</s>
                </p>
                <div v-show="index === activeIndex" class="checkIcon">
                  <img src="./images/check.png" alt="">
                </div>
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
            <div class="hint-max">
              <span class="first-children" v-if="maxNumText">({{ maxNumText }})</span>
              <span>3分钟内到账</span>
            </div>
          </div>
        </div>
        <div v-else class="shop-num">
          <div class="shop-num-hint">
            <div class="hint-text">购买数量</div>
            <div class="hint-num">
              {{ maxNumText }}&nbsp;3分钟内到账
            </div>
          </div>
          <div v-if="stock < 1" class="shop-scoke-hint">
            <span>已抢光</span>
          </div>
          <div v-else class="num-option">
            <div class="shop-num-minus" @click="minsNum">
              <img v-if="isMin" class="min-default" src="./images/mins.png" alt="">
              <img v-else class="min-active" src="./images/mins-active.png" alt="">
            </div>
            <div class="shop-num-input">
              {{ shopNum }}
              <!-- <input type="number" v-model="shopNum" @click.stop="focusInput"  @blur="scrollToTop" readonly="readonly" class="shop-num-val"> -->
            </div>
            <div class="shop-num-add" @click="addNum">
              <img v-if="isMax" class="max-default" src="./images/add.png" alt="">
              <img v-else class="max-active" src="./images/add-active.png" alt="">
            </div>
          </div>
        </div>
        <div class="use-cont-hint">
          <div v-if="rechargeType == 0" class="use-time">
            <div class="v-ext">
              使用期限
            </div>
            <div class="v-time">
              <!-- 购买后当日24:00前有效 -->
              {{ useExpireTips  }}
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
      <div class="pay-save">
        <span class="pay-save-priceicon">¥ </span> <span class="pay-save-goodprice">{{ allGoodsPrice }}&nbsp;</span><span class="pay-save-saveprice">(已省{{ allsingleSavePrice }}元)</span>
      </div>
      <div class="pay-btn" @click="immediatePay">
        特惠购买
      </div>
    </div>
    <loading v-show="showLoad" style="padding-top: 50%"></loading>
    <div class="add-like">
      <div class="add-like-btn" @click="addLike">
        <img class="like-img" :class="[!islike ? 'img-animate' : '']" v-show="!islike" src="./images/like.png" alt="">
        <img class="like-img" :class="[islike ? 'img-animate' : '']" v-show="islike" src="./images/like-active.png" alt="">
      </div>
    </div>
    <div class="like-info">
      <div ref="likeInfo">
        {{ linkHintText }}
      </div>
    </div>
    <div class="to-service-wrap">
      <div class="to-service" @click="toServiceCall">
        <img src="./images/coustom_serve.png" alt="">
      </div>
    </div>
    <popup v-show="showPopup" :showPopupTitle='showPopupTitle' :cancelText="cancelText" :confirmText="okText" @confirm="confirm" @cancel="cancel">
      <p style="padding: 2rem 0rem; font-size: 1rem; color:#333;line-height:1.5;">
        {{ hintInformation }}
      </p>
    </popup>
    <popup v-show="notVip" @cancel="cancel" @confirm="openMember" title="您暂不可使用此权益" confirmText="前去开卡">
      <p style="padding:2rem 0.8rem 3rem; font-size: 1rem; color: #333333;line-height:1.5;">
        仅限会员用户<br/>开通会员即可享受特权优惠权益
      </p>
    </popup>
  </div>
</template>

<script>
  import BScroll  from 'better-scroll'
  import ShopHeader from '../../base/shop-header/shop-header'
  import Popup from '../../base/popup/popup'
  import Loading from '../../base/loading/loading'
  import * as core from '../../api/serviceCenter'
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
        InitHeight: false,
        merchantName: window.infoData.merchantName,
        merchantId: window.infoData.merchantId,
        loadingTitle: '加载中...',
        showLoad: true,
        showHeader: false,
        title: "",
        couponGoodsStyle: "",
        rechargeType: 0,
        rechargePlaceHolder: '',
        rechargeNum: null, //充值账号
        goodsSku: "",
        goodsPrice: 0, //当前商品新价格
        goodsOldPrice: 0,//当前商品旧价格
        swiperList: [],
        activeIndex: 0,
        maxNum: 1, //最大购买数量
        maxNumText: '',//购买数量文案
        isMin: true,
        isMax: false,
        shopNum: 1, //购买数量值
        useExpireTips: '', //使用期限提示
        saveMoney: 0,//通宝节省
        singleSavePrice:0,//新旧价节省
        allsingleSavePrice: 0,
        allGoodsPrice: 0, //商品总价
        goodDescript: '',//商品描述
        stock: 1, //商品库存
        subscribe: false,//是否预约商品
        islike: false,
        outItemNo: null,
        providerId: null,
        isPaying: true,
        showPopup: false,
        showPopupTitle: false,
        hintInformation: '此款商品太火爆了，逛逛其他宝贝吧',
        cancelText: "我知道了",
        okText:"到货提醒",
        itemId: null,
        skuId: null,
        libraryId: null,
        shareUrl: location.href,
        shareLink:  window.location.href,  //分享出去的链接
        shareTitle: '',  //分享的标题
        shareDesc: '', //分享的详情介绍
        shareImgUrl: '',
        notVip: false,
        openVipUrl: '',
        linkHintText: '已收藏'
      }
    },
    created () {
      document.title = this.$route.meta.title
      if(this.$route.query.itemId){
        this.itemId = this.$route.query.itemId
      }

      if(this.$route.query.skuId){
        this.skuId = this.$route.query.skuId
      }
      if(this.$route.query.libraryId){
        this.libraryId = this.$route.query.libraryId
      }
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
      if(!this.itemId){
        this.$toastBox.showToastBox("商品库ID出错")
        return;
      }
      this.getPassId({merchantId: this.merchantId})
    },
    mounted(){
      this.$nextTick(function(){
        setTimeout(() => {
          this.initHeight()
        }, 1000)
      })
    },
    watch: {
      activeIndex(newval,oldval){
        if(newval < oldval){
          let li = this.$refs.goodsListWrapper.getElementsByClassName('goods-item')[newval]
          this.GoodsListScroll.scrollToElement(li, 200, true, true)
        }else{
          let li = this.$refs.goodsListWrapper.getElementsByClassName('goods-item')[newval]
          this.GoodsListScroll.scrollToElement(li, 200, true, true)
        }
      },
      swiperList(newval){
        //this.goodsSku = newval[0].id
        //this.goodsPrice = newval[0].salePrice
      },
      goodsPrice(newval){
        if(this.goodsOldPrice*100 > newval*100){
          this.singleSavePrice = ((this.goodsOldPrice*100 - newval*100)/100).toFixed(2)
          this.allsingleSavePrice = this.singleSavePrice
        }else {
          this.singleSavePrice = 0
          this.allsingleSavePrice = 0
        }
      },
      maxNum(newval){
        //console.log(newval)
        if(newval == 1){
          this.isMin = true
          this.isMax = true
        }else{
          this.isMin = true
          this.isMax = false
        }
      },
      shopNum(newval){
        if(newval > this.maxNum){
          this.shopNum = this.maxNum
        }
        this.allsingleSavePrice = (this.singleSavePrice * newval).toFixed(2)
        this.allGoodsPrice = (this.goodsPrice * newval).toFixed(2)
      }
    },
    methods: {
      initHeight(){
        this.scroll.refresh()
      },
      priceToFixed(val){
        if(val){
          return (val).toFixed(2)
        }else{
          return ''
        }
      },
      initString(str){
        let data = JSON.parse(str)
        let str1 =''
        for (let key in data) {
          //console.log(data[key])
          str1 += data[key] + '/'
        }
        return str1.substring(0,str1.length -1)
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
        //this.scroll.refresh()
      },
      getPassId(opts){
        core.getPassId(opts).then(res => {
          //console.log(res)
          if (res.code && '00' === res.code) {
            if (res.result.length > 0) {
              this.passIdList = res.result
            }
            this.getVipGoodsDetail({itemId: this.itemId, merchantId: this.merchantId, qyMerchantGoodsLibraryId: this.libraryId})
          } else {
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(e => {
          this.$toastBox.showToastBox(e)
        })
      },
      getVipGoodsDetail(opts){
        core.vipGoodsDetail(opts).then(res => {
          //console.log(res)
          if(res.code && '00' == res.code){
            // this.shareTitle= res.result.title +'特权'
            // this.shareDesc= this.merchantName +res.result.title
            // this.shareImgUrl=res.result.cover
            // this.getShare()
            this.itemId = res.result.id

            // if(res.result.qySkuResultList){
            //   let data = res.result.qySkuResultList
              // if (this.passIdList){
              //   for(let k=0, length3 = this.passIdList.length; k<length3; k++){
              //     for(let j = data.length - 1; j>= 0; j--){
              //       if(data[j].id == this.passIdList[k]){
              //         data.splice(j, 1);
              //       }
              //     }
              //   }
              // }
              // this.swiperList = data
            // }
            this.swiperList = res.result.qySkuResultList
            this.title = res.result.title
            this.goodDescript = res.result.content
            this.islike = res.result.like
            if(res.result.type && res.result.type === "直充"){
              this.rechargeType = 1
              this.rechargePlaceHolder = res.result.tips
            }else{
              this.rechargeType = 0
            }
            this.showLoad = false
            this.$nextTick(() => {
              if(this.swiperList.length < 1){
                this.$toastBox.showToastBox("商品信息缺失...")
                return;
              }
              this._initScroll()
              this.changeTitle()
              this.checkDefaultSku()
            })
          } else {
            this.$toastBox.showToastBox(res.message)
          }
        })
      },
      checkDefaultSku(){
        this.goodsSku = this.swiperList[0].id;
        this.goodsPrice = this.swiperList[0].salePrice
        this.allGoodsPrice = this.swiperList[0].salePrice
        this.goodsOldPrice = this.swiperList[0].marketPrice
        this.maxNum = this.swiperList[0].singleBuyAmount || 1
        this.maxNumText = this.swiperList[0].buyLimitModelStr
        this.useExpireTips = this.swiperList[0].useExpireTimeLimit //商品有效期提示
        this.stock = this.swiperList[0].stock  //默认商品的库存
        this.outItemNo =  this.swiperList[0].outItemNo
        this.providerId = this.swiperList[0].providerId

        if(this.goodsOldPrice*100 > this.goodsPrice*100){
          this.singleSavePrice = ((this.goodsOldPrice*100 - this.goodsPrice*100)/100).toFixed(2)
          this.allsingleSavePrice = this.singleSavePrice
        }else {
          this.singleSavePrice = 0
          this.allsingleSavePrice = 0
        }

        //设置默认按钮点击状态
        if(this.maxNum == 1){
          //console.log('111')
          this.isMin = true
          this.isMax = true
        }

        this.checkedDefault()
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

            let width = 0
            for (let i = 0, length=this.swiperList.length; i < length; i++) {
              width+=this.$refs.goodsItem[0].getBoundingClientRect().width
            }
            this.$refs.goodsListWrapper.style.width = width + 0.75*16 +'px'

            this.GoodsListScroll = new BScroll(this.$refs.goodsList,{
              startX: 0,
              scrollX: true,
              scrollY: false,
              probeType: 3,
              click: true
            })
          }else{
            this.scroll.refresh()
            this.GoodsListScroll.refresh()
          }
        })
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
        let returnUrl = window.location.href.split(".html")[0]+'.html/successPage'
        let data = {}
        if(this.$refs.rechargeInputItem){
          if(this.rechargeNum){
            data = {skuId: this.goodsSku,goodsLibraryId: this.libraryId,account:this.rechargeNum,returnUrl: returnUrl,outItemNo:this.outItemNo,providerId:this.providerId}
          }else{
            this.$toastBox.showToastBox("请输入充值账号!")
            this.isPaying = true
            return;
          }
        } else {
          data = {skuId: this.goodsSku,goodsLibraryId: this.libraryId,count: this.shopNum,returnUrl: returnUrl,outItemNo:this.outItemNo,providerId:this.providerId}
        }
        core.vipGoodsPay(data).then(res => {
          //console.log(res)
          if(res.code && '00' == res.code){
            if(res.result.goUrl){
              window.location.href = res.result.goUrl
            }
          }else if(res.code && '01' === res.code && res.isLogin == 'false'){
            this.getLoginUrl()
          }else if(res.code && '02' === res.code) {
            this.notVip = true
          }else if(res.code == 'err_not_enough_stock_out'){
            this.stock = 0
            // this.showPopup = true
            // this.hintInformation = res.message
            for(let i in this.swiperList){
              if(this.swiperList[i].id == data.sku){
                this.swiperList[i].stock = 0
              }
            }
            this.$toastBox.showToastBox(res.message)
          }else if(res.code == 'error_upper_limit'){
            // this.showPopup = true
            // this.hintInformation = res.message
            this.$toastBox.showToastBox(res.message)
          } else {
            this.$toastBox.showToastBox(res.message)
          }
          this.isPaying = true
        }).catch(err=>{
          this.isPaying = true
          this.$toastBox.showToastBox("网络错误")
        })
      },
      checkGoods(index,goodsSku,price,buyLimitModelStr,oldPrice,useExpireTimeLimit,stock,singleBuyAmount,outItemNo,providerId){
        this.activeIndex = index
        this.goodsSku = goodsSku
        this.goodsPrice = price
        this.allGoodsPrice = price
        this.maxNum = singleBuyAmount || 1
        this.maxNumText = buyLimitModelStr
        this.goodsOldPrice = oldPrice
        this.shopNum = 1
        this.useExpireTips = useExpireTimeLimit
        this.stock = stock
        this.outItemNo = outItemNo
        this.providerId = providerId
        this.isMin = true
        if(this.maxNum > 1){
          this.isMax = false
        }
        //this.isSubscribe()
      },
      minsNum(){
        if(this.maxNum == 1){
          this.isMax = true
        }else{
          this.isMax = false
        }
        if(this.shopNum > 2){
          this.shopNum -= 1
          this.isMin = false
        }else if(this.shopNum <= 2) {
          this.shopNum = 1
          this.isMin = true
          //this.$toastBox.showToastBox("该商品最多可购买"+ this.maxNum +"张")
        }
      },
      addNum(){
        if(this.maxNum == 1){
          this.isMin = true
        }else{
          this.isMin = false
        }
        if(this.shopNum < this.maxNum - 1){
          this.shopNum += 1
          this.isMax = false
        }else if(this.shopNum  ==  this.maxNum) {
          this.shopNum = this.maxNum
          this.isMax = true
          this.$toastBox.showToastBox("该商品最多可购买"+ this.maxNum +"张")
        }else{
          this.isMax = true
          this.shopNum = this.maxNum
        }
      },
      addLike(){
        if(this.islike){
          this.cancelFavorite(this.itemId,this.libraryId)
        }else{
          this.addFavorite(this.itemId,this.libraryId)
        }
      },
      addFavorite(id, libraryId){
        core.vipGoodsAddLike({itemId: id, goodsLibraryId: libraryId}).then(res=>{
          if(res.code && '00' == res.code){
            this.islike = true
            this.linkHintText = '已收藏'
            this.$refs.likeInfo.style.transform = 'translate(0)' 
            this.$refs.likeInfo.style.transition = 'transform 0.3s'
            let timer = null
            clearTimeout(timer)
            timer = setTimeout(() => {
              this.$refs.likeInfo.style.transform = 'translate(100%)' 
              this.$refs.likeInfo.style.transition = 'transform 0.2s'
            },1000)
          } else if(res.code && '01' === res.code && res.isLogin == 'false') {
            this.getLoginUrl()
          } else {
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(err=>{
          this.$toastBox.showToastBox("网络错误")
        })
      },
      cancelFavorite(id, libraryId){
        core.vipGoodsDelLike({itemId: id, goodsLibraryId: libraryId}).then(res=>{
          if(res.code && '00' == res.code){
            this.islike = false
            this.linkHintText = '已取消'
            this.$refs.likeInfo.style.transform = 'translate(0)' 
            this.$refs.likeInfo.style.transition = 'transform 0.3s'
            let timer = null
            clearTimeout(timer)
            timer = setTimeout(() => {
              this.$refs.likeInfo.style.transform = 'translate(100%)' 
              this.$refs.likeInfo.style.transition = 'transform 0.2s'
            },1000)
          } else if(res.code && '01' === res.code && res.isLogin == 'false') {
            this.getLoginUrl()
          } else {
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(err=>{
          this.$toastBox.showToastBox("网络错误")
        })
      },
      toServiceCall(){
        tool.callService(this.merchantId)
      },
      confirm(){
        this.showPopup = false
      },
      cancel(){
        this.showPopup = false
        this.notVip = false
      },
      openMember(){
        this.goOpenMember()
      },
      goOpenMember() {
        // this.$refs.openMember.openServeList()
        this.notVip = false
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
      checkedDefault(){
        if(this.skuId && String(this.skuId).length > 0){
          for(let item in this.swiperList){
            if(this.swiperList[item].id == this.skuId){
              let data = this.swiperList[item]
              let index = parseInt(item)

              this.checkGoods(index,data.id,data.salePrice,data.buyLimitModelStr,data.marketPrice,data.useExpireTimeLimit,data.stock,data.singleBuyAmount,data.outItemNo,data.providerId)
              return
            }
          }
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
      }
    },
    updated() {

    },
  }
</script>


<style lang="stylus" rel="stylesheet/stylus" scoped>
  .coupon-goods
    background-color #fff
    // overflow-y: scroll;
    // -webkit-overflow-scrolling: touch;
    .immediate-payment
      position fixed
      left 0
      bottom 0
      right 0
      width 100%
      max-width 750PX
      height 3rem
      line-height 3rem
      background-color rgba(196, 143, 73, 1)
      color rgba(255, 255, 255, 1)
      font-size 1.125rem
      text-align center
      font-weight: 600;
      display flex
      align-items center
      .pay-save
        flex 1
        height 3rem
        padding-left 1rem
        .pay-save-priceicon
          font-size 0.94rem
          color: rgba(255, 255, 255, 1)
          font-weight 600
        .pay-save-goodprice
          font-size 1.25rem
          font-weight 600
        .pay-save-saveprice
          font-size 0.813rem
          font-weight 600
      .pay-btn
        width 9.84rem
        background url('./images/paybtn.png') no-repeat center
        background-size 100% 100%
        font-size 1.125rem
        color rgba(255, 255, 255, 1)
        text-align right
        padding-right 1.438rem
        box-sizing border-box
    .like-info
      position fixed
      bottom 12.2625rem
      right 1.95rem
      width: 5.5rem;
      height: 1.5rem;
      z-index 9
      overflow hidden
      div
        padding-left 1rem
        box-sizing border-box
        background: rgba(61,58,57,1);
        opacity: 0.3;
        border-radius: 0.75rem 0rem 0rem 0.75rem
        font-size 0.88rem;
        color rgba(255,255,255,1)
        line-height 1.5rem
        position absolute
        left 0 
        top 0
        width 100%
        height 100%
        transform translateX(100%)
    .add-like, .to-service-wrap
      position fixed
      bottom 11.8125rem
      right 0.75rem
      width 2.4rem
      height 2.4rem
      line-height 2.4rem
      border-radius 50%
      background-color rgb(255,255,255)
      box-shadow 0rem 0.1rem 0.3rem 0rem rgba(171,171,171,0.5)
      text-align center
      z-index 10
    .add-like
      .add-like-btn
        position relative
        width 100%
        height 100%
        .like-img
          width 1.44rem
          height 1.25rem
    .to-service-wrap
      bottom 8.5rem
      color #3992ff
      img
        width 1.38rem
        height 1.38rem
    .couponGoodsContent
      position fixed
      left 0
      top 0
      right 0
      bottom 3rem
      width 100%
      max-width 750PX
      background-color rgb(245,245,245)
      padding-bottom 0.063rem
      .goods-detail
        min-height 1px
        .goods-list
          background #fff
          height 13rem
          overflow: hidden;
          .goodsList-wrapper
            height 13rem
            padding-top 1rem
            box-sizing border-box
            .goods-item
              height 11.813rem
              width 10.125rem
              float left
              padding-left 0.75rem
              box-sizing border-box
              .good-item-content
                height 100%
                background-color #ffffff
                box-shadow 0rem 0.156rem 0.313rem 0rem rgba(0, 0, 0, 0.08)
                border 1px solid transparent
                border-radius 0.5rem
                box-sizing border-box
                overflow hidden
                position relative
                .good-item-img
                  height 6.25rem
                  width 100%
                  display block
                .good-item-title
                  min-height: 2.4rem;
                  margin-top 0.45rem
                  font-size 0.875rem
                  color rgba(61, 58, 57, 1)
                  padding 0 0.438rem
                  box-sizing border-box
                  line-clamp 2
                  line-height 1.188rem
                  overflow hidden
                  display -webkit-box
                  text-overflow ellipsis
                  -webkit-line-clamp 2
                  /* autoprefixer: ignore next */
                  -webkit-box-orient: vertical;
                .good-item-cashPrice
                  margin-top 0.32rem
                  color rgba(179, 151, 93, 1)
                  padding 0 0.438rem
                  height 0.938rem
                  box-sizing border-box
                  display flex
                  align-items center
                  .good-item-moneylable
                    font-size 0.813rem
                    font-weight 600
                    margin-right 0.2rem
                    align-self flex-end
                  span
                    font-weight 600
                    font-size 1.125rem
                  .good-item-lable
                    width:2rem;
                    height:0.75rem;
                    margin-left 0.2rem

                .good-item-oldPrice
                  padding 0 0.438rem
                  font-size 0.688rem
                  color rgba(153, 153, 153, 1)
                  margin-top 0.3rem
                  box-sizing border-box
                .checkIcon
                  position absolute
                  right 0.375rem
                  bottom 0.8rem
                  width 1.125rem
                  height 1.125rem
                  color #ff4800
                  img
                    width 100%
                    height 100%

              .good-active-item-content
                box-shadow 0rem 0.1rem 0.4rem 0rem rgba(196, 143, 73, 0.2)
                //border-color #ff4800
                box-sizing border-box
                border 1px solid rgba(196, 143, 73, 1)
                // -webkit-animation fadeIn 0.5s
                // animation fadeIn 0.5s
                transition border 0.3s

        .recharge-good-list
          background #f5f5f5
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
              color rgba(61, 58, 57, 1)
            .hint-num
              margin-left 0.75rem
              font-size 0.75rem
              color #999
          .shop-scoke-hint
            display flex
            align-items center
            span
              font-size 0.875rem
              color #999999
            .add-subscribe
              height 1.375rem
              line-height 1
              border-radius 0.75rem
              font-size 0.75rem
              color #ffffff
              background #ff4800
              padding 0 0.563rem
              border 0.063rem solid transparent
              outline none
              margin-left 0.75rem
            .cancel-subscribe
              height 1.375rem
              line-height 1
              border-radius 0.75rem
              font-size 0.75rem
              color #ff4800
              background #ffffff
              padding 0 0.563rem
              border 0.063rem solid #ff4800
              outline none
              margin-left 0.75rem
          .num-option
            width 4.9rem
            display flex
            align-items center
            .shop-num-minus
              width 1.188rem
              height 1.188rem
              .min-default
                width 100%
                height 100%
              .min-active
                width 100%
                height 100%
            .shop-num-input
              width 2.531rem
              height 100%
              font-size 1rem
              text-align center
              .shop-num-val
                width 100%
                text-align center
                outline none
                border none
                font-size 1.063rem
                color #1f1c1d
            .shop-num-add
              width 1.188rem
              height 1.188rem
              .max-default
                width 100%
                height 100%
              .max-active
                width 100%
                height 100%
        .shop-recharge-wrap
          margin-top 0.7rem
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
            .hint-max
              font-size 0.75rem
              color #999
              text-align center
              span
                font-size 0.75rem
                &:first-child
                  display block
                  margin-bottom 0.2rem
        .use-cont-hint
          margin-top 0.5rem
          padding 0 0.75rem
          box-sizing border-box
          background #ffffff
          .use-time
            height 3rem
            width 100%
            display flex
            justify-content space-between
            align-items center
            box-sizing border-box
            .v-ext
              font-size 0.938rem
              color rgba(61, 58, 57, 1)
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
              background-color rgba(196, 143, 73, 1)
	            border-radius 0.094rem
          .good-descript-text
            padding-bottom 0.5rem
            // font-size 0.813rem
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
  width 100%
  height auto
  padding 0.4rem
  box-sizing border-box

.good-descript-text >>> img
  vertical-align bottom

.good-descript-text >>> b
  // font-weight bold !important
  color rgba(61, 58, 57, 1)!important

.good-descript-text >>> strong
  // font-weight bold
  color rgba(61, 58, 57, 1)!important

.img-animate {
  -webkit-animation: zoom 0.3s;
  -moz-animation: zoom 0.3s;
  animation: zoom 0.3s;
}


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

@-webkit-keyframes zoom {
  0%,100% {
    -webkit-transform: scale(1);
  }
  50% {
    -webkit-transform: scale(1.1);
  }
}
@-moz-keyframes zoom {
  0%,100% {
    -moz-transform: scale(1);
  }
  50% {
    -moz-transform: scale(1.1);
  }
}
@keyframes zoom {
  0%,100% {
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    -ms-transform: scale(1);
    -o-transform: scale(1);
    transform: scale(1);
  }
  50% {
    -webkit-transform: scale(1.1);
    -moz-transform: scale(1.1);
    -ms-transform: scale(1.1);
    -o-transform: scale(1.1);
    transform: scale(1.1);
  }
}
</style>




<template>
  <div class="myCoupon">
    <shop-header v-if="showHeader" style="position: absolute;top:0;left: 0;z-index: 999" line-style="background:#fff" title="我的卡券"></shop-header>
    <div :style="myCouponStyle" ref="myCouponScroll" class="myCouponScroll">
      <div>
        <div class="coupon-category">
          <div class="coupon-tab" v-for="(item, index) in tabList" :key="item.id" :class="[index == activeLink ? 'coupon-tab-active' : '']" @click="handelClick(index)" ref="tabItem">{{ item.name }}
            <span v-if="index === 0 && totalRecord > 0">{{ totalRecord > 99 ? '99+' : totalRecord }}</span>
          </div>
          <div class="tabs-line" ref="tabsLine"></div>
        </div>
        <div>
          <transition-group tag="div" :name="transitionName">
            <div style="top:3.5rem;" v-show="activeLink === index" v-for="(i, index) in tabList" :key="i.id" class="validCoupon">
              <div v-if="index === 0">
                <scroll ref="validCouponScroll" class="validCouponScroll"
                  :data="orderList"
                  :pullup="true"
                  @scrollToEnd="loadMore">
                  <div style="padding:0.75rem 0.75rem 0.25rem;box-sizing:border-box;">
                    <div>
                      <div v-for="item in orderList" class="order-item-wrapper"
                          :key="item.id">
                        <OrderItem :item-data="item" @refshScroll="refshScroll"></OrderItem>
                        <div class="order-price">
                          共{{item.count}}件商品 实付款<span>¥</span><span class="money">{{price(0,item.money) || 0}}</span>
                        </div>
                        <div class="order-item-bottom">
                          <!-- <div @click="quxiao(item.id)" v-show="item.status==='SUCCESS' && item.isActivated==='N' && item.isShip==='N'">申请退款</div> -->
                          <div @click="activeOrder(item.id)" v-show="item.status==='SUCCESS' && item.isActivated==='N' && item.isShip==='N'" class="pay">立即使用</div>
                        </div>
                      </div>
                      <div v-show="orderList && orderList.length > 0" class="coupon-customer-service">
                        <van-divider :style="{ fontSize: '0.75rem', borderColor: 'rgba(221, 221, 221, 1)', color: 'rgba(61, 58, 57, 1)', padding: '0 3rem' }">
                          客服电话：<a href="tel:4006680091">4006680091</a>&nbsp;转&nbsp;<span>2</span>
                        </van-divider>
                      </div>
                      <loading style="padding: 1rem 0" v-show="showLoad" :title="loadingTitle"></loading>
                    </div>
                  </div>
                </scroll>
              </div>
              <div v-else>
                <scroll ref="validCouponScroll" class="validCouponScroll"
                  :data="couponsList"
                  :pullup="true"
                  @scrollToEnd="loadMore">
                  <div style="padding:0.75rem 0.75rem 0.25rem;box-sizing:border-box;">
                    <div>
                      <coupon-item class="nav-item"
                        @handleItem="handleItem"
                        @showDesText="showDesText"
                        v-for="(item,index) in couponsList" :key="index"
                        :coupondata="item"
                        :valid="valid"
                        @popupStatus="popupStatus"
                        @showConfirmUse="showConfirmUse">
                      </coupon-item>
                      <div v-show="couponsList && couponsList.length > 0" class="coupon-customer-service">
                        <!-- 客服电话：<a href="tel:4006680091">4006680091</a> 转 2 -->
                        <van-divider :style="{ fontSize: '0.75rem', borderColor: 'rgba(221, 221, 221, 1)', color: 'rgba(61, 58, 57, 1)', padding: '0 3rem' }">
                          客服电话：<a href="tel:4006680091">4006680091</a>&nbsp;转&nbsp;<span>2</span>
                        </van-divider>
                      </div>
                      <loading style="padding: 1rem 0" v-show="showLoad" :title="loadingTitle"></loading>
                    </div>
                  </div>
                </scroll>
              </div>
            </div>
          </transition-group>
        </div>
        <div v-show="noCoupon" class="no-coupon">
          <div class="no-coupon-content fadeIn">
            <img src="./images/no-coupon.png" alt="no coupon" class="">
            <p class="no-coupon-text">暂无卡券~</p>
            <button type="button" class="goShop" @click="goShop">去逛逛</button>
          </div>
        </div>
        <popup v-show="showConfirmPopup" :isShowTitle="false" @confirm="confirm" @cancel="cancel">
          <p style="padding:2.5rem 0.8rem 3rem; font-size: 1rem; color: rgba(61,58,57,1); line-height: 1.2;">
            卡券确认已使用？
          </p>
        </popup>
        <popup v-show="showActiveErrPopup" title="正在调取商品信息" confirmText="前去查看" @confirm="goOrderDetail" @cancel="cancelErr">
          <p style="padding:2.5rem 0.8rem 3rem; font-size: 1rem; color: #333333;">
            您购买的商品太火爆了~<br/>
            稍后可在“我的订单”中查看
          </p>
        </popup>
        <popup v-show="showActivePopup" title="温馨提示" @confirm="confirmActiveOrder" @cancel="cancel" cancelText="暂不使用" confirmText="立即使用">
          <p style="padding:2.5rem 0.8rem 3rem; font-size: 1rem; color: #333333;">
            激活后请在券码有效期内使用哦!
          </p>
        </popup>
      </div>
    </div>
  </div>
</template>

<script>
  import { Divider } from 'vant';
  import Scroll from '../../base/scroll/scroll'
  import ShopHeader from '../../base/shop-header/shop-header'
  import couponItem from '../../base/coupon-item/coupon-item'
  import OrderItem from '../../base/order-item/order-item'
  import * as core from '../../api/myCoupon'
  import Loading from '../../base/loading/loading'
  import Popup from '../../base/popup/popup'
  import tool from '../../common/js/util'

  export default {
    name: 'myCoupon',
    data() {
      return {
        tabList: [{
          name: '待激活',
          id: 0
        },{
          name: '有效期内',
          id: 1
        },
        {
          name: '已失效',
          id: 2
        }],
        showHeader: false,
        myCouponStyle: "",
        activeLink: 0,
        valid: true,
        orderList: [],
        couponsList: [],
        currentPage: 1,
        pageSize: 10,
        showLoad: true,
        noCoupon: false,
        loadingTitle: '正在加载...',
        hasMore: null,
        popupClose: false,
        showConfirmPopup: false,
        showActivePopup: false,
        showActiveErrPopup: false,
        checkId: null,
        isShowCustome: null,
        scrollStyle: null,
        transitionName: 'slide-left',
        totalRecord: null
      }
    },
    components: {
      Scroll,
      ShopHeader,
      couponItem,
      OrderItem,
      Loading,
      Popup,
      [Divider.name]: Divider
    },
    watch: {
      // 弹框监听，当弹框显示的时候，pushState添加一个历史，供返回键使用
      popupClose: {
        handler(newVal, oldVal) {
          if (newVal === true) {
            window.history.pushState(null, null, document.URL);
          }
        },
        deep: true
      },
      couponsList(newVal){
        if(newVal.length > 0){
          this.isShowCustome = true
        }else{
          this.isShowCustome = false
        }
      }
    },
    created() {
      document.title = this.$route.meta.title
      let ua = navigator.userAgent.toLowerCase();
      let isWeixin = ua.indexOf('micromessenger') != -1;
      if (!isWeixin) {
        this.showHeader=true
        this.myCouponStyle = "top:2.75rem"
        // alert('Dragondean说这不是通过微信内置浏览器');
      } else {
        this.showHeader=false
        this.myCouponStyle = "top:0rem"
      }
    },
    mounted(){
      
      this.handelClick(1)
    
      this.getWaitNum({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        status: 'SUCCESS',
        isShip: 'N',
        isActivated: 'N'
      })
  
      if (window.history && window.history.pushState) {
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', this.goBack, false);
      }
    },
    destroyed(){
      window.removeEventListener('popstate', this.goBack, false);
    },
    methods: {
      getWaitNum(opts){
        core.allOrder(opts).then(res => {
          //console.log(res)
          if (res.code && '00' === res.code) {
            this.totalRecord = res.result.totalRecord
          }else if(res.code && '01' === res.code && res.isLogin == 'false'){
            this.getLoginUrl()
          } else {
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(e => {
          this.$toastBox.showToastBox(e)
        })
      },
      price(a, b) {
        return tool.priceStr(a, b)
      },
      goBack () {
        // console.log("点击了浏览器的返回按钮");
        this.$couponToastBox.hideToastBox()
        if(!this.popupClose){
          window.history.back()
        }
        this.popupClose = false
      },
      handelClick(index, type){
        if(index < this.activeLink){
          this.transitionName = 'slide-right'
        }else if(index > this.activeLink){
          this.transitionName = 'slide-left'
        }
        this.couponsList = []
        this.orderList = []
        this.activeLink = index
        this.noCoupon = false
        this.currentPage = 1
        if(index == 0) {
          this.valid = null
          this.orderList = []
          this.getWaitActive({
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            status: 'SUCCESS',
            isShip: 'N',
            isActivated: 'N'
          })
        }else if(index == 1){
          this.valid = true
          this.couponsList = []
          this.getValidCoupon({
            currentPage: this.currentPage,
            pageSize: this.pageSize
          }, type);
        } else {
          this.valid = false
          this.couponsList=[]
          this.getInvalidCouponsList({
            currentPage: this.currentPage,
            pageSize: this.pageSize
          });
        }
        this.tabsLineChange(index)
      },
      tabsLineChange(index){
        this.$refs.tabItem[index].style.animation = 'changeType 0.1s linear'
        setTimeout(() => {
          let width = this.$refs.tabItem[index].getBoundingClientRect().width
          // console.log(width)
          this.$refs.tabsLine.style.width = width + 'px' 
          this.$refs.tabsLine.style.transform = 'translateX('+ this.$refs.tabItem[index].getBoundingClientRect().x +'px)'
          this.$refs.tabsLine.style.transitionDuration = '0.3s'
        }, 20)
      },
      loadMore() {
        if (!this.showLoad && this.hasMore) {
          if(this.activeLink === 0){
            this.getWaitActive({
              currentPage: this.currentPage,
              pageSize: this.pageSize,
              status: 'SUCCESS',
              isShip: 'N',
              isActivated: 'N'
            })
          }else if(this.activeLink === 1){
            this.getValidCoupon({
              currentPage: this.currentPage,
              pageSize: this.pageSize
            })
          }else{
            this.getInvalidCouponsList({
              currentPage: this.currentPage,
              pageSize: this.pageSize
            });
          }
        }
      },
      loadImage() {
        this.$refs.validCouponScroll.refresh()
      },
      refshScroll() {
        this.$refs.validCouponScroll[0].refresh()
      },
      showDesText(){
        // console.log(this.$refs.validCouponScroll)
        if(this.activeLink === 0){
          this.$refs.validCouponScroll[0].refresh()
        }else{
          this.$refs.validCouponScroll[1].refresh()
        }
      },
      handleItem(){
        // console.log("点击了")
      },
      popupStatus(val){
        this.popupClose = val
      },
      goShop(){
        this.$router.push({path:'/member'})
      },
      showConfirmUse(id){
        this.showConfirmPopup = true
        this.checkId = id
      },
      cancel(){
        this.showConfirmPopup = false
        this.showActivePopup = false
      },
      cancelErr() {
        this.showActiveErrPopup = false
        this.handelClick(0)
      },
      confirm(){
        if(this.checkId){
          core.checkCoupon({id: this.checkId}).then(res => {
            //console.log(res);
            if (res.code && '00' === res.code) {
              this.showConfirmPopup = false
              this.$toastBox.showToastBox(res.message)
              this.couponsList.forEach((item,index) => {
                if(item.id == this.checkId){
                  this.couponsList.splice(index,1)
                  this.checkId = null
                }
              })
            }else if(res.code && '01' === res.code && res.isLogin == 'false'){
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
          })
        }else{
           this.$toastBox.showToastBox('参数错误')
        }

      },
      //激活订单
      activeOrder(id) {
        this.activeOrderId = null
        this.activeOrderId = id
        this.showActivePopup = true
      },
      confirmActiveOrder(id) {
        core.activeOrder({orderId: this.activeOrderId}).then(res => {
          if (res.code && '00' === res.code) {
            this.showActivePopup = false
            this.activeOrderId = null
            this.totalRecord -= 1
            if(res.result.isShip === 'Y'){
              // this.$toastBox.showToastBox('激活成功')
              setTimeout(() => {
                this.handelClick(1, 'showPopop')
              }, 200)
            }else{
              this.showActiveErrPopup = true
            }
          } else  {
            this.showActivePopup = false
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(e => {
          this.showActivePopup = false
          this.$toastBox.showToastBox(e)
        })
      },
      goOrderDetail() {
        this.$router.push({path: '/orderForm', query:{index: 3}})
      },
      getWaitActive(opts){
        core.allOrder(opts).then(res => {
          //console.log(res)
          if (res.code && '00' === res.code) {
            if (res.result.data.length > 0) {
              if(res.result.data && res.result.data.length > 0){
                this.orderList = this.orderList.concat(res.result.data)
              }
              this.currentPage++;
              if (this.orderList.length >= res.result.totalRecord) {
                this.hasMore = false
              }else{
                 this.hasMore = true
              }
            } else {
              this.hasMore = false
            }
            if(this.orderList.length < 1){
              this.noCoupon = true
            }else{
              this.noCoupon = false
            }
            this.showLoad = false
          }else if(res.code && '01' === res.code && res.isLogin == 'false'){
            this.showLoad = false
            this.getLoginUrl()
          } else {
            this.showLoad = false
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(e => {
          this.showLoad = false
          this.$toastBox.showToastBox(e)
        })
      },
      getValidCoupon(opts, type) {
        this.showLoad = true;
        core.getValidCoupon(opts).then(res => {
          //console.log(res);
          if (res.code && '00' === res.code) {
            this.currentPage++;
            this.couponsList = this.couponsList.concat(res.result.data)
            if (this.couponsList.length >= res.result.totalRecord) {
              this.hasMore = false
            }else{
              this.hasMore = true
            }
            if(this.couponsList.length < 1){
              this.noCoupon = true
            }else{
              this.noCoupon = false
            }
            this.showLoad = false;
            if(type && type === 'showPopop' && this.couponsList && this.couponsList.length > 0){ //判断激活成功滑过弹出第一个二维码内容
              let url = this.couponsList[0].qrCode
              if(url){
                this.showDefaultQrcode(url)
              }
            }
          }else if(res.code && '01' === res.code && res.isLogin == 'false'){
            this.getLoginUrl()
            this.showLoad = false;
          } else {
            this.showLoad = false
            this.$toastBox.showToastBox(res.message)
          }
        })
      },
      getInvalidCouponsList(opts) {
        this.showLoad = true;
        core.getInvalidCoupon(opts).then(res => {
          if (res.code && '00' === res.code) {
            // console.log(res)
            this.currentPage++;
            this.couponsList = this.couponsList.concat(res.result.data)
            if (this.couponsList.length >= res.result.totalRecord) {
              this.hasMore = false
            }else{
              this.hasMore = true
            }
            if(this.couponsList.length < 1){
              this.noCoupon = true
            }else{
              this.noCoupon = false
            }
            this.showLoad = false;
          }else if(res.code && '01' === res.code && res.isLogin == 'false'){
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
            this.showLoad = false;
          } else {
            this.showLoad = false
            this.$toastBox.showToastBox(res.message)
          }
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
      showDefaultQrcode(url){
        this.$emit("popupStatus", true)
        this.$couponToastBox.showToastBox(url)
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
  .myCoupon
    .myCouponScroll
      position fixed
      top 0
      left 0
      right 0
      bottom 0
      background-color rgb(245, 245, 245, 1)
      .coupon-category
        width 100%
        height 3.5rem
        line-height 3.5rem
        display flex
        justify-content space-evenly
        background-color rgb(255,255,255)
        border-bottom 0.03rem solid rgba(238,238,238,1)
        box-sizing border-box
        position: relative;
        .tabs-line
          position: absolute;
          bottom: 0px;
          left: 0;
          z-index: 1;
          height: 0.15rem;
          background-color: rgba(183,130,49,1);
          border-radius: 0.1rem;
        .coupon-tab
          font-size 1rem
          text-align center
          color rgba(153, 153, 153, 1)
          position relative
          span 
            position absolute
            top 0.4rem
            right -1rem
            background-color rgba(226, 58, 55, 1)
            min-width 1rem
            height 1rem
            border-radius 50%
            color #fff
            line-height 1rem
            font-size 0.69rem
            padding 0.05rem
      
        .coupon-tab-active
          color: rgba(196,143,73,1);
          animation: changeType 0.1s linear;
          font-size: 1.25rem;
          font-weight bold

    .validCoupon
      position absolute
      top 0
      left 0
      right 0
      bottom 0
      .validCouponScroll
        position absolute
        top 0
        left 0
        right 0
        bottom 0
        background-color rgb(245, 245, 245, 1)
        overflow hidden
    .no-coupon
      position absolute
      top 3.5rem
      left 0
      right 0
      bottom 0
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

  .coupon-customer-service
    background rgba(245, 245, 245, 1)
    font-size 0.75rem
    color #999999
    // position fixed
    // left 0
    // right 0
    // bottom 0
    text-align center
    // z-index 11
    a
      font-size: 0.75rem;
      font-weight: normal;
      letter-spacing: 0rem;
      color: rgba(73, 109, 94, 1)
    span
      color: rgba(73, 109, 94, 1)
.common-question /deep/ .van-collapse-item__content {
  padding-top 0
}


.order-item-wrapper
  background-color #fff
  box-sizing border-box
  padding 0.75rem 0.75rem 
  border-radius 0.5rem
  .order-price
    text-align right
    font-size 0.75rem
    color rgba(61,58,57,1)
    padding-bottom 1rem
    letter-spacing 0.02rem
    span
      color rgba(196, 143, 73, 1)
    .money
      font-size 1rem
      font-family 'PingFang SC','DIN-BOLD'
  .order-item-bottom
    display flex
    justify-content flex-end
    div
      font-size 0.81rem
      border-radius 0.25rem
      padding 0.53rem 0.94rem
      margin-left 0.75rem
      color #999
      border 1px solid rgba(199, 199, 199, 1)
    .pay
      color rgba(196, 143, 73, 1)
      border-color rgba(196, 143, 73, 1)
.fadeIn {
    -webkit-animation: fadeIn .3s;
            animation: fadeIn .3s;
}

@-webkit-keyframes fadeIn {
    from {
      opacity: 0
    }
    to {
      opacity: 1
    }
}

@keyframes fadeIn {
    from {
        opacity: 0
    }
    to {
        opacity: 1
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

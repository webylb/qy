


<template>
  <div class="myCoupon">
    <shop-header v-if="showHeader" style="position: absolute;top:0;left: 0;z-index: 999" line-style="background:#fff" title="我的卡券"></shop-header>
    <div :style="myCouponStyle" ref="myCouponScroll" class="myCouponScroll">
      <div>
        <div class="coupon-category">
          <div class="coupon-tab coupon-tab-valid" :class="[ activeLink == 1 ? 'active' : '']">
            <div class="coupon-list" @click="handelClick(1)">有效期内</div>
          </div>
          <div class="coupon-tab" :class="[ activeLink == 2 ? 'active' : '']">
            <div class="coupon-list" @click="handelClick(2)">已失效</div>
          </div>
        </div>

        <div v-if="activeLink == 1" class="validCoupon">
          <scroll style="top:3.375rem" ref="validCouponScroll" class="validCouponScroll"
            :data="couponsList"
            :pullup="true"
            @scrollToEnd="loadMore">
            <div>
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
                <loading style="padding:  1rem 0" v-show="showLoad" :title="loadingTitle"></loading>
              </div>
              <div v-show="noCoupon" class="no-coupon">
                <div class="no-coupon-content fadeIn">
                  <img src="./images/no-coupon.png" alt="no coupon" class="">
                  <p class="no-coupon-text">您还没有购买任何卡券</p>
                  <button type="button" class="goShop" @click="goShop">前往购买</button>
                </div>
              </div>
            </div>
          </scroll>
        </div>

        <div class="validCoupon" v-else>
          <scroll
            style="top:3.375rem" class="validCouponScroll" ref="validCouponScroll"
            :data="invalidCouponsList"
            :pullup="true"
            @scrollToEnd="loadMore">
            <div>
              <div>
                <coupon-item class="nav-item"
                  @handleItem="handleItem"
                  @showDesText="showDesText"
                  v-for="(item,index) in invalidCouponsList" :key="index"
                  :coupondata="item"
                  :valid="valid"
                  @popupStatus="popupStatus">
                </coupon-item>
                <loading style="padding:  1rem 0" v-show="showLoad" :title="loadingTitle"></loading>
              </div>
              <div v-show="noInvalidCoupon" class="no-coupon">
                <div class="no-coupon-content fadeIn">
                  <img src="./images/no-coupon.png" alt="no coupon" class="">
                  <p class="no-coupon-text">您还没有任何失效卡券</p>
                </div>
              </div>
            </div>
          </scroll>
        </div>
        <div class="coupon-customer-service">
          客服电话：<a href="tel:4006680091">4006680091</a> 转 2
        </div>
        <popup v-show="showConfirmPopup" :showPopupTitle="false" @confirm="confirm" @cancel="cancel">
          <p style="padding:2.5rem 0.8rem 2rem; font-size: 1rem; color: #333333; line-height: 1.203rem;">
            卡券确认已使用？
          </p>
        </popup>
      </div>
    </div>
  </div>
</template>

<script>
  import Scroll from '../../base/scroll/scroll'
  import ShopHeader from '../../base/shop-header/shop-header'
  import couponItem from '../../base/coupon-item/coupon-item'
  import * as core from '../../api/myCoupon'
  import Loading from '../../base/loading/loading'
  import Popup from '../../base/popup/popup'
  import tool from '../../common/js/util'

  export default {
    name: 'myCoupon',
    data() {
      return {
        showHeader: false,
        myCouponStyle: "",
        activeLink: 1,
        valid: true,
        couponsList: [],
        invalidCouponsList:[],
        currentPage: 1,
        pageSize: 10,
        showLoad: false,
        noCoupon: false,
        noInvalidCoupon: false,
        loadingTitle: '正在加载...',
        hasMore: null,
        popupClose: false,
        showConfirmPopup: false
      }
    },
    components: {
      Scroll,
      ShopHeader,
      couponItem,
      Loading,
      Popup
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

      this.getValidCoupon({ currentPage: this.currentPage, pageSize: this.pageSize});
    },
    mounted(){
      if (window.history && window.history.pushState) {
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', this.goBack, false);
      }
    },
    destroyed(){
      window.removeEventListener('popstate', this.goBack, false);
    },
    methods: {
      goBack () {
        // console.log("点击了浏览器的返回按钮");
        this.$couponToastBox.hideToastBox()
        if(!this.popupClose){
          window.history.back()
        }
        this.popupClose = false
      },
      handelClick(status){
        this.activeLink = status
        this.currentPage = 1
        if(status == 1){
          this.valid = true
          this.couponsList = []
          this.getValidCoupon({
            currentPage: this.currentPage,
            pageSize: this.pageSize
          });
        } else {
          this.valid = false
          this.invalidCouponsList=[]
          this.getInvalidCouponsList({
            currentPage: this.currentPage,
            pageSize: this.pageSize
          });
        }
      },
      loadMore() {
        if (!this.showLoad && !this.hasMore) {
          this.getValidCoupon({
            currentPage: this.currentPage,
            pageSize: this.pageSize
          })
        }
      },
      loadImage() {
        //this.$refs.validCouponScroll.refresh()
      },
      showDesText(){
        this.$refs.validCouponScroll.refresh()
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
      showConfirmUse(){
        this.showConfirmPopup = true
      },
      cancel(){
        this.showConfirmPopup = false
      },
      confirm(){

      },
      getValidCoupon(opts) {
        this.showLoad = true;
        core.getValidCoupon(opts).then(res => {
          //console.log(res);
          if (res.code && '00' === res.code) {
            this.currentPage++;
            this.showLoad = false;
            this.couponsList = this.couponsList.concat(res.result.data)
            if (this.couponsList.length >= res.result.totalRecord) {
              this.hasMore = true
            }
            if(this.couponsList.length < 1){
              this.noCoupon = true
            }
          }else if(res.code && '01' === res.code && res.isLogin == 'false'){
            if(res.url){
              window.location.href = res.url
            }
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
            this.showLoad = false;
            this.invalidCouponsList = this.invalidCouponsList.concat(res.result.data)
            if (this.invalidCouponsList.length >= res.result.totalRecord) {
              this.hasMore = true
            }
            if(this.invalidCouponsList.length < 1){
              this.noInvalidCoupon = true
            }
          }else if(res.code && '01' === res.code && res.isLogin == 'false'){
            if(res.url){
              window.location.href = res.url
            }
          } else {
            this.showLoad = false
            this.$toastBox.showToastBox(res.message)
          }
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .myCoupon
    .myCouponScroll
      position fixed
      top 0
      left 0
      right 0
      bottom 0
      background-color rgb(245, 245, 245)
      .coupon-category
        width 100%
        height 2.75rem
        line-height 2.75rem
        border-top 1px solid rgb(230,230,230)
        display flex
        justify-content flex-start
        background-color rgb(255,255,255)
        // -moz-box-shadow 0px 1px 2px #c1c1c1
        // -webkit-box-shadow 0px 1px 2px #c1c1c1
        // box-shadow 0px 1px 2px #c1c1c1
        .coupon-tab
          flex 1
          font-size 0.875rem
          text-align center
          color rgb(102,102,102)
          position relative
          .coupon-list
            height 100%
            display inline-block
          .router-link-active
            color rgb(255,72,0)
            border-bottom 3px solid rgb(255,72,0)
            box-sizing: border-box;
        .coupon-tab-valid::after
          content ""
          width 2px
          height 1.7rem
          position absolute
          top 0.525rem
          right -1px
          background: -moz-linear-gradient(top, #fff, #ececec, #ddd, #ececec, #fff);
          background: -webkit-gradient(linear, top, bottom, from(#fff), color-stop(0.25, #ececec), color-stop(0.5, #ddd), color-stop(0.75, #ececec), to(#fff));
          background: -webkit-linear-gradient(top, #fff, #ececec, #ddd, #ececec, #fff);
          background: -o-linear-gradient(top, #fff, #ececec, #ddd, #ececec, #fff);
          background: linear-gradient(#fff, #ececec, #ddd, #ececec, #fff);

        .active
          .coupon-list
            color #ff4800
            padding 0 10px
            border-bottom 3px solid #ff4800
            box-sizing border-box


    .validCoupon
      .validCouponScroll
        position absolute
        top 0
        left 0
        right 0
        bottom 3rem
        background-color rgb(245, 245, 245)
        overflow hidden

      .no-coupon
        // position fixed
        // top 0
        // left 0
        // right 0
        // bottom 0
        .no-coupon-content
          position absolute
          top 6rem
          width 9.5rem
          left 50%
          transform translateX(-50%)
          text-align center
          img
            width 9.5rem
            height 6.78125rem
          .no-coupon-text
            margin 0.75rem 0 0.9375rem 0
            font-size 0.75rem
            color rgb(153,153,153)
          .goShop
            outline none
            background transparent
            color rgb(66,176,233)
            border 0.0625rem solid rgb(66,176,233)
            border-radius 4px
            padding 0.22rem  0.625rem

    .coupon-customer-service
      font-size 0.875rem
      color #999999
      position fixed
      left 0
      right 0
      bottom 0
      height 3rem
      text-align center
      line-height 3rem
      a
        text-decoration: underline;
        font-size: 0.875rem;
        font-weight: normal;
        letter-spacing: 0rem;
        color: #42b0e9;
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
</style>

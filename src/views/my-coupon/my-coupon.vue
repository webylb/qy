


<template>
  <div class="myCoupon">
    <shop-header v-if="showHeader" style="position: absolute;top:0;left: 0;z-index: 999" line-style="background:#fff" title="我的卡券"></shop-header>
    <div :style="myCouponStyle" ref="myCouponScroll" class="myCouponScroll">
      <div>
        <div class="coupon-category">
          <div class="coupon-tab" v-for="(item, index) in tabList" :key="item.id" :class="[index == activeLink ? 'coupon-tab-active' : '']" @click="handelClick(index)" ref="tabItem">{{ item.name }}</div>
          <div class="tabs-line" ref="tabsLine"></div>
        </div>
        <div>
          <transition-group tag="div" :name="transitionName">
            <div style="top:3.5rem;" v-show="activeLink === index" v-for="(i, index) in tabList" :key="i.id" class="validCoupon">
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
                    <loading style="padding:  1rem 0" v-show="showLoad" :title="loadingTitle"></loading>
                  </div>
                </div>
              </scroll>
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

        <div class="coupon-customer-service" v-if="isShowCustome">
          客服电话：<a href="tel:4006680091">4006680091</a> 转 2
        </div>
        <popup v-show="showConfirmPopup" :isShowTitle="false" @confirm="confirm" @cancel="cancel">
          <p style="padding:2.5rem 0.8rem 3rem; font-size: 1rem; color: rgba(61,58,57,1); line-height: 1.2;">
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
        tabList: [{
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
        couponsList: [],
        currentPage: 1,
        pageSize: 10,
        showLoad: true,
        noCoupon: false,
        loadingTitle: '正在加载...',
        hasMore: null,
        popupClose: false,
        showConfirmPopup: false,
        checkId: null,
        isShowCustome: null,
        scrollStyle: null,
        transitionName: 'slide-left',
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

      this.getValidCoupon({ currentPage: this.currentPage, pageSize: this.pageSize});
    },
    mounted(){
      if (window.history && window.history.pushState) {
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', this.goBack, false);
      }
      setTimeout(() => {
        //初始化tab
        this.tabsLineChange(0)
      }, 500)
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
      handelClick(index){
        if(index < this.activeLink){
          this.transitionName = 'slide-right'
        }else if(index > this.activeLink){
          this.transitionName = 'slide-left'
        }
        this.activeLink = index
        this.currentPage = 1
        if(index == 0){
          this.valid = true
          this.couponsList = []
          this.getValidCoupon({
            currentPage: this.currentPage,
            pageSize: this.pageSize
          });
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
              if(res.url){
                var index = res.url.lastIndexOf("\/");
                var str = res.url.substring(index, res.url.length);
                let regIndex = /\?/gi;
                if(str && regIndex.test(str)){
                  window.location.href = res.url + "&referer=" + encodeURIComponent(tool.replaceUrlForUrpass(window.location.href))
                }else{
                  window.location.href = res.url + "?referer=" + encodeURIComponent(tool.replaceUrlForUrpass(window.location.href))
                }
              }
            } else {
              this.$toastBox.showToastBox(res.message)
            }
          })
        }else{
           this.$toastBox.showToastBox('参数错误')
        }

      },
      getValidCoupon(opts) {
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
          }else if(res.code && '01' === res.code && res.isLogin == 'false'){
            if(res.url){
              var index = res.url.lastIndexOf("\/");
              var str = res.url.substring(index, res.url.length);
              let regIndex = /\?/gi;
              if(str && regIndex.test(str)){
                window.location.href = res.url + "&referer=" + encodeURIComponent(tool.replaceUrlForUrpass(window.location.href))
              }else{
                window.location.href = res.url + "?referer=" + encodeURIComponent(tool.replaceUrlForUrpass(window.location.href))
              }
            }
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
            if(res.url){
              var index = res.url.lastIndexOf("\/");
              var str = res.url.substring(index, res.url.length);
              let regIndex = /\?/gi;
              if(str && regIndex.test(str)){
                window.location.href = res.url + "&referer=" + encodeURIComponent(tool.replaceUrlForUrpass(window.location.href))
              }else{
                window.location.href = res.url + "?referer=" + encodeURIComponent(tool.replaceUrlForUrpass(window.location.href))
              }
            }
            this.showLoad = false;
          } else {
            this.showLoad = false
            this.$toastBox.showToastBox(res.message)
          }
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
      bottom 3rem
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

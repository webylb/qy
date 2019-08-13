<template>
  <div class="order-form">
    <order-nav class="order-nav1" :num-data="numData" @handleNav="handleNav" :active-index="activeIndex"></order-nav>
    <scroll :pullup="true"
            @scrollToEnd="loadMore"
            :data="orderList"
            ref="orderForm"
            class="order-scroll">
      <div style="overflow: hidden;">
        <div v-for="item in orderList" class="order-item-wrapper"
             :key="item.id">
          <div class="title-wrapper">
            <div class="title">{{ merchantName }}特权</div>
            <div class="state">
              <span v-show="item.status==='SUCCESS' && item.isShip==='N'">待发货</span>
              <span v-show="item.status==='SUCCESS' && item.isShip==='Y'">已完成</span>
              <span v-show="item.status==='WAIT'">待付款</span>
              <span v-show="item.status==='CANCEL'">已取消</span>
              <span v-show="item.status==='FAIL'">支付失败</span>
            </div>
          </div>
          <OrderItem :item-data="item"></OrderItem>
          <div class="order-price">共{{item.count}}件商品
            实付款:{{price(0,item.money)}}
          </div>
          <div class="order-item-bottom">
            <div @click="detail(item)"
                 v-show="item.status==='SUCCESS' && item.isShip==='Y' && item.type !='直充' ">
              前去使用
            </div>
            <div @click="quxiao(item.id)" v-show="item.status==='WAIT'">取消订单</div>
            <div v-show="item.status==='WAIT'" @click="confirmReceipt(item.id)" class="pay">
              立即支付
            </div>
          </div>
          <div v-show="item.payTime" class="time">
            {{formatDateing(item.payTime)}}
          </div>
        </div>

        <div v-if="orderList&&orderList.length < 1" class="no-order">
          <div class="no-coupon">
            <div class="no-coupon-content fadeIn">
              <img src="../order-form/images/no-coupon.png" alt="no coupon"
                   class="">
              <p class="no-coupon-text">您还没有相关订单</p>
            </div>
          </div>
        </div>

        <loading v-show="showLoad" class="loading" :title="loadingTitle"></loading>
      </div>
    </scroll>
    <div class="order-customer-service">
      客服电话：<a href="tel:4006680091">4006680091</a> 转 2
    </div>
    <popup v-show="showQuXiaoPopup" :showPopupTitle="false" @confirm="confirmQuXiao" @cancel="cancel">
      <p style="padding:2.5rem 0.8rem 2rem; font-size: 1rem; color: #333333; line-height: 1.203rem;">
        是否取消订单?
      </p>
    </popup>
    <popup v-show="showQueRenPopup" :showPopupTitle="false" @confirm="confirmQueRen" @cancel="cancel">
      <p style="padding:2.5rem 0.8rem 2rem; font-size: 1rem; color: #333333; line-height: 1.203rem;">
        是否确认支付?
      </p>
    </popup>
  </div>
</template>

<script>
  import OrderItem from '../../base/order-item/order-item'
  import OrderNav from '../../base/order-nav/order-nav'
  import Scroll from '../../base/scroll/scroll'
  import tool from '../../common/js/util'
  import Loading from '../../base/loading/loading'
  import * as core from '../../api/orderForm'
  import Popup from '../../base/popup/popup'

  export default {
    name: 'order-form',
    data() {
      return {
        merchantName: window.infoData.merchantName,
        activeIndex: 0,
        orderList: [],
        showLoad: true,
        loadingTitle: '正在加载...',
        currentPage: 1,
        pageSize: 10,
        numData:{
          unReceiptOrderCount: 0,
          unShipOrderCount: 0,
          unpaidOrderCount: 0
        },
        showQuXiaoPopup: false,
        quxiaoId: null,
        showQueRenPopup: false,
        querenId: null,
        hasMore: null,
        isPaying: true
      }
    },
    components: {
      Scroll,
      OrderNav,
      OrderItem,
      Loading,
      Popup
    },
    watch: {
      numData: {
        //immediate: true,    // 这句重要
        handler (val) {
          console.log(val)
          //this.numData=val
        },
        deep: true
      }
    },
    created() {
      document.title = this.$route.meta.title

      //判断是否为微信
      let ua = navigator.userAgent.toLowerCase();
      let isWeixin = ua.indexOf('micromessenger') != -1;
      if (isWeixin) {
        let config = {};
        config.url = window.location.href;
        // 判断当前url是否存在?参数匹配符
        if(!config.url.match(/\?/)) {
          location.replace(window.location.href.split('#')[0] + '?' + window.location.hash);
          return;
        }
      }

      this.selectObj = { currentPage: this.currentPage, pageSize: this.pageSize}
      this.getAllOrder(this.selectObj)
    },
    methods: {
      formatDateing(e) {
        return tool.formatDate(e)
      },
      loadMore() {
        if (!this.showLoad && !this.hasMore) {
          if (this.orderList.length > 0) {
            this.getAllOrder(this.selectObj)
          }
        }
      },
      getAllOrder(opts) {
        this.showLoad = true
        core.allOrder(opts).then(res => {
          //console.log(res)
          if (res.code && '00' === res.code) {
            if (res.result.data.length > 0) {
              this.orderList = this.orderList.concat(res.result.data)
              this.showLoad = false;
              this.selectObj.currentPage++;
              if (this.orderList.length >= res.result.totalRecord) {
                this.hasMore = true
              }
            } else {
              this.showLoad = false;
            }
          }else if(res.code && '01' === res.code && res.isLogin == 'false'){
            if(res.url){
              window.location.href = res.url
            }
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
      quxiao(id) {
        this.quxiaoId = null
        this.quxiaoId = id
        this.showQuXiaoPopup = true
      },
      confirmQuXiao(){
        core.cancelOrder({orderId: this.quxiaoId}).then(res => {
          if (res.code && '00' === res.code) {
            this.showQuXiaoPopup = false
            this.quxiaoId = null
            this.handleNav(this.activeIndex, true)
          } else  {
            this.showQuXiaoPopup = false
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(e => {
          this.showQuXiaoPopup = false
          this.$toastBox.showToastBox(e)
        })
      },
      cancel(){
        this.showQuXiaoPopup = false
        this.showQueRenPopup = false
      },
      detail(item){
        this.$router.push({path:'/myCoupon'})
      },
      confirmReceipt(id) {
        this.querenId = null
        this.querenId = id
        this.showQueRenPopup = true
      },
      confirmQueRen(){
        if(this.isPaying){
          this.isPaying = false
          this.showQueRenPopup = false
          this.toPay()
        }else{
          this.$toastBox.showToastBox("请求中...")
        }
      },
      toPay(){
        let returnUrl = window.location.href.split("#")[0]+'#/successPage'
        let data = {orderId: this.querenId, returnUrl: returnUrl}
        core.payOrder(data).then(res => {
          //console.log(res)
          if(res.code && '00' == res.code){
            if(res.result.goUrl){
              window.location.href = res.result.goUrl
              this.isPaying = true
            }else{
              this.callWxPay(res.result.weixinOrderInfo);
            }
          }else if(res.code && '02' === res.code) {
            this.isPaying = true
            this.$router.push("/openMembers")
          }else {
            this.isPaying = true
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(err=>{
          this.isPaying = true
          this.$toastBox.showToastBox("网络错误")
        })
      },
      callWxPay(params) {
        if (typeof WeixinJSBridge == "undefined"){
          if(document.addEventListener){
            document.addEventListener('WeixinJSBridgeReady', this.jsApiCall(params), false);
          }else if (document.attachEvent){
            document.attachEvent('WeixinJSBridgeReady', this.jsApiCall(params));
            document.attachEvent('onWeixinJSBridgeReady', this.jsApiCall(params));
          }
        }else{
          this.jsApiCall(params);
        }
      },
      jsApiCall(params) {
        let that = this
        WeixinJSBridge.invoke('getBrandWCPayRequest', {
          'appId': params.appId,
          'timeStamp': String(params.timeStamp),
          'nonceStr': params.nonceStr,
          'package': params.package,
          'signType': params.signType,
          'paySign': params.paySign
          },function (res) {
            console.log(res)
            if (res.err_msg === 'get_brand_wcpay_request:ok') {
              //that.$toastBox.showToastBox('微信支付成功')
              that.isPaying = true
              that.$router.push({path:'/successPage'})
            } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
              //that.$toastBox.showToastBox('用户取消支付')
              that.isPaying = true
            } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
              //that.$toastBox.showToastBox('网络异常，请重试')
              that.isPaying = true
            }
          }
        );
      },
      handleNav(e, state) {
        if (this.showLoad) {
          return false
        }
        if (this.activeIndex !== e || state) {
          this.activeIndex = e;
          this.orderList = [];
          this.showLoad = true;
          this.currentPage = 1;
          this.hasMore = false;
          if (e === 0) {
            this.selectObj = {
              currentPage: this.currentPage,
              pageSize: this.pageSize
            }
            this.getAllOrder(this.selectObj)
          }
          if (e === 1) {
            this.selectObj = {
              currentPage: this.currentPage,
              pageSize: this.pageSize,
              status: 'WAIT',
            }
            this.getAllOrder(this.selectObj)
          }
          if (e === 2) {
            this.selectObj = {
              currentPage: this.currentPage,
              pageSize: this.pageSize,
              status: 'SUCCESS',
              isShip: 'N'
            }
            this.getAllOrder(this.selectObj)
          }
          if (e === 3) {
            this.selectObj = {
              currentPage: this.currentPage,
              pageSize: this.pageSize,
              status: 'SUCCESS',
              isShip: 'Y'
            }
            this.getAllOrder(this.selectObj)
          }
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .order-form
    .order-nav1
      position fixed
      top 0
      left 0
      right 0
    .order-scroll
      position fixed
      top 2.75rem
      /*top 0*/
      left 0
      z-index -1
      background-color #f5f5f5
      right 0
      bottom 3rem

      .no-order
        height 16.875rem
      .no-coupon
        position fixed
        top 0
        left 0
        right 0
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
            color rgb(153, 153, 153)

      .order-item-wrapper
        background-color #fff
        box-sizing border-box
        padding 0.75rem 4.27%
        margin-top 0.625rem
        .title-wrapper
          display flex
          font-size 0.813rem
          color #000
          flex-direction row
          padding-bottom 0.75rem
          justify-content space-between
          .state
            font-size 0.75rem
            color #ff4800
        .order-price
          text-align right
          font-size 0.75rem
          color #333
          padding-bottom 0.719rem
        .order-item-bottom
          display flex
          justify-content flex-end
          div
            font-size 0.75rem
            border-radius 0.688rem
            padding 0.313rem 0.719rem
            margin-left 1.063rem
            color #999
            border 1px solid #999
          .pay
            color #ff4800
            border-color #ff4800
        .time
          padding-top 0.375rem
          font-size 0.75rem
          color #999
    .order-customer-service
      background-color #f5f5f5
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
    .tuijian
      padding 1rem 4.27% 0
      .you-like
        margin 0 0 0.375rem 0
      .list-wrapper
        text-align left
        width 100%
        padding 0.625rem 0 1rem
        box-sizing border-box
        margin 0 auto
        .list
          display flex
          justify-content space-between
          flex-wrap wrap
          padding-bottom 1rem
          .list-item
            width 49.43%
            overflow hidden
            border-radius 0.25rem
            margin-bottom 0.25rem
            break-inside: avoid;
</style>

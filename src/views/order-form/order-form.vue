<template>
  <div class="order-form">
    <order-nav class="order-nav1" ref="orderNavs" :num-data="numData" @handleNav="handleNav" :active-index="activeIndex"></order-nav>
    <scroll :pullup="true"
            @scrollToEnd="loadMore"
            ref="orderForm"
            class="order-scroll">
      <div style="overflow: hidden;">
        <div v-show="!showLoad">
          <div v-for="item in orderList" class="order-item-wrapper"
              :key="item.id">
            <div class="title-wrapper">
              <div class="title">{{ merchantName }}特权</div>
              <div class="state">
                <span v-show="item.status==='WAIT'">待付款</span>
                <span v-show="item.status==='SUCCESS' && item.isShip==='N' && item.isActivated === 'N'">待激活</span>
                <span v-show="item.status==='SUCCESS' && item.isShip==='N' && item.isActivated === 'Y'">待发货</span>
                <span v-show="item.status==='SUCCESS' && item.isShip==='Y'">已完成</span>
                <span v-show="item.status==='CANCEL'">已取消</span>
                <span v-show="item.status==='FAIL'">支付失败</span>
              </div>
            </div>
            <OrderItem :item-data="item" @refshScroll="refshScroll"></OrderItem>
            <div class="order-price">
              共{{item.count}}件商品 实付款<span>¥</span><span class="money">{{price(0,item.money) || 0}}</span>
            </div>
            <div class="order-item-bottom">
              <div @click="quxiao(item.id)" v-show="item.status==='WAIT'">取消订单</div>
              <div v-show="item.status==='WAIT'" @click="confirmReceipt(item.id)" class="pay">
                立即支付
              </div>
              <!-- <div @click="quxiao(item.id)" v-show="item.status==='SUCCESS' && item.isActivated==='N' && item.isShip==='N'">申请退款</div> -->
              <div @click="activeOrder(item.id)" v-show="item.status==='SUCCESS' && item.isActivated==='N' && item.isShip==='N'" class="pay">立即使用</div>
              <div @click="showActiveDetail()" v-show="item.status==='SUCCESS' && item.isActivated==='Y' && item.isShip==='N' && item.type!=='直充'" class="pay">查看详情</div>
              <div @click="showRechargeDetail(item)" v-show="item.status==='SUCCESS' && item.isActivated==='Y' && item.type==='直充'">查看详情</div>
              <div @click="showCouponDetail(item)"
                  v-show="item.status==='SUCCESS' && item.isShip==='Y' && item.type !='直充' && item.isActivated === 'Y' " class="pay">
                查看并使用
              </div>
            </div>
          </div>
          <div v-if="orderList && orderList.length > 0" class="coupon-customer-service">
            <!-- 客服电话：<a href="tel:4006680091">4006680091</a> 转 2 -->
            <van-divider :style="{ fontSize: '0.75rem', borderColor: 'rgba(221, 221, 221, 1)', color: 'rgba(61, 58, 57, 1)', padding: '0 3rem' }">
              客服电话：<a href="tel:4006680091">4006680091</a>&nbsp;转&nbsp;<span>2</span>
            </van-divider>
          </div>
          <div v-if="orderList && orderList.length < 1" class="no-order">
            <div class="no-coupon">
              <div class="no-coupon-content fadeIn">
                <img src="../order-form/images/no-order.png" alt="no coupon"
                    class="">
                <p class="no-coupon-text">暂无订单~</p>
              </div>
            </div>
          </div>
        </div>
        <loading v-show="showLoad" :title="loadingTitle" style="padding-top:10px;"></loading>
      </div>
    </scroll>
    <popup v-show="showQuXiaoPopup" :isShowTitle="false" @confirm="confirmQuXiao" @cancel="cancel">
      <p style="padding:2.5rem 0.8rem 3rem; font-size: 1rem; color: #333333;">
        是否取消订单?
      </p>
    </popup>
    <popup v-show="showQueRenPopup" :isShowTitle="false" @confirm="confirmQueRen" @cancel="cancel">
      <p style="padding:2.5rem 0.8rem 3rem; font-size: 1rem; color: #333333;">
        是否确认支付?
      </p>
    </popup>
    <popup v-show="showActivePopup" title="温馨提示" @confirm="confirmActiveOrder" @cancel="cancel" cancelText="暂不使用" confirmText="立即使用">
      <p style="padding:2.5rem 0.8rem 3rem; font-size: 1rem; color: #333333;">
        激活后请在券码有效期内使用哦!
      </p>
    </popup>
    <popup v-show="showActiveErrPopup" :isShowCancel=false title="正在调取商品信息" confirmText="我知道了" @cancel="cancel">
      <p style="padding:2.5rem 0.8rem 3rem; font-size: 1rem; color: #333333;">
        您购买的商品太火爆了~<br/>
        稍后可在“我的订单”中查看
      </p>
    </popup>
    <popup v-show="showRechargePopup" :title="goodsName" :isShowCancel=false @cancel="cancel">
      <div class="recharge-info-wrap">
        <p>充值账号: {{ rechargeNum }}</p>
        <p>充值时间: {{ rechargeTime }}</p>
        <p>订单编号: {{ orderNum }}</p>
      </div>
    </popup>
    <CouponPopup v-show="showCouponPopup" :title="goodsName" @cancel="closeCouponPopup">
      <div class="coupon-info-wrap" v-if="couponList && couponList.length > 0">
        <div v-if="orderType !== '二维码' && orderType !== null" class="slider-box 1">
          <slider class="slider-wrapper" :loop=false :isClick=true>
            <div v-for="item in couponList" :key="item.id">
              <div class="item-wrap">
                <div class="left">
                  <div v-if="item.card && item.pwd">
                    <p>卡号: {{item.card}}</p>
                    <p>
                      <span>密码: {{item.pwd}}</span> 
                      <button type="button" class="coupon-copy"
                          v-clipboard:copy="item.card+' '+item.pwd"
                          v-clipboard:success="onCopySuccess"
                          v-clipboard:error="onCopyError">复制</button>
                    </p>
                  </div>
                  <div v-else>
                    <p>
                      <span>卡密: {{item.card || item.pwd}}</span> 
                      <button type="button" class="coupon-copy"
                        v-clipboard:copy="item.card || item.pwd"
                        v-clipboard:success="onCopySuccess"
                        v-clipboard:error="onCopyError">复制</button>
                    </p>
                  </div>
                </div>
                <div class="right" @click="goMyCoupon">
                  <div>
                    前<br>去<br>使<br>用
                  </div>
                </div>
              </div>
            </div>
          </slider>   
        </div>
        <div v-if="orderType == '二维码'" class="slider-box 2" @click="showImgPrev">
          <slider class="slider-wrapper" :isClick=true :loop=false :autoPlay=false>
            <div v-for="(item, index) in couponList" :key="index">
              <img class="coupon-item-img" :src="item.qrCode" alt="">
            </div>
          </slider>
          <p class="text-qr1">二维码点击可放大查看</p>
          <p class="text-qr2">持二维码线下门店即可兑换</p>
        </div>
        <div class="text-line"><img src="./images/line.png" alt=""></div>
        <p class="text-1">激活后的卡券将移至【我的卡券】内</p>
        <p class="text-2" @click="goCoustomServe"><span>无效卡券申诉</span><i class="iconfont">&#xe713;</i></p>
      </div>
    </CouponPopup>
  </div>
</template>

<script>
  import { Divider, ImagePreview } from 'vant';
  import Slider from '../../base/slider/slider'
  import OrderItem from '../../base/order-item/order-item'
  import OrderNav from '../../base/order-nav/order-nav'
  import Scroll from '../../base/scroll/scroll'
  import tool from '../../common/js/util'
  import Loading from '../../base/loading/loading'
  import * as core from '../../api/orderForm'
  import Popup from '../../base/popup/popup'
  import CouponPopup from '../../base/coupon-popup/coupon-popup'
  import { parse } from 'path'

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
          unPayOrderCount: 0,
          unActiveOrderCount: 0,
          unShipOrderCount: 0
        },
        showQuXiaoPopup: false,
        quxiaoId: null,
        showQueRenPopup: false,
        querenId: null,
        hasMore: null,
        isPaying: true,
        activeOrderId: null,
        showActivePopup: false,
        showActiveErrPopup: false,
        showRechargePopup: false,
        goodsName: null,
        rechargeTime: null,
        rechargeNum: null,
        orderNum: null,
        showCouponPopup: false,
        couponList: null,
        orderType: null,
        imgPrevList: []
      }
    },
    components: {
      Scroll,
      OrderNav,
      OrderItem,
      Loading,
      Popup,
      CouponPopup,
      Slider,
      [Divider.name]: Divider,
      [ImagePreview.name]: ImagePreview
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
      this.selectObj = { currentPage: this.currentPage, pageSize: this.pageSize}
    },
    activated() {
      this.cancel()
      this.closeCouponPopup()
      if(this.$route.query.index > -1){
        this.showLoad = false;
        this.handleNav(parseInt(this.$route.query.index), true)
      }else{
        this.getAllOrder(this.selectObj)
        this.activeIndex = 0
        this.$refs.orderNavs.tabsLineChange(0)
      }
    },
    methods: {
      formatDateing(e) {
        return tool.formatDate(e)
      },
      loadMore() {
        if (!this.showLoad && this.hasMore) {
          if (this.orderList.length > 0) {
            this.getAllOrder(this.selectObj)
          }
        }
      },
      getAllOrder(opts, type) {
        core.allOrder(opts).then(res => {
          //console.log(res)
          if (res.code && '00' === res.code) {
            if (res.result.data.length > 0) {
              if(res.result.data && res.result.data.length > 0){
                this.orderList = this.orderList.concat(res.result.data)
              }
              this.showLoad = false;
              this.selectObj.currentPage++;
              if (this.orderList.length >= res.result.totalRecord) {
                this.hasMore = false
              }else{
                 this.hasMore = true
              }
              this.$refs.orderForm.refresh()
              if(type && type === 'showPopop' && this.orderList && this.orderList.length > 0){ //判断激活成功滑过弹出第一个内容
                let item = this.orderList[0]
                this.showCouponDetail(item)
              }
            } else {
              this.showLoad = false
              this.hasMore = false
            }
          }else if(res.code && '01' === res.code && res.isLogin == 'false'){
            this.showLoad = true
            this.getLoginUrl()
          } else {
            this.showLoad = true
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(e => {
          this.showLoad = true
          this.$toastBox.showToastBox(e)
        })
      },
      refshScroll(){
        this.$refs.orderForm.refresh()
      },
      price(a, b) {
        return tool.priceStr(a, b)
      },
      //取消订单
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
            // this.$toastBox.showToastBox('激活成功')
            if(res.result.isShip === 'Y'){
              setTimeout(() => {
                this.handleNav(4, true, 'showPopop')
              }, 200)
            }else{
              setTimeout(() => {
                this.handleNav(3, true)
              }, 200)
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
      showActiveDetail(){
        this.showActiveErrPopup = true
      },
      showRechargeDetail(item){
        this.showRechargePopup = true
        this.goodsName = item.skuName
        this.rechargeTime = tool.formatDate(item.payTime, 'Y/M/DH')
        this.rechargeNum = item.rechargeInterface
        this.orderNum = item.id
      },
      cancel(){
        this.showQuXiaoPopup = false
        this.showQueRenPopup = false
        this.showActivePopup = false
        this.showActiveErrPopup = false
        this.showRechargePopup = false
        this.orderType = null
      },
      closeCouponPopup(){
        this.showCouponPopup = false
      },
      showCouponDetail(item){
        this.couponList = null
        this.orderType = null

        this.goodsName = item.skuName
        this.couponList = item.qyCardTicketResults
        this.orderType = item.type
        this.showCouponPopup = true
        if(this.couponList && this.couponList.length > 0){
          this.imgPrevList = []
          this.couponList.forEach( item => {
            this.imgPrevList.push(item.qrCode)
          })
        }
      },
      showImgPrev() {
        ImagePreview({
          images: this.imgPrevList,
          startPosition: 0,
          onClose() {
            // do something
          }
        });
      },
      goMyCoupon(){
        this.showCouponPopup = false
        this.$router.push({path:'/myCoupon', query: {index: 1}})
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
        let returnUrl = window.location.href.split(".html")[0]+'.html/successPage'
        let data = {orderId: this.querenId, returnUrl: returnUrl}
        core.payOrder(data).then(res => {
          //console.log(res)
          if(res.code && '00' == res.code){
            if(res.result.goUrl){
              window.location.href = res.result.goUrl
              this.isPaying = true
            }
          }else if(res.code && '02' === res.code) {
            this.isPaying = true
            this.goOpenMember()
          } else {
            this.isPaying = true
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(err=>{
          this.isPaying = true
          this.$toastBox.showToastBox("网络错误")
        })
      },
      handleNav(e, state, type) {
        if (this.showLoad) {
          return false
        }
        if (this.activeIndex !== e || state) {
          this.activeIndex = e
          this.$refs.orderNavs.tabsLineChange(e)
          this.orderList = []
          this.showLoad = true
          this.currentPage = 1
          this.hasMore = true
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
              isShip: 'N',
              isActivated: 'N'
            }
            this.getAllOrder(this.selectObj)
          }
          if (e === 2) {
            this.selectObj = {
              currentPage: this.currentPage,
              pageSize: this.pageSize,
              status: 'SUCCESS',
              isShip: 'N',
              isActivated: 'N'
            }
            this.getAllOrder(this.selectObj)
          }
          if (e === 3) {
            this.selectObj = {
              currentPage: this.currentPage,
              pageSize: this.pageSize,
              status: 'SUCCESS',
              isShip: 'N',
              isActivated: 'Y'
            }
            this.getAllOrder(this.selectObj)
          }
          if (e === 4) {
            this.selectObj = {
              currentPage: this.currentPage,
              pageSize: this.pageSize,
              status: 'SUCCESS',
              isShip: 'Y'
            }
            this.getAllOrder(this.selectObj, type)
          }
        }
      },
      goCoustomServe(){
        window.location.href = 'https://tb.53kf.com/code/client/10187208/1'
      },
      onCopySuccess(){
        this.$toastBox.showToastBox("复制成功")
      },
      onCopyError(){
        this.$toastBox.showToastBox("复制失败")
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

<style lang="stylus" scoped>
  .order-form
    .order-nav1
      position fixed
      top 0
      left 0
      right 0
    .order-scroll
      position fixed
      top 3.5rem
      /*top 0*/
      left 0
      z-index -1
      background-color #f5f5f5
      right 0
      bottom 0
      .no-order
        // position: fixed;
        // left: 0;
        // top: 3.55rem;
        // right: 0;
        // bottom: 0;
        background #fff
        height: calc(100vh - 3.56rem);
        position: relative;
        top: 1px;
      .no-coupon
        position relative
        .no-coupon-content
          position absolute
          top 7.5rem
          width 9.5rem
          left 50%
          transform translateX(-50%)
          text-align center
          img
            width 7.5rem
            height 7.5rem
            margin-bottom 1.5rem
          .no-coupon-text
            margin 0 auto
            font-size 1rem
            color rgba(153, 153, 153, 1)

      .order-item-wrapper
        background-color #fff
        box-sizing border-box
        padding 1.25rem 0.75rem 
        margin 0.75rem 0.75rem 0
        border-radius 0.5rem
        .title-wrapper
          display flex
          flex-direction row
          padding-bottom 0.97rem
          justify-content space-between
          align-items center
          .title
            font-size 1rem
            color rgba(61,58,57,1)
          .state
            font-size 0.81rem
            color rgba(196, 143, 73, 1)
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
  .recharge-info-wrap
    margin:1.88rem 1.25rem 2.38rem; 
    font-size: 0.88rem;
    color: rgba(102, 102, 102, 1)
    line-height: 1.2;
    border-radius: 0.5rem;
    background-color rgba(249, 239, 226, 1)
    padding 1rem 0.75rem
    text-align left
    p 
      line-height 2
  .coupon-info-wrap
    // margin: 1.88rem 1.25rem 2.38rem 1.25rem; 
    .slider-box
      margin-bottom 1rem
      width 18rem!important
      overflow hidden
      position: relative;
      padding-bottom: 0.75rem;
      box-sizing border-box
      margin: 0 auto;
      padding-top: 1.5rem;
      min-height 7rem
      .coupon-item-img
        width auto!important
        max-height 12rem
        margin 0 auto
      .item-wrap
        height 5rem
        width 100%
        margin 0 auto
        display flex
        justify-content center
        .left 
          width 14.88rem
          height 5rem
          background url('./images/popup-left.png') no-repeat center
          background-size 100% 100%
          div
            width 100%
            height 5rem
            padding 1.25rem 0.75rem
            box-sizing border-box
            p
              margin-bottom 0.5rem
              width 100%
              display: flex;
              justify-content space-between
              align-items: center;
              font-size:0.88rem;
              line-height: 1.2;
              &:last-child
                margin-bottom 0
              span
                overflow hidden
                text-overflow ellipsis
                white-space nowrap
              .coupon-copy
                margin-left 0.25rem
                outline none
                background-color transparent
                border-radius 0.13rem
                line-height 1.2
                padding 0.15rem 0.34rem
                font-size 0.75rem
                border 0.0625rem solid rgba(195, 142, 72, 1)
                color rgba(195, 142, 72, 1)
        .right 
          width 2.63rem
          height 5rem
          background url('./images/popup-right.png') no-repeat center
          background-size 100% 100%
          color #fff
          font-size 0.88rem
          div
            width 1rem
            height 5rem
            margin: 0 auto;  
            line-height: 1.2;
            display: flex;
            align-items: center;
    
    .text-qr1
      color rgba(153, 153, 153, 1)
      font-size 0.75rem
      margin-bottom 0.5rem
    .text-qr2
      color rgba(61, 58, 57, 1)
      font-size 1.25rem
      line-height 1.2
      margin-bottom 0.5rem
    .text-line
      height 0.94rem
      display flex
      position relative
      margin-bottom 1rem
      &::after 
        content ''
        position absolute
        width 0.94rem
        height 0.94rem
        border-radius 50%
        background rgba(0,0,0,0.5)
        left -0.47rem
        top 0
      &::before 
        content ''
        position absolute
        width 0.94rem
        height 0.94rem
        border-radius 50%
        background rgba(0,0,0,0.5)
        right -0.47rem
        top 0
      img 
        width 100%
        height 100%
    .text-1
      color rgba(153, 153, 153, 1)
      font-size 1rem
      line-height 1.2
      margin-bottom 0.75rem
    .text-2
      display inline-block
      color rgba(195,142,72,1)
      font-size 1rem
      line-height 1.2
      margin-bottom 2rem

  .coupon-customer-service
    background rgba(245, 245, 245, 1)
    font-size 0.75rem
    color #999999
    // position fixed
    // left 0
    // right 0
    // bottom 0
    text-align center
    z-index 11
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

<template>
  <div style="padding: 0rem;">
    <div class="center-order">
      <div class="center-title">我的订单</div>
      <div class="center-wrap">
        <div class="order-item" @click="goOrder('wait')">
          <img src="./images/order-wait.png" alt="">
          <p>待付款</p>
          <div class="num-label" v-if="orderNumData && orderNumData.waitPaymentCount > 0"> {{ orderNumData.waitPaymentCount>99 ? '99+' : orderNumData.waitPaymentCount }}</div>
        </div>
        <div class="order-item" @click="goOrder('waitActive')">
          <img src="./images/order-wait-active.png" alt="">
          <p>待激活</p>
          <div class="num-label" v-if="orderNumData && orderNumData.waitActivationCount > 0"> {{ orderNumData.waitActivationCount>99 ? '99+' : orderNumData.waitActivationCount }}</div>
        </div>
        <div class="order-item" @click="goOrder('waitDelivery')">
          <img src="./images/order-wait-delivery.png" alt="">
          <p>待发货</p>
          <div class="num-label" v-if="orderNumData && orderNumData.waitSendGoodsCount > 0"> {{ orderNumData.waitSendGoodsCount>99 ? '99+' : orderNumData.waitSendGoodsCount }}</div>
        </div>
        <div class="order-item" @click="goOrder('success')">
          <img src="./images/order-success.png" alt="">
          <p>已完成</p>
        </div>
        <div class="order-item" @click="goOrder('all')">
          <img src="./images/order-all.png" alt="">
          <p>全部订单</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import tool from '../../common/js/util'
  export default {
    data() {
      return {
        userAvatar: null
      }
    },
    props: {
      merchantId: {
        type: Number,
        default: 0
      },
      isLogin: {
        type: Boolean,
        default:false
      },
      orderNumData: {
        type: Object,
        default: null
      }
    },
    mounted() {

    },
    activated(){

    },
    beforeUpdate() {

    },
    methods: {
      goOrder(type){
        if(this.isLogin){
          switch (type) {
            case 'wait':
              this.$router.push({path:'/orderForm', query: {index: 1}})
              break;
            case 'waitActive':
              this.$router.push({path:'/orderForm', query: {index: 2}})
              break;
            case 'waitDelivery':
              this.$router.push({path:'/orderForm', query: {index: 3}})
              break;
            case 'success':
              this.$router.push({path:'/orderForm', query: {index: 4}})
              break;
            default:
              this.$router.push({path:'/orderForm', query: {index: 0}})
              break;
          }
        }else{

        }
      }
    },
    destroyed() {

    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.center-order
  min-height:8.59rem;
  background:rgba(255,255,255,1);
  border-radius:0.5rem;
  margin 0 0.75rem 0.75rem 0.75rem
  box-sizing border-box
  padding 1.22rem 0.72rem 0 0.72rem 
  .center-title
    font-size 1.25rem
    color rgba(61,58,57,1)
    font-weight 500
  .center-wrap
    display flex
    justify-content space-around
    align-items center
    padding-top 1.22rem
    box-sizing border-box
    .order-item
      text-align center
      width 3.45rem
      position relative
      img 
        width 2rem
        height 2rem
      p 
        font-size:0.81rem;
        color:rgba(61,58,57,1);
        margin-top 0.28rem
      .num-label
        position absolute
        top -0.375rem
        left 2.4rem
        background-color rgba(226, 58, 55, 1)
        min-width 1rem
        height 1rem
        border-radius 50%
        color #fff
        line-height 1rem
        font-size 0.69rem
</style>


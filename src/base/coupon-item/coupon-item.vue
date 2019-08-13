
<template>
    <div :class="['coupon-item', valid ? 'coupon-valid-item' : 'coupon-invalid-item' ]" @click="handleItem">
      <div class="exchange-date">
        <div>
          <span class="exchange-topText">兑换时间:</span><span> {{ timeFormat(coupondata.createTime) }}</span>
        </div>
        <div v-show="false">
          <button type="button" class="confirmUse" @click="showConfirmUse" v-if="valid">确认使用</button>
        </div>
      </div>
      <div class="coupon-info">
        <div class="coupon-img">
          <img :src="coupondata.skuCover" alt="">
        </div>
        <div class="coupon-detail">
          <h2 class="coupon-title">{{ coupondata.skuName }}</h2>
          <div class="coupon-vaild-date">有效期至 {{ timeFormat(coupondata.expireTime) }}</div>
          <div class="coupon-centent">
            <div>
              <div v-if="coupondata.card" class="coupon-num">卡号: {{ coupondata.card }}</div>
              <div v-if="coupondata.card && coupondata.pwd" class="coupon-pwd">密码: {{ coupondata.pwd }}</div>
              <div v-if="(!coupondata.card) && coupondata.pwd" class="coupon-camilo">卡密: {{ coupondata.pwd }}</div>
              <div v-if="coupondata.qrCode ? true : false" class="coupon-qrcode">
                <span @click="showQrcode(coupondata.qrCode)">点击查看卡券</span>
              </div>
            </div>
            <div v-if="!coupondata.qrCode" class="coupon-option">
              <button type="button" class="coupon-copy"
                v-clipboard:copy="copyText"
                v-clipboard:success="onCopySuccess"
                v-clipboard:error="onCopyError">复制</button>
            </div>
          </div>
        </div>
      </div>
      <div class="coupon-direction-for-use">
        <div class="coupon-dfu-button" @click="openDirectionForUse">
          <div class="">
            <p>使用说明
            <span v-if="!openText">
              <i class="iconfont">&#xe632;</i>
            </span>
            <span v-else>
              <i class="iconfont">&#xe634;</i>
            </span>
            </p>
          </div>
        </div>
        <div v-if="coupondata.jumpUrl && !coupondata.qrCode" class="coupon-dfu-link">
          <a :href="coupondata.jumpUrl">点击去使用</a>
        </div>
      </div>
      <div class="coupon-dfu-text" v-show="openText" v-html="coupondata.instructions">
          {{ coupondata.instructions }}
      </div>
    </div>
</template>

<script>
  import util from "../../common/js/util"
  export default {
    name: 'coupon-item',
    props:{
      coupondata:{
        type: Object,
        default: null
      },
      valid: {
        type: Boolean,
        default: true
      }
    },
    created(){
      //判断粘贴数据
      if(this.coupondata.card && this.coupondata.pwd){
        this.copyText = this.coupondata.card + "  " + this.coupondata.pwd
      }else if((!this.coupondata.card) && this.coupondata.pwd ){
        this.copyText = this.coupondata.pwd
      }else{
         this.copyText = this.coupondata.card
      }
    },
    data(){
      return {
        copyText:"",
        openText: false,
        createTime: '',
        expireTime: ''
      }
    },
    methods:{
      timeFormat(date){
        return util.formatDate(date)
      },
      handleItem(){
        this.$emit('handleItem',{item:this.data})
      },
      onCopySuccess(){
        this.$toastBox.showToastBox("复制成功")
      },
      onCopyError(){
        this.$toastBox.showToastBox("复制失败")
      },
      openDirectionForUse(){
        this.openText = !this.openText
        this.$emit("showDesText")
      },
      showQrcode(url){
        this.$emit("popupStatus", true)
        this.$couponToastBox.showToastBox(url)
      },
      showConfirmUse(){
        this.$emit("showConfirmUse")
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .coupon-invalid-item
    background url("./images/invalid.png") no-repeat right top;
    background-size 4.15625rem 3.53125rem
    background-position 96% -0.3rem
  .coupon-item + .coupon-item
    margin-top 0.625rem
  .coupon-item
    width 100%
    background-color #fff
    padding 0 1rem
    padding-bottom 0.75rem
    box-sizing: border-box;
    .exchange-date
      height 2.03rem
      border-bottom 1px solid rgb(230,230,230)
      font-size 0.6875rem
      line-height 2.03rem
      color rgb(153,153,153)
      box-sizing border-box
      display flex
      justify-content space-between
      .exchange-topText
        display inline-block
        margin-right 0.2rem
      .confirmUse
        font-size 0.75rem
        color #998054
        background-color #f6dcaf
        outline none
        border none
        border-radius 0.063rem
        height 1.313rem
        line-height 1.313rem
    .coupon-info
      padding 0.75rem 0
      display flex
      height 4.3125rem
      .coupon-img
        width 4.3125rem
        height 100%
        img
          width 100%
          height 100%
          display inline-block
      .coupon-detail
        height 4.3125rem
        padding-left 0.75rem
        flex 1
        position relative
        .coupon-title
          font-size 0.875rem
          margin-bottom 0.5rem
        .coupon-vaild-date
          font-size 0.6875rem
          color rgb(255,72,0)
          margin-bottom 0.5rem
        .coupon-centent{
          display flex
          justify-content space-between
          justify-items center
        }
        .coupon-num
          font-size 0.6875rem
          color rgb(153,153,153)
          margin-bottom 0.5rem
        .coupon-pwd
          font-size 0.6875rem
          color rgb(153,153,153)
        .coupon-camilo
          font-size 0.6875rem
          color rgb(153,153,153)
        .coupon-qrcode
          position absolute
          left 0.75rem
          bottom 0
          border-bottom: 1px solid #42b0e9;
          box-sizing: border-box;
          span
            color rgb(66,176,233)
            font-size 0.75rem
        .coupon-option
          width 2.8125rem
          display flex
          align-items center
          .coupon-copy
            width 100%
            height 1.1875rem
            line-height 1.1875rem
            border 1px solid rgb(255,72,0)
            border-radius 10px
            color rgb(255,72,0)
            padding 0
            outline none
            background-color #fff
            font-size 0.75rem

    .coupon-direction-for-use
      height 1.47rem
      font-size 0.6875rem
      display flex
      justify-content space-between
      .coupon-dfu-button
        color rgb(153,153,153)
        line-height: 1.2rem;
        .iconfont
          font-size 0.75rem
      .coupon-dfu-link
        a
          color rgb(66,176,233)
          font-size 0.75rem
          border-bottom 1px solid rgb(66,176,233)
    .coupon-dfu-text
      color rgb(153,153,153)
      border 1px solid rgb(230,230,230)
      padding 0.25rem 0.5rem
      font-size 0.6875rem
      line-height 1.25rem
      border-radius 5px
</style>

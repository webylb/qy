
<template>
    <div :class="['coupon-item', valid ? 'coupon-valid-item' : 'coupon-invalid-item' ]" @click="handleItem">
      <div class="coupon-info">
        <img class="coupon-img" :src="coupondata.skuCover" alt="">
        <div class="coupon-detail">
          <div class="coupon-title" style="-webkit-box-orient: vertical">{{ coupondata.skuName }}</div>
          <div class="exchange-times">{{ timeFormat(coupondata.createTime) }}</div>
          <div class="coupon-vaild-date">{{ timeFormat(coupondata.expireTime) }} 失效</div>
        </div>
      </div>
      <div class="coupon-centent">
        <div v-if="coupondata.card && (!coupondata.qrCode)">
          <div class="coupon-option">
            <span>卡号: {{ coupondata.card }}</span>
            <button type="button" class="coupon-copy"
              v-clipboard:copy="copyText"
              v-clipboard:success="onCopySuccess"
              v-clipboard:error="onCopyError">复制</button>
          </div>
          <div class="coupon-option" v-if="coupondata.pwd">
            <span>密码: {{ coupondata.pwd }}</span>
          </div>
        </div>
        <div v-if="(!coupondata.card) && coupondata.pwd && (!coupondata.qrCode)">
          <div class="coupon-option">
            <span>卡密: {{ coupondata.pwd }}</span>
            <button type="button" class="coupon-copy"
              v-clipboard:copy="copyText"
              v-clipboard:success="onCopySuccess"
              v-clipboard:error="onCopyError">复制</button>
          </div>
        </div>
        <div v-if="coupondata.qrCode" >
          <div class="coupon-option">
            <span>二维码</span>
            <button type="button" class="qr-btn"  @click="showQrcode(coupondata.qrCode)">点击出示券码</button>
          </div>
        </div>
      </div>
      <div class="coupon-direction-for-use">
        <div class="coupon-dfu-button" @click="openDirectionForUse">
          <p>使用说明
          <span v-if="!openText">
            <i class="iconfont">&#xe632;</i>
          </span>
          <span v-else>
            <i class="iconfont">&#xe634;</i>
          </span>
          </p>
        </div>
        <div class="coupon-dfu-link">
          <button type="button" class="confirmUse" @click="showConfirmUse(coupondata.id)" v-if="valid">确认使用</button>
          <a v-if="coupondata.jumpUrl && !coupondata.qrCode" :href="coupondata.jumpUrl">点击去使用</a>
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
        return util.formatDate(date, 'Y/M/DH')
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
      showConfirmUse(id){
        this.$emit("showConfirmUse",id)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .coupon-item
    width 100%
    background-color #fff
    padding 0.75rem
    box-sizing border-box
    margin-bottom 0.75rem
    border-radius 0.5rem
    .coupon-info
      font-size: 0.94rem;
      color: #3d3a39;
      width: 100%;
      padding: 0 0 0.75rem 8.5rem;
      min-height: 5.16rem;
      box-sizing: border-box;
      position: relative;
      .coupon-img
        position: absolute;
        left: 0;
        top: 0;
        width: 7.75rem;
        height: 5.16rem;
        border-radius 0.25rem
      .coupon-detail
        min-height 5.16rem
        position relative
        box-sizing border-box
        .coupon-title
          line-clamp 2
          overflow hidden
          display -webkit-box
          text-overflow ellipsis
          -webkit-line-clamp 2
          -webkit-box-orient vertical
          font-size 0.94rem
          line-height 1.3
          color rgba(61,58,57,1)
        .exchange-times 
          margin-top 0.3rem
          font-size 0.69rem
          color rgba(153,153,153,1)
        .coupon-vaild-date
          position absolute
          bottom 0rem
          left 0
          font-size 0.69rem
          color rgba(61, 58, 57, 1)

    .coupon-centent
      padding-bottom 1.25rem
      box-sizing border-box
      .coupon-option
        width 100%
        display flex
        align-items center
        font-size 0.75rem
        color rgba(61,58,57,1)
        margin-bottom 0.4rem
        &:last-child
          margin-bottom 0
        .coupon-copy
          margin-left 1.45rem
          border 0.0625rem solid rgba(73, 109, 94, 1)
          border-radius 0.14rem
          color rgba(73, 109, 94, 1)
          padding 0.26rem 0.32rem
          box-sizing border-box
          outline none
          background-color #fff
          font-size 0.75rem
          line-height: 1;
        .qr-btn
          margin-left 1.45rem
          border 0.0625rem solid rgba(73, 109, 94, 1)
          border-radius 0.14rem
          color rgba(73, 109, 94, 1)
          padding 0.26rem 0.32rem
          box-sizing border-box
          outline none
          background-color #fff
          font-size 0.75rem
          line-height: 1;

    .coupon-direction-for-use
      font-size 0.6875rem
      display flex
      justify-content space-between
      align-items center
      padding-top 0.75rem
      box-sizing border-box
      border-top 0.0625rem solid rgba(238,238,238,1)
      .coupon-dfu-button
        color rgb(153,153,153)
        line-height: 1.2rem;
        .iconfont
          font-size 0.75rem
      .coupon-dfu-link
        a
          color rgba(196, 143, 73, 1)
          border 0.0625rem solid rgba(196, 143, 73, 1)
          padding 0.53rem 0.94rem
          margin-left 0.75rem
          border-radius 0.25rem
          font-size 0.81rem
        .confirmUse
          outline none
          background-color #fff
          padding 0.53rem 0.94rem
          color #999
          border 1px solid rgba(199, 199, 199, 1)
          border-radius 0.25rem
          font-size 0.81rem
    .coupon-dfu-text
      margin-top 0.5rem
      color rgb(153,153,153)
      border 1px solid rgb(230,230,230)
      padding 0.25rem 0.5rem
      font-size 0.6875rem
      line-height 1.25rem
      border-radius 5px
  .coupon-invalid-item
    .coupon-info
      .coupon-img
        opacity 0.5
      .coupon-detail
        .coupon-title
          color rgba(61,58,57,0.8)
        .exchange-times 
          color rgba(203, 203, 203, 1)
        .coupon-vaild-date
          color rgba(203, 203, 203, 1)
    .coupon-centent
      .coupon-option
        color rgba(203, 203, 203, 1)
        .coupon-copy
          border 0.0625rem solid rgba(73, 109, 94, 0.6)
          color rgba(73, 109, 94, 0.6)
        .qr-btn
          border 0.0625rem solid rgba(73, 109, 94, 0.6)
          color rgba(73, 109, 94, 0.6)
  
    .coupon-direction-for-use
      .coupon-dfu-link
        a
          color rgba(196, 143, 73, 0.6)
          border 0.0625rem solid rgba(196, 143, 73, 0.6)
    .coupon-dfu-text
      margin-top 0.5rem
      color rgb(153,153,153,0.8)
      border 1px solid rgb(230,230,230,0.8)
      padding 0.25rem 0.5rem
      font-size 0.6875rem
      line-height 1.25rem
      border-radius 5px
</style>

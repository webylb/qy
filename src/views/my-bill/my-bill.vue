<template>
  <div class="my-bill">
    <scroll ref="billScroll" class="bill-scroll">
      <div>
        <div v-if="!loaded && listData" class="bill-wrap">
          <div class="bill-info">
            <div class="bill-top-item bill-shop">
              <div class="title">剁手<img src="./images/eyes.png" alt=""></div>
              <div class="des"><span>{{ totalRecord }}</span>次特权商品</div>
            </div>
            <div class="bill-top-item bill-save">
              <div class="title">为您节省<img src="./images/eyes.png" alt=""></div>
              <div class="des"><span>{{ sumMyDiscountCount }}</span>元</div>
            </div>
          </div>
          <div class="bill-detail">
            <div class="top-img"></div>
            <div class="center-info">
              <div class="title">
                <img class="left-label" src="./images/bill-text-left.png" alt="">
                <div class="cont">这些宝贝都是您购买过的记录</div>
                <img class="right-label" src="./images/bill-text-right.png" alt="">
              </div>
              <div class="time-option">
                <span>日期：{{ startTime || '开始时间' }} ~ {{ endTime || '结束时间'}}</span>
                <button type="button" @click="showPopup">时间筛选 <img src="./images/btm.png" alt=""> </button>
              </div>
              <div class="shop-list">
                <van-list
                  v-model="loading"
                  :finished="finished"
                  finished-text="没有更多了~"
                  @load="onLoad"
                  :offset="offsetVal"
                  :immediate-check="checkStatus"
                >
                  <div class="data-item border-bottom" v-for="(item,index) in listData" :key="index">
                    <div class="left-des">
                      <div class="item-title">{{item.skuName}}</div>
                      <div class="item-time">{{ timeFormat(item.createTime) }}</div>
                    </div>
                    <div class="right-price">
                      <div class="text">节省<span class="num">{{ item.totalDiscountPrice || 0 }}</span>元</div>
                    </div>
                  </div>
                </van-list>
                <div class="total" v-if="listData && listData.length > 0">
                  <div>合计</div>
                  <div>已省<span>{{ sumMyDiscountCount || 0 }}</span>元</div>
                </div>
              </div>
              <div class="btm-img">
                <!-- <img src="./images/btm-img.png" alt=""> -->
              </div>
            </div>
          </div>   
        </div> 
        <div v-if="!loaded && !listData">
          <div class="no-vip">
            <img src="./images/no-vip.png" alt="">
            <p>您暂未开通会员，还未享有此权益~</p>
            <button type="button" @click="goOpenMember">开通会员</button>
          </div>
        </div>
        <loading v-if="loaded" style="padding-top: 50%"></loading>
      </div>
    </scroll>
    <van-popup v-model="isShowPopup" position="bottom">
      <div class="date-title">时间筛选</div>
      <div class="field-wrap">
        <van-field class="border" :class="[timeType == 'start' ? 'activeField' : '']"
          v-model="startTime"
          type="text"
          placeholder="请选择开始时间"
          @click="clickStartTime"
          readonly
          left-icon="underway-o"
        >
        </van-field>
        <div class="line">
          ~
        </div>
        <van-field class="border" :class="[timeType == 'end' ? 'activeField' : '']"
          v-model="endTime"
          type="text"
          placeholder="请选择结束时间"
          @click="clickEndTime"
          readonly
          left-icon="underway-o"
        >
        </van-field>
      </div>
      <van-datetime-picker
            v-model="currentDate"
            type="date"
            :show-toolbar=false
            @change="getDateVal"
            :max-date="maxDate"
          />
      <div class="btm-option"> 
        <div class="reset" @click="onReset">重置</div>
        <div class="confirm" @click="onConfirm">确定</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import { Button, DatetimePicker, Popup , Field, List } from 'vant';
  import Scroll from '../../base/scroll/scroll'
  import Loading from '../../base/loading/loading'
  import * as core from '../../api/myBill'
  import tool from '../../common/js/util'

  export default {
    name: "myCenter",
    components: {
      Scroll,
      Loading,
      [Button.name]: Button,
      [DatetimePicker.name]: DatetimePicker,
      [Popup.name]: Popup,
      [Field.name]: Field,
      [List.name]: List
    },
    data() {
      return {
        merchantId: window.infoData.merchantId || '',
        loaded: true,
        isShowPopup: false,
        timeType: null,
        startTime: null,
        endTime: null,
        currentDate: new Date(),
        maxDate: new Date(),
        pageSize: 10,
        pageIndex: 1,
        loading: false,
        finished: false,
        offsetVal: 1,
        checkStatus: false,
        listData: [],
        totalRecord: 0,
        sumMyDiscountCount: 0
      }
    },
    watch: {
      startTime(newVal,oldVal){
        if(this.endTime){
          if(newVal > this.endTime){
            this.endTime = null
          }
        }
      },
      endTime(newVal,oldVal){
        console.log(this.startTime)
        if(this.startTime){
          if(newVal < this.startTime){
            this.$toast('结束时间不能小于开始时间')
            this.endTime = null
          }
        }else{
          if(newVal){
            this.endTime = null
            this.$toast('请先选择开始时间')
          }
        }
      },
    },
    created() {
      document.title = this.$route.meta.title
      this.getDiscountsInfo({pageIndex:this.pageIndex,pageSize: this.pageSize})
    },
    mounted() {

    },
    methods: {
      onLoad() {
        let data = {pageIndex:this.pageIndex,pageSize: this.pageSize}
        if(this.startTime){
          data.startTime = this.startTime
        }
        if(this.endTime){
          data.endTime = this.endTime
        }
        this.getDiscountsInfo(data)
      },
      showPopup(){
        this.isShowPopup = true
        this.timeType = null
        this.startTime = null
        this.endTime = null
      },
      clickStartTime(){
        this.timeType = 'start'
        this.showDate = true
        this.startTime = null
      },
      clickEndTime(){
        this.timeType = 'end'
        this.showDate = true
        this.endTime = null
      },
      getDateVal(ele){
        let date = ele.getValues()
        //console.log(date)
        if(!this.timeType){
          this.timeType = 'start'
          this.startTime = tool.formatDate(new Date(date[0], date[1] - 1, date[2]).getTime(), 'YYYY-MM-DD')
        }else{
          if(this.timeType == 'start'){
            this.startTime = tool.formatDate(new Date(date[0], date[1] - 1, date[2]).getTime(), 'YYYY-MM-DD')
          }else{
            this.timeType = 'end'
            this.endTime = tool.formatDate(new Date(date[0], date[1] - 1, date[2]).getTime(), 'YYYY-MM-DD')
          }
        }
      },
      onReset(){
        this.timeType = null
        this.startTime = null
        this.endTime = null
      },
      onConfirm() {
        let data = {pageIndex:1 ,pageSize: this.pageSize}
        if(this.startTime){
          data.startTime = this.startTime
        }
        if(this.endTime){
          data.endTime = this.endTime
        }
        this.getDiscountsInfo(data, 'close')
      },
      getDiscountsInfo(opts,isShow){
        core.getDiscountsInfo(opts).then(res => {
          // console.log(res)
          if (res.code && res.code == '00') {
            if(res.result.page.data && isShow){
              this.listData = []
              this.listData = this.listData.concat(res.result.page.data)
            }else{
              this.listData = this.listData.concat(res.result.page.data)
            }
            this.totalRecord = res.result.page.totalRecord 
            this.sumMyDiscountCount = res.result.sumMyDiscountCount || 0
            this.loading = false
            this.pageIndex = opts.pageIndex + 1
            if(this.listData.length >= this.totalRecord){
              this.finished = true;
            }
            this.loaded = false
            if(isShow == 'close'){
              this.timeType = null
              this.isShowPopup = false
            }
          }else{
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(error => {
          this.loaded = false
          this.$toastBox.showToastBox(error)
        })
      },
      timeFormat(val){
        return tool.formatDate(val,'Y/M/DH')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .my-bill
    .bill-scroll
      position fixed
      top 0
      left 0
      right 0
      bottom 0
      max-width 750PX
      // margin 0 auto
      z-index 10
      background rgba(255, 255, 255, 1)
      .bill-wrap
        background rgba(239, 205, 172, 1)
      .bill-info
        width 100%
        min-height 17.13rem
        background url('./images/bill-top-bg.png') no-repeat center
        background-size 100% 100%
        color rgba(255,255,255,1)
        .bill-top-item
          padding 0 0.75rem 
          .title
            display flex
            justify-content flex-start
            align-items center
            font-size 0.94rem
            img 
              width 1.13rem
              height 0.94rem
              margin-left 0.63rem
          .des
            margin-top 1rem
            display flex
            justify-content flex-start
            align-items flex-end
            font-size 1rem
            span 
              font-size 1.88rem
              font-family 'DIN-BOLD'
        .bill-shop
          padding-top 5.27rem
        .bill-save
          padding-top 1.3rem

      .bill-detail
        width 21.9375rem
        margin 0 auto  
        position relative
        padding 0 0.5rem
        box-sizing border-box
        min-height 65vh
        .top-img
          width 21.9375rem
          height 1rem
          position absolute
          left 50%
          top -0.5rem
          background-color rgba(47,73,62,1);
          border-radius 0.5rem
          transform translateX(-50%)
        .center-info
          position absolute
          left 50%
          transform translateX(-50%)
          top 0
          width 20.9375rem
          background #fff
          min-height 2rem
          padding 0 0.75rem
          box-sizing border-box
          padding-top 1.4375rem
          box-shadow:inset 0px 0.6rem 0.6rem -0.6rem rgba(32, 52, 43, 1);
          .title
            display flex
            justify-content center
            height 2rem
            margin 0 -0.35rem
            .left-label
              align-self flex-end
              width 1.31rem
              height 1.34rem
            .cont
              align-self center 
              font-size 1.1rem
              color rgba(61,58,57,1)
              margin 0 0.66rem
            .right-label
              align-self flex-start
              width 1.34rem
              height 1.38rem
        .time-option
          display flex
          justify-content space-between
          align-items center
          padding 1rem 0 0.5rem
          box-sizing border-box
          span 
            font-size:0.75rem;
            color:rgba(153,153,153,1);
            line-height: 1.5rem;
          button
            width:5rem;
            height:1.5rem;
            line-height 1
            background:rgba(73,109,94,1);
            border-radius 0.25rem
            padding 0 
            font-size 0.81rem
            color rgba(255,255,255,1)
            outline none 
            border none
            img  
              width 0.63rem
              height 0.31rem
        .shop-list
          .data-item
            display flex
            justify-content space-between
            align-items flex-start
            padding 1rem 0 0.5rem 0
            .left-des
              max-width 14rem
              overflow hidden
              text-overflow ellipsis
              white-space nowrap
              .item-title
                font-size:0.94rem;
                color:rgba(61,58,57,1);
                padding 0.2rem 0 0.63rem 0
              .item-time
                font-size:0.75rem;
                color:rgba(153,153,153,1);
            .right-price
              font-size:0.94rem;
              color:rgba(61,58,57,1);
              .num
                font-size 1.25rem
                color rgba(223, 156, 75, 1)
                font-family 'DIN-BOLD'
        .total
          display flex
          justify-content space-between
          align-items flex-start
          padding 2.25rem 0 2rem 0
          div
            font-size:0.94rem;
            color:rgba(61,58,57,1);
            span 
              font-size 1.25rem
              color rgba(226, 58, 55, 1)
              font-family 'DIN-BOLD'
        .btm-img
          background url('./images/btm-img.png') no-repeat center
          background-size 109% 100%
          height 0.25rem
          width 20.9375rem
          margin 0 -0.75rem
          position absolute
          // font-size 0
          // img  
          //   width 100%
          //   height auto
      .no-vip
        position fixed
        left 0
        top 0
        right 0
        bottom 0
        background-color #fff
        width 100%
        max-width 750PX
        padding-top 7.5rem
        text-align center
        img 
          width 7.5rem
          height 7.5rem
        p 
          margin 0 auto 
          margin-top 1.5rem
          font-size 1rem
          color rgba(153,153,153,1)
        button
          outline none 
          border none
          padding 0
          width:6.19rem;
          height:2.25rem;
          line-height: 2.25rem;
          background:rgba(196,143,73,1);
          border-radius:0.25rem;
          font-size 1.13rem;
          color #fff
          margin-top 1.4rem
.btm-option
  height 3rem
  display flex
  justify-content flex-start
  align-items center
  text-align center
  line-height 3rem
  .reset
    height 100% 
    flex 1
    background:rgba(61,58,57,1);
    font-size:1.13rem;
    color:rgba(255,255,255,1);
  .confirm
    height 100% 
    flex 1
    background:rgba(196,143,73,1);
    font-size:1.13rem;
    color:rgba(255,255,255,1);

.date-title
  font-size:0.88rem;
  color:rgba(61,58,57,1);
  padding 1.7rem 0.75rem 0.75rem
  box-sizing border-box

.field-wrap {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding 0 0.75rem
  padding-bottom 0.5rem
  .van-field {
    width: 8.56rem;
    height: 2.5rem;
    line-height 2.5rem;
    padding 0 0.5rem;
    border-radius: 0.25rem
    font-size:0.88rem;
  }
  .activeField {
    &::after {
      border-color: rgba(196, 143, 73, 1)!important;
    }
  }
  .line {
    color: rgba(194,194,194,1);
    margin: 0 0.8rem;
  }
}

 .my-bill /deep/ .van-field__left-icon {
   color rgba(196, 143, 73, 1)
 }
</style>

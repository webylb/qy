<template>
  <div style="padding: 0 0 0.75rem 0;">
    <div class="center-header">
      <div class="center-wrap">
        <div class="userInfo">
          <div  class="name-wrap">
            <div v-if="isLogin && vipInfo.userName" class="name">{{ vipInfo.userName }}</div>
            <div v-else class="name">嗨, 等你好久了!</div>
          </div>
          <div class="btn-wrap">
            <button type="button" v-if="!isLogin" class="login-btn" @click="goLogin">马上登录</button>
            <div v-else class="vip-cent">
              <button type="button" v-if="!isMember" class="default-member">普通会员</button>
              <div v-else>
                <button type="button" class="vip-member" @click="showVipInfo">
                  <span>{{ vipInfo.vipType }}</span>
                  <img src="./images/w-right.png" alt="">
                  <!-- <i class="iconfont">&#xe611;</i> -->
                  <div class="vip-info" v-show="maskShow" @click.stop>
                      <div class="title">我的会员</div>
                      <div class="vip-list">
                        <div class="vip-item" v-for="(item, index) in vipTypeList" :key="index">
                          <div class="vip-cont">
                            <div class="vip-detail">
                              <div class="vip-num">
                                <span class="num">{{ index + 1 }}</span>
                              </div>
                              <div class="name">{{ item.libraryName }}</div>
                            </div>
                            <button type="button" v-if="item.sTime" @click="unlockMember">立即续费</button>
                            <button type="button" v-else @click="unlockMember">立即开通</button>
                          </div>
                          <div class="times" v-if="item.sTime">有效期{{ item.sTime }}至{{ item.eTime }}</div>
                        </div>
                      </div>
                  </div>
                </button>
                <div class="time">有效期{{ vipInfo.startTime }}至{{ vipInfo.expireTime }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="avatar" @click="goUserInfo">
          <img class="avatar_img" v-if="!vipInfo.headImage" src="./images/default_avatar.png" alt="default_avatar">
          <img class="avatar_img" v-else :src="vipInfo.headImage" alt="avatar">
          <img v-if="isLogin" class="avatar_right_img" src="./images/user-right.png" alt="">
        </div>
      </div>
      <div v-if="isLogin" class="member-info" @click="unlockMember">
        <div class="left">
          <img src="./images/power.png" alt="">
          <span v-if="!isMember">开通会员解锁更多权益</span>
          <span v-else>已开通{{ vipInfo.vipType }}</span>
        </div>
        <button type="button" class="renew-member">
          <span v-if="!isMember">立即开通</span>
          <span v-else>立即续费</span>
          <img src="./images/b-right.png" alt="">
          <!-- <i class="iconfont">&#xe611;</i> -->
        </button>
      </div>  
    </div>
    <div class="mask" v-show="maskShow" @click="showVipInfo"></div>
  </div>
</template>

<script>
  import tool from '../../common/js/util'
  export default {
    data() {
      return {
        userAvatar: null,
        maskShow: false
      }
    },
    props: {
      merchantId: {
        type: Number,
        default: 0
      },
      isMember: {
        type: Boolean,
        default: false
      },
      isLogin: {
        type: Boolean,
        default: false
      },
      vipInfo: {
        type: Object,
        default: {}
      },
      vipTypeList: {
        type: Array
      }
    },
    mounted() {

    },
    activated(){

    },
    beforeUpdate() {

    },
    methods: {
      formatDate(val){
        if(val){
          return tool.formatDate(val)
        }
      },
      onLoaded(){
        this.$emit('onLoaded')
      },
      unlockMember(){
        this.$emit('unlockMember')
      },
      goLogin(){
        this.$emit('goLogin')
      },
      showVipInfo(){
        this.maskShow = !this.maskShow
      },
      goUserInfo() {
        if(this.isLogin){
          this.$router.push('/userInfo')
        }else{
           this.$emit('goLogin')
        }
      }
    },
    destroyed() {

    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.center-header 
  width 100%;
  min-height:9.06rem;
  background:rgba(250,234,214,1);
  padding 2.47rem 0.75rem 0
  box-sizing border-box
  .center-wrap
    display flex
    justify-content space-between
    align-items flex-start
    .userInfo 
      .name-wrap 
        color rgba(61,58,57,1)
        font-size 1.38rem
        .name 
          padding-left 0.19rem
          font-weight bold
      .btn-wrap 
        .login-btn 
          width 6rem
          height 2rem
          outline none
          border none
          background-color rgba(61,58,57,1)
          color #ffffff
          font-size 1rem
          padding 0
          margin-top 1.09rem
        .vip-cent
          .default-member 
            outline none
            border 0
            width 9rem
            height 3rem
            line-height 3rem
            background rgba(196,143,73,1)
            border-radius 2rem
            font-size 1.62rem
            padding 0
            color #fff
            margin-top 1rem
            transform scale(0.5)
            transform-origin left top
          .vip-member 
            outline none
            border 0
            // width 5.25rem
            // height 1.5rem
            // line-height 1.5rem
            background rgba(196,143,73,1)
            border-radius 1rem
            font-size 0.81rem
            padding 0.36rem 0.66rem
            color #fff
            margin-top 1rem
            display: flex;
            align-items: center;
            position relative
            i 
              font-size 0.8rem
              margin-left 0.1rem
            img   
              width 0.31rem
              height 0.63rem
              margin-left 0.3rem
            .vip-info
              position absolute
              z-index 100
              right -16.7rem
              top -2rem
              width:15.88rem;
              .title
                width 100%
                height:2rem;
                line-height: 2rem;
                background:rgba(73,109,94,1);
                border-radius:0.5rem 0.5rem 0rem 0rem;
                font-size:1rem;
              .vip-list
                width 100%
                min-height: 8rem;
                background:rgba(255,255,255,1);
                box-shadow: 0rem 0.2rem 0.2rem 0rem rgba(215,215,215,1);
                border-radius:0rem 0rem 0.5rem 0.5rem;
                position relative
                padding-top 0.75rem
                padding-bottom 1.02rem
                box-sizing border-box
                &::after
                  content ''
                  position absolute
                  left -0.74rem
                  top 0.32rem
                  width 0
                  border 0.37rem solid transparent 
                  border-right 0.37rem solid rgba(255,255,255,1)
                .vip-item
                  margin-bottom 1.2rem
                  padding 0 1rem
                  box-sizing border-box
                  &:last-child 
                    margin-bottom 0
                  .vip-cont
                    display flex
                    justify-content space-between
                    align-items center
                    .vip-detail
                      overflow hidden
                      display flex
                      justify-content flex-start
                      align-items center
                      .vip-num
                        width 1.06rem
                        margin-right 0.47rem
                        span  
                          display block
                          width:1.06rem;
                          height:1.06rem;
                          background:rgba(73,109,94,1);
                          border-radius:50%;
                          color #ffffff
                          font-size:0.81rem;
                          line-height: 1.08rem;
                      .name
                        font-weight: bold;
                        color: rgba(196,143,73,1);
                        font-size: 0.88rem;
                        line-height: 1.2;
                        text-align left 
                        width 8rem
                        overflow hidden
                        text-overflow ellipsis
                        white-space nowrap
                    button 
                      outline none 
                      border none
                      padding 0.3rem 0.42rem 0.24rem
                      background: rgba(196,143,73,1);
                      border-radius: 1rem;
                      color: #ffffff;
                      font-size: 0.75rem;
                      line-height 1
                  .times
                    color:rgba(153,153,153,1);
                    font-size:0.69rem;
                    text-align left 
                    margin-top 0.38rem
                    margin-left 1.53rem
                    line-height 1

          .time
            margin-top 0.7rem
            color rgba(196,143,73,1)
            font-size 0.69rem
            
    .avatar 
      display flex
      justify-content flex-start
      align-items center
      .avatar_img 
        width 5rem
        height 5rem
        border-radius 50%
      .avatar_right_img
        width 0.45rem
        height 0.75rem
        margin-left 0.75rem
  
  .member-info
    width: 100%;
    height: 2.75rem;
    background:rgba(61,58,57,1);
    border-radius: 0.5rem 0.5rem 0rem 0rem; 
    margin-top 1.88rem
    padding 0 1rem 0 0.88rem
    box-sizing border-box
    display flex
    align-items center
    justify-content space-between
    .left 
      img 
        width 0.94rem 
        height 0.94rem
      span 
        color rgba(251,212,177,1)
        font-size 0.88rem
        margin-left 0.22rem
    .renew-member 
      outline none
      border 0
      background linear-gradient(0deg,rgba(251,216,184,1) 0%,rgba(252,208,169,1) 100%)
      border-radius 1rem
      padding 0.26rem 0.55rem
      color rgba(61,58,57,1)
      display flex
      align-items center
      justify-content center
      span 
        font-size 0.75rem
      img   
        width 0.31rem
        height 0.63rem
        margin-left 0.3rem
        margin-top 0.08rem
  
.mask
  position fixed
  width 100vw
  height 100vh
  background transparent
  top 0
  left 0
  max-width 750PX
  z-index 10
</style>


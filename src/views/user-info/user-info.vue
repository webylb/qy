<template>
  <div class="user-info">
    <scroll ref="centerScroll" class="center-scroll">
      <div>
        <div v-if="!loaded" class="main-wrapper">
          <div class="wrap">
            <div class="cell border-bottom user-img">
              <div class="left">
                用户头像
              </div>
              <div class="right">
                <img class="avatar_img" v-if="!headImage" src="./images/default_avatar.png" alt="default_avatar">
                <img v-else :src="headImage" alt="">
              </div>
            </div>
            <div class="cell border-bottom">
              <div class="left">
                用户名
              </div>
              <div class="right">
                {{ userName }}
              </div>
            </div>
            <div class="cell">
              <div class="left">
                用户ID
              </div>
              <div class="right">
                {{ userId }}
              </div>
            </div>
          </div>
          <div class="wrap">
            <div class="cell login-out" @click="logOut">
              <div>退出登录</div>
            </div>
          </div>
        </div>
        <loading v-else style="padding-top: 50%"></loading>
      </div>
    </scroll>
    <popup v-show="isLogOut" @cancel="cancel" @confirm="confirm">
      <p style="padding:2.5rem 0.8rem 3rem; font-size: 1rem; color: #333333; line-height: 1.2;">
        确认退出登录?
      </p>
    </popup>
  </div>
</template>

<script>
  import Scroll from '../../base/scroll/scroll'
  import Loading from '../../base/loading/loading'
  import Popup from '../../base/popup/popup';
  import * as core from '../../api/member'
  import tool from '../../common/js/util'

  export default {
    name: "userInfo",
    components: {
      Scroll,
      Loading,
      Popup
    },
    data() {
      return {
        merchantId: window.infoData.merchantId || '',
        isMember: true,
        loaded: true,
        isLogin: false,
        userId: "--",
        userName: "--",
        headImage: null,
        isLogOut: false
      }
    },
    created() {
      this.getMemberInfo({merchantId: this.merchantId}) 
    },
    methods: {
      getMemberInfo(opts) {
        core.memberInfo(opts).then(res => {
          if (res.code && '00' === res.code) {
            if(res.result){
              if(!res.result.id){
                this.getLoginUrl()
              } 
              this.userId = res.result.id
              this.userName = res.result.nickname
              this.headImage = res.result.headImage
            }
            this.loaded = false
          } else {
            this.loaded = false
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(e => {
          this.loaded = false
          this.$toastBox.showToastBox(e)
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
      logOut(){
        this.isLogOut = true
      },
      cancel(){
        this.isLogOut = false
      },
      confirm(){
        core.subLogOut().then(res => {
          if (res.code && '00' === res.code) {
            // this.$toastBox.showToastBox(res.message)
            this.$router.push('/')
          } else {
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(e => {
          this.$toastBox.showToastBox(e)
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .user-info
    .center-scroll
      position fixed
      top 0
      left 0
      right 0
      bottom 0
      max-width 750PX
      // margin 0 auto
      z-index 10
      background rgba(245,245,245,1)
      .wrap
        background-color rgba(255, 255, 255, 1)
        margin-bottom 0.75rem
        .cell
          padding 0 0.75rem 
          box-sizing border-box
          display flex
          justify-content space-between
          align-items center
          height 3rem
          .left 
            font-size:1rem;
            color:rgba(61,58,57,1);
          .right 
            font-size:1rem;
            color:rgba(153,153,153,1)
            img 
              width:2.5rem;
              height:2.5rem;
              border-radius:50%;
        .user-img
          height 3.75rem
        .login-out
          justify-content center
          color:rgba(226,58,55,1);

</style>

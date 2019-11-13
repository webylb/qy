<template>
  <div class="login home-page" ref="homePage">
    <shop-header ref="shopHeader" v-if="showHeader" style="position: absolute;top:0;left: 0;z-index: 999" line-style="background:#fff" :title="title"></shop-header>
    <div :style="loginStyle" class="login-Content" ref="loginContent" v-show="!showLoad">
      <div class="login-detail">
        <h1 class="login-title">手机验证码登录</h1>
        <div class="login-form">
          <div class="login-form-item">
            <div class="input-wrap">
              <!-- <i class="iconfont left-icon">&#xe615;</i> -->
              <img class="left-icon" src="./images/phone.png" alt="">
              <input type="number" v-model="phone" ref="phone"  @click="focusInput"  @blur="scrollToTop($event,'phone')" placeholder="请输入手机号" v-on:keyup="check_count($event,'phone')" maxlength="11" />
              <i class="iconfont right-icon" v-show="showPhoneClose" @click.stop="clearVal('phone')">&#xe641;</i>
            </div>
          </div>
          <div class="login-form-item">
              <div class="input-wrap">
                <!-- <i class="iconfont left-icon">&#xe61e;</i> -->
                <img class="left-icon" src="./images/pwd.png" alt="">
                <input type="number" v-model="code" ref="code" @click="focusInput"  @blur="scrollToTop($event,'code')" placeholder="请输入验证码" v-on:keyup="check_count($event,'code')" maxlength="6" @input="changeSize()" />
                <i class="iconfont right-icon" v-show="showCodeClose" @click.stop="clearVal('code')">&#xe641;</i>
              </div>
              <div class="input-btn">
                <button type="button" @click="getCode">{{ btnText }}</button>
              </div>
          </div>

          <div class="sub-wrap">
            <button type="button" @click="subLogin" :class="[classActive ? 'sub-active' : '']">登录</button>
          </div>
        </div>

      </div>
      <p class="customer-service">
        客服电话: <a href="tel:4006680091">4006680091</a>
      </p>
    </div>
    <loading v-show="showLoad" style="padding-top: 50%"></loading>
  </div>
</template>

<script>
  import BScroll  from 'better-scroll'
  import ShopHeader from '../../base/shop-header/shop-header'
  import Loading from '../../base/loading/loading'
  import * as core from '../../api/login'
  import tool from '../../common/js/util'
  import wxShareMixin from '../../common/js/wxShareMixin'

  export default {
    components: {
      ShopHeader,
      Loading
    },
    mixins:[wxShareMixin],
    data () {
      return {
        merchantName: window.infoData.merchantName,
        merchantId: window.infoData.merchantId,
        loadingTitle: '加载中...',
        showLoad: true,
        showHeader: false,
        title: "",
        loginStyle: "",
        phone: '',
        code: '',
        btnText: "获取验证码",
        showPhoneClose: false,
        showCodeClose: false,
        classActive: false,
        shareUrl: location.href.split('#')[0],
        shareLink:  window.location.href.split("#")[0]+'#'+window.location.href.split("#")[1],  //分享出去的链接
        shareTitle: '',  //分享的标题
        shareDesc: '', //分享的详情介绍
        shareImgUrl: '',
        times: 60,
        timer: null,
        pengding: true,
        referer: ''
      }
    },
    created () {
      document.title = this.$route.meta.title
      //判断是否为微信
      let ua = navigator.userAgent.toLowerCase();
      let isWeixin = ua.indexOf('micromessenger') != -1;
      if (!isWeixin) {
        this.showHeader = true
        this.loginStyle = "top:2.75rem"
         this.title = this.$route.meta.title
      } else {
        this.showHeader=false
        this.loginStyle = "top:0rem"
      }
      this.showLoad = false
    },
    mounted(){
      this.getReferer()
    },
    watch: {
      phone(newVal){
        if(this.code && this.phone){
          this.classActive = true
        }else{
          this.classActive = false
        }
      },
      code(newVal){
        if(this.code && this.phone){
          this.classActive = true
        }else{
          this.classActive = false
        }
      }
    },
    methods: {
      getReferer(){
        var url = window.location.href;
        var reg=/referer=(.*?)/gi;
        if(reg.test(url)){
          //let data = this.$route.query.referer
          let data = window.location.href.split("referer=")[1]
          this.referer = data
        }else{
           this.referer = ''
        }
      },
      focusInput(e){
        e.target.focus()
        let hrt = this.$refs.loginContent.offsetHeight
        this.$refs.loginContent.style.height = hrt + 'px'
      },
      scrollToTop(event,type){
        window.scrollBy(0,5)
      },
      check_count(event,type) {
        let value = event.target.value;
        if(value.length > 1){
          if(type == 'phone'){
            this.showPhoneClose = true
            this.showCodeClose = false
          }else{
            this.showPhoneClose = false
            this.showCodeClose = true
          }
        }else{
          if(type == 'phone'){
            this.showPhoneClose = false
          }else{
            this.showCodeClose = false
          }
        }
      },
      clearVal(type){
        if(type == 'phone'){
          this.phone = ''
          this.showPhoneClose = false
        }else{
          this.code = ''
          this.showCodeClose = false
        }
      },
      changeSize(){
        // 要做长度判断
        if (this.$refs.code.value.length > 6) {
          this.$refs.code.value = this.$refs.code.value.slice(0, 6)
          this.code = this.$refs.code.value
        }
      },
      getCode(){
        if(this.phone){
          if (!/^1\d{10}$/.test(this.phone)) {
            this.$toastBox.showToastBox('请输入正确的手机号')
            return false
          }
        }else{
          this.$toastBox.showToastBox('请先输入手机号')
          return false
        }
        if(this.pengding){
          this.pengding = false
          this.times = 60
          this.timer = setInterval(() => {
              this.times--;
              this.btnText = this.times + "s"
              if(this.times == 1){
                clearInterval(this.timer)
                this.btnText = "重新获取"
                this.pengding = true
              }
          }, 1000)
          core.getLoginCode({mobile: this.phone,merchantId: this.merchantId}).then(res => {
            //console.log(res)
            if(res.code && '00' == res.code){
              //console.log(res)
            } else {
              this.pengding = true
              this.$toastBox.showToastBox(res.message)
              clearInterval(this.timer)
              this.btnText = "重新获取"
              window.scrollBy(0,5)
            }
          }).catch(err=>{
            this.pengding = true
            this.$toastBox.showToastBox("网络错误")
            clearInterval(this.timer)
            this.btnText = "重新获取"
          })
        }else{
          this.$toastBox.showToastBox("拼命请求中,请稍后...")
        }
      },
      subLogin(){
        if(this.phone){
          if (!/^1\d{10}$/.test(this.phone)) {
            this.$toastBox.showToastBox('请输入正确的手机号')
            return false
          }
        }else{
          this.$toastBox.showToastBox('请先输入手机号')
          return false
        }
        if(this.code){
          if(!/^\d{4,6}$/.test(this.code)) {
            this.$toastBox.showToastBox('请输入4-6位数字验证码')
            return false
          }
        }else{
          this.$toastBox.showToastBox('请先输入验证码')
          return false
        }
        if(this.classActive){
          core.subLoginData({
            mobile: this.phone,
            smsCode: this.code,
            merchantId: this.merchantId,
            referer: this.referer
          }).then(res => {
            //console.log(res)
            if(res.code && '00' == res.code){
              window.location.href = res.result
            } else {
              this.$toastBox.showToastBox(res.message)
            }
          }).catch(err=>{
            this.$toastBox.showToastBox("网络错误")
          })
        }else{
          this.$toastBox.showToastBox("输入错误")
        }
      },
      _initScroll () {
        // 创建分类列表的Scroll对象
        this.$nextTick(()=>{
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.loginContent,{
              probeType: 3,
              startY: 0,
              bounce: false,
              click: true
            })
          }else{
            this.scroll.refresh()
          }
        })
      }
    }
  }
</script>


<style lang="stylus" rel="stylesheet/stylus" scoped>
  .login
    background-color #fff
    .login-Content
      position fixed
      left 0
      top 0
      right 0
      bottom 0
      width 100%
      max-width 750PX
      background-color #fff

      .login-detail
        padding 0 1.438rem
        .login-title
          font-size 1.375rem
          color rgba(61, 58, 57, 1)
          margin 3.656rem 0 4.375rem
        .login-form
          .login-form-item
            display flex
            justify-content flex-start
            border-bottom solid 0.031rem rgba(238, 238, 238, 1)
            height 3rem
            box-sizing border-box
            margin-bottom 0.125rem
            padding-bottom 0.125rem
            .input-wrap
              flex 1
              position relative
              input
                height 100%
                width 100%
                text-indent 1.844rem
                outline none
                border none
                font-size 0.938rem
                flex 1
              .left-icon
                display block
                position absolute
                left 0
                top 50%
                transform translateY(-50%)
                width 1.25rem
                height 1.25rem
              .right-icon
                display block
                position absolute
                right 0
                top 50%
                transform translateY(-50%)
                font-size 1rem
                color #dddddd
                z-index 10
                cursor pointer
                &:before
                  content ''
                  position absolute
                  top -10px
                  left -10px
                  right -10px
                  bottom -10px

            .input-btn
              width 5rem
              position relative
              margin-left 1rem
              padding-left 0.9rem
              &::before
                content ''
                position absolute
                left 0
                top 50%
                transform translateY(-50%)
                height 1.219rem
                width 0.08rem
                background-color #f9e6e6
                // background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(221,221,221,1) 50%, rgba(255,255,255,0) 100%);
              button
                font-size 0.813rem
                min-width 4rem
                height 100%
                outline none
                border none
                background transparent
                text-align center
                padding 0
                margin 0
                color rgba(196, 143, 73, 1)

          .sub-wrap
            width 100%
            margin-top 2.969rem
            button
              width 100%
              height 2.75rem
              font-size 1.125rem
              border-radius 0.5rem
              color #fff
              outline none
              border none
              background-color rgba(221,221,221,1)
            .sub-active
              background-color rgba(61, 58, 57, 1)

  .customer-service
    position absolute
    bottom 1.25rem
    left 50%
    transform translateX(-50%)
    width 9.1rem
    font-size 0.75rem
    line-height 1.375rem
    letter-spacing 0rem
    color #999999
    text-align center
    &::before
      content ''
      position absolute
      left -2.6rem
      top 50%
      transform translateY(-50%) scaleY(0.5)
      height 1px
      background #999999
      width 2.6rem
    &::after
      content ''
      position absolute
      right -2.6rem
      top 50%
      transform translateY(-50%) scaleY(0.5)
      height 1px
      background #999999
      width 2.6rem
// 改变placeholder
::-webkit-input-placeholder { /* WebKit, Blink, Edge */
  color:  #c2c2c2;
  //line-height: 1.2
  font-size 0.8rem
}
:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
  color: #c2c2c2;
  //line-height: 1.2
  font-size 0.8rem
}
::-moz-placeholder { /* Mozilla Firefox 19+ */
  color:  #c2c2c2;
  //line-height: 1.2
  font-size 0.8rem
}
:-ms-input-placeholder { /* Internet Explorer 10-11 */
  color:  #c2c2c2;
  //line-height: 1.2
  font-size 0.8rem
}

@-webkit-keyframes fadeIn {
    from {
      opacity: 0.5
    }
    to {
      opacity: 1
    }
}

@keyframes fadeIn {
    from {
        opacity: 0.5
    }
    to {
        opacity: 1
    }
}
</style>

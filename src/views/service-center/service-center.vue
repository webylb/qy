<template>
  <div class="service-center home-page" ref="homePage">
    <shop-header ref="shopHeader" v-if="showHeader" style="position: absolute;top:0;left: 0;z-index: 999" line-style="background:#fff" title="服务中心"></shop-header>

    <div :style="serviceCenterStyle" class="serviceCenterContent" v-show="!showLoad">
      <div class="all-service" >
        <div class="menu-wrapper" ref="menuWrapper">
          <ul class="menu-content" ref="menuContent">
            <li class="menu-item" ref="menuItem" v-for="(service, index) in serviceMenuList" :key="index"
              :class="[ index===currentIndex  ? 'click-item' : 'noClick-item']"
              @click="clickMenuItem(index, $event)">
              <span class="text">
                {{service.name}}
              </span>
            </li>
          </ul>
          <div class="meun-bottom" style="position:absolute;" ref="menuBottom">
            <ul class="menu-bottom-content" ref="menuBottomContent">
              <li class="menu-item" ref="menuItem" v-for="(service, index) in serviceMenuList" :key="index"
                :class="[ index===currentIndex  ? 'check-item' : 'noCheck-item']">
                <span></span>
              </li>
            </ul>
          </div>
        </div>
        <div class="services-Wrapper" ref="servicesWrapper">
          <ul class="services-content" ref="servicesContent">
            <li class="service-list" ref="serviceList" v-for="(service, index) in serviceMenuList" :key="index">

              <div>
                <h2 v-show="index==0? false : true" class="service-title">{{ service.name }}</h2>
                <div class="service-itemWrap">
                  <div class="service-item " v-for="(item,index) in service.qyItemResultList" :key="index">
                    <div class="icon" @click="clickServieItem(item.id,item.jumpUrl,item.isDirect,$event)">
                      <img :src="item.cover" :alt="item.title">
                      <div class="service-name">{{ item.title }}</div>
                      <div class="service-des">{{ item.subTitle }}</div>
                    </div>
                  </div>
                </div>
                <div class="listLast" ref="listLast" v-if="index===serviceMenuList.length-1" :style="listLastHeight"></div>
              </div>

            </li>
          </ul>
        </div>
      </div>
    </div>
    <loading style="padding-top: 40%;" v-show="showLoad" :title="loadingTitle"></loading>
  </div>
</template>

<script>
  import BScroll  from 'better-scroll'
  import ShopHeader from '../../base/shop-header/shop-header'
  import * as core from '../../api/serviceCenter'
  import tool from '../../common/js/util'
  import wxShareMixin from '../../common/js/wxShareMixin'
  import Loading from '../../base/loading/loading'

  export default {
    components: {
      ShopHeader,
      Loading
    },
    mixins:[wxShareMixin],
    data () {
      return {
        merchantId: window.infoData.merchantId,
        showLoad: true,
        loadingTitle: '正在加载...',
        showHeader: false,
        serviceCenterStyle: "",
        servicesTopstyle:"",
        isShowBanner: false,
        serviceMenuList: [],
        tops: [],
        scrollY: 0,
        listLastHeight:'',
        shareUrl: location.href,
        shareLink:  window.location.href,  //分享出去的链接
        shareTitle: '会员特权',  //分享的标题
        shareDesc: '多达100余种会员特权，每年能帮您节省5998元，畅享世界从这里开始！', //分享的详情介绍
        shareImgUrl: 'https://c1.51jujibao.com/static/mkt/2019/05/shareImages/huiyuan.png',
        passIdList: null //要过滤掉的商品id
      }
    },
    created () {
      this.getShare()
      document.title = this.$route.meta.title
      let ua = navigator.userAgent.toLowerCase();
      let isWeixin = ua.indexOf('micromessenger') != -1;
      if (!isWeixin) {
        this.showHeader=false
        this.serviceCenterStyle = "top:0rem"
        // alert('Dragondean说这不是通过微信内置浏览器');
      } else {
        this.showHeader=false
        this.serviceCenterStyle = "top:0rem"
      }
      this.getPassId({merchantId: this.merchantId})
    },
    mounted(){

    },
    methods: {
      getPassId(opts){
        core.getPassId(opts).then(res => {
          //console.log(res)
          if (res.code && '00' === res.code) {
            if (res.result.length > 0) {
              this.passIdList = res.result
            }
            this.getServideCenterData({merchantId: this.merchantId})
          } else {
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(e => {
          this.$toastBox.showToastBox(e)
        })
      },
      getServideCenterData(opts){
        core.getServiceCenter(opts).then(res => {
          this.$nextTick(() => {
            //console.log(res)
            if(res.code && '00' == res.code){
              if(res.result){
                let data = res.result
                if (this.passIdList){
                  for(let i=0, length = data.length; i<length; i++){
                    for(let k=0, length3 = this.passIdList.length; k<length3; k++){
                      for(let j = data[i].qyItemResultList.length - 1; j>= 0; j--){
                        if(data[i].qyItemResultList[j].id == this.passIdList[k]){
                          data[i].qyItemResultList.splice(j, 1);
                        }
                      }
                    }
                  }
                }
                this.serviceMenuList = data
                this.showLoad = false
                this._initScroll()
              }
            } else {
              this.$toastBox.showToastBox(res.message)
            }
          })
        })
      },
      _initScroll () {
        // 创建分类列表的Scroll对象
        this.$nextTick(()=>{
            let width = 0
            for (let i = 0, length=this.serviceMenuList.length; i < length; i++) {
              width+=this.$refs.menuItem[0].getBoundingClientRect().width
            }
            this.$refs.menuContent.style.width = width+'px'
            this.$refs.menuBottomContent.style.width = width+'px'

            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.menuWrapper, {
                startX: 0,
                scrollX: true,
                scrollY: false,
                probeType: 3,
                click: true
              })

              this.menuBottomScroll = new BScroll(this.$refs.menuBottom, {
                startX: 0,
                scrollX: true,
                scrollY: false,
                probeType: 3,
                click: false,
                bounce: false
              })

              // 占位高度
              let length=this.serviceMenuList.length
              let lastHeight=this.$refs.serviceList[length-1].offsetHeight
              let windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight //窗口高度
              let menuHeight = this.$refs.menuWrapper.getBoundingClientRect().height
              let placeholderHeight = windowHeight - menuHeight - lastHeight + 10
              this.listLastHeight =  "height:"+ placeholderHeight + "px"

              this.servicesScroll = new BScroll(this.$refs.servicesWrapper, {
                startX: 0,
                scrollX: false,
                scrollY: true,
                probeType: 3,
                click: true
              })

              this.servicesScroll.on('scroll', (pos) => {
                this.scrollY = Math.abs(pos.y)
              })

              this.servicesScroll.on('refresh', (pos) => {
                this.checkedDefault()
              })

              //初始化itemHeight
              this._initTops()

            }else{
              this.scroll.refresh()
              this.menuBottomScroll.refresh()
              this.servicesScroll.refresh()
            }
        })
      },
      _initTops(){
        var tops = this.tops
        var top =0
        tops.push(top)
        var lis = this.$refs.servicesWrapper.getElementsByClassName('service-list');
        [].slice.call(lis).forEach(li => {
          top += parseInt(li.clientHeight)
          tops.push(top)
        })
      },
      clickMenuItem(index,event){
        // 过滤掉原生DOM事件
        //if(!event._constructed) {
          //console.log("nofeixd")
          //return
        //}
        //console.log( this.$refs.servicesWrapper.getElementsByClassName("services-content")[0].clientHeight)

        var li = this.$refs.servicesWrapper.getElementsByClassName('service-list')[index]
        this.servicesScroll.scrollToElement(li, 300)

      },
      clickServieItem(id,jumpUrl,event){
        if(!event._constructed) {
          //console.log("1",event)
        }
        if(jumpUrl){
          window.location.href = tool.replaceUrlMerchantId(jumpUrl,this.merchantId)
        }else{
          this.$router.push({path:'/couponGoods', query:{itemId: id}})
        }
      },
      checkedDefault(){
        if(this.$route.query.categoryId && String(this.$route.query.categoryId).length > 0 && this.$route.query.categoryId > 0){
          for(let item in this.serviceMenuList){
            if(this.serviceMenuList[item].id == this.$route.query.categoryId){
              let index = parseInt(item)
              this.clickMenuItem(index,event)
              this.$router.replace({path:'/serviceCenter',query:{categoryId: 0}})
              return
            }
          }
        }
      }
    },
    computed: {
      currentIndex: {
        // getter
        get: function () {
          for (let i = 0; i < this.tops.length; i++) {
            let height1 = this.tops[i];
            let height2 = this.tops[i + 1];
            if (this.scrollY >= height1 && this.scrollY < height2) {
              return i;
            }
          }
          return 0;
        },
        // setter
        set: function (newValue) {
          //console.log(newValue)
          return newValue
        }
      }
    },
    watch: {
      currentIndex(newval){
        var li = this.$refs.menuWrapper.getElementsByClassName('menu-item')[newval - 1]
        this.scroll.scrollToElement(li, 200)
        var li = this.$refs.menuBottom.getElementsByClassName('menu-item')[newval - 1]
        this.menuBottomScroll.scrollToElement(li, 200)
      },
      listLastHeight(newval){
        //console.log(newval)
        //this.servicesScroll.refresh()
        //this.checkedDefault()
      }
    },
    activated(){
      if(this.scroll) this.scroll.refresh();
      if(this.menuBottomScroll) this.menuBottomScroll.refresh();
      if(this.servicesScroll) this.servicesScroll.refresh();
    }
  }
</script>


<style lang="stylus" rel="stylesheet/stylus" scoped>
  .service-placeholder
    width 100%
  .service-center
    background-color #fff
    .menu-wrapper
      width 100%
      background #fff
      overflow hidden
      height 2.71875rem
      border-bottom: 1px solid #ddd;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1;
      .menu-content
        height 2.71875rem
        &:first-child
          margin-left
        .menu-item
          width 5.2rem
          height 2.71875rem
          line-height 2.71875rem
          float left
          text-align center
          .text
            font-size 0.875rem
            width 100%
            font-weight 600
        .click-item
          position relative
          // -webkit-animation changeMenu 0.2s
          // animation changeMenu 0.2s
          color #f1c488
          // &::after
          //   content ""
          //   position absolute
          //   bottom 0
          //   left 50%
          //   transform translateX(-50%)
          //   width 1.875rem
          //   height 0.1875rem
          //   background-color rgb(213,182,94)
          //   border-radius 5px
          .text
            font-weight 600
            font-size 1rem

      .meun-bottom
        position absolute
        left 0
        bottom 0
        // background blue
        width 100%
        height 0.1875rem
        overflow hidden
        ul
          height 0.1875rem
          .menu-item
            height 100%
            width 5.2rem
            float left
            text-align center
            span
              width 1.875rem
              height 0.1875rem
              background-color transparent
              border-radius 5px
              display block
              margin 0 auto
          .check-item
             span
              width 1.875rem
              height 0.1875rem
              border-radius 5px
              background-color #f1c488

    .serviceCenterContent
      position fixed
      left 0
      top 0
      bottom 0
      right 0
      max-width 750px
      .all-service
        min-height 1px
        // height 100vh
        .services-Wrapper
          position fixed
          left 0
          top 2.71875rem
          bottom 0
          right 0
          overflow hidden
          max-width 750px
          //padding 0 1rem 0rem 1rem
          .service-list
            padding-top 1rem
            &:first-child
              padding-top 0
          .service-title
            font-size 0.937rem
            position relative
            height 1rem
            font-weight 600
            padding-left 1.5rem

            &::before
              content ""
              position absolute
              left 1rem
              top 0
              height 0.875rem
              width 0.1875rem
              background-color #f1c488
              border-radius 2px

          .service-itemWrap
            display flex
            flex-wrap wrap
            padding-top 0.75rem

            .service-item
              width 20%
              height 6rem
              position relative
              .icon
                text-align center
                img
                  height 2.406rem
                  width 2.406rem
                  border-radius 50%
                  display block
                  margin 0 auto
                  margin-top 0.625rem
                  background-color: #ddd;
                .service-name
                  font-size 0.75rem
                  padding-top 0.75rem
                  white-space nowrap
                  overflow hidden
                  text-overflow ellipsis

                .service-des
                  padding-top 0.406rem
                  font-size 0.688rem
                  color: rgb(153,153,153)
                  white-space nowrap
                  overflow hidden
                  text-overflow ellipsis

.fadeIn
  -webkit-animation fadeIn 0.2s
  animation fadeIn 0.2s

.fadeOut
  -webkit-animation fadeOut 0.2s
  animation fadeOut 0.2s


@-webkit-keyframes changeMenu {
  from {
    font-size 0.5rem
  }
  to {
    font-size 1rem
  }
}

@keyframes changeMenu {
  from {
    font-size 0.5rem
  }
  to {
    font-size 1rem
  }
}
</style>

<template>
  <!-- 会员商品库展示 -->
  <div class="service-center">
    <shop-header ref="shopHeader" v-if="showHeader" style="position: absolute;top:0;left: 0;z-index: 999" line-style="background:#fff" title="会员商品"></shop-header>

    <div :style="serviceCenterStyle" class="serviceCenterContent">
      <div class="all-service"  v-show="!showLoad">
        <div class="menu-wrapper">
          <div class="menu-item" ref="menuItem" v-for="(item, index) in serveMeunData" :key="index"
            :class="[ index === activeMeunIndex  ? 'active-menu-item' : '']"
            @click="clickMenuItem(index)">
              {{item.libraryName}}
          </div>
          <div class="tabs-line" ref="tabsLine"></div>
        </div>
        <div>
          <transition-group tag="div" :name="transitionName">
            <div v-show="index == activeMeunIndex" v-for="(i, index) in serveMeunData" :key="i.id" class="serveTabs">
              <scroll ref="servicesWrapper" class="services-Wrapper" :key="i.id" :data="i.qyCategoryResultList">
                <ul class="services-content">
                  <li class="service-list" v-for="(service, index) in i.qyCategoryResultList" :key="index">
                    <div>
                      <div class="service-title">{{ service.name }}</div>
                      <div class="service-itemWrap">
                        <div class="service-item" v-for="(item, index) in service.qyItemResultList" :key="index"  @click="clickServieItem(item.id,item.jumpUrl,i.id)">
                          <div class="icon">
                            <img :src="item.cover" :alt="item.title">
                          </div>
                          <div class="service-name">{{ item.title }}</div>
                          <div class="service-des">{{ item.subTitle }}</div>
                          <img v-if="hasLabel" class="label" src="./images/label.png" >
                        </div>
                      </div>
                      <!-- <div class="listLast" ref="listLast" v-if="index===serviceMenuList.length-1" :style="listLastHeight"></div> -->
                    </div>
                  </li>
                </ul>
              </scroll>
            </div>
          </transition-group>
        </div>
      </div>
      <loading style="padding-top: 40%" v-show="showLoad" :title="loadingTitle"></loading>
    </div>
    <div class="float-wrap">
      <div v-for="item in allData" :key="item.uid">
        <div v-if="item.moduleType === 'Menu'">
          <member-menu
            :menuList="item.configJson.menu_entry"
            :merchantId="merchantId"
            @jumplinkUrl="jumplinkUrl"
          ></member-menu>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Scroll from '../../base/scroll/scroll'
  import ShopHeader from '../../base/shop-header/shop-header'
  import MemberMenu from '../../base/member-menu/member-menu'
  import * as core from '../../api/serviceCenter'
  import tool from '../../common/js/util'
  import wxShareMixin from '../../common/js/wxShareMixin'
  import Loading from '../../base/loading/loading'

  export default {
    name: 'serviceCenter',
    components: {
      ShopHeader,
      Loading,
      Scroll,
      MemberMenu
    },
    mixins:[wxShareMixin],
    data () {
      return {
        merchantId: window.infoData.merchantId,
        privilegePageUuid: window.infoData.privilegePageUuid || '',
        showLoad: true,
        allData: [],
        loadingTitle: '正在加载...',
        showHeader: false,
        serviceCenterStyle: "",
        servicesTopstyle:"",
        activeMeunIndex: 0,
        serveMeunData: [],
        serviceMenuList: [],
        tops: [],
        scrollY: 0,
        listLastHeight:'',
        shareUrl: location.href,
        shareLink:  window.location.href,  //分享出去的链接
        shareTitle: '会员特权',  //分享的标题
        shareDesc: '多达100余种会员特权，每年能帮您节省5998元，畅享世界从这里开始！', //分享的详情介绍
        shareImgUrl: 'https://c1.51jujibao.com/static/mkt/2019/05/shareImages/huiyuan.png',
        passIdList: null,//要过滤掉的商品id
        transitionName: 'slide-left',
        hasLabel: false
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
            this.getNewShopTequan({pageUuid: this.privilegePageUuid})
          } else {
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(e => {
          this.$toastBox.showToastBox(e)
        })
      },
      jumplinkUrl(url) {
        if (url) {
          window.location.href = tool.replaceUrlMerchantId(url, this.merchantId)
        }
      },
      getServideCenterData(opts){
        core.getServiceCenter(opts).then(res => {
          //console.log(res)
          if(res.code && '00' == res.code){
            if(res.result){
              this.serveMeunData = res.result
              this.showLoad = false
              this._initScroll()
            }
          } else {
            this.$toastBox.showToastBox(res.message)
          }
        })
      },
      _initScroll () {
        // 创建分类列表的Scroll对象
        // this.$nextTick(()=>{
            // let width = 0
            // for (let i = 0, length=this.serviceMenuList.length; i < length; i++) {
            //   width+=this.$refs.menuItem[0].getBoundingClientRect().width
            // }
            // this.$refs.menuContent.style.width = width+'px'
            if(this.$route.query.index > -1){
              // console.log(this.$route.query.index)
              this.clickMenuItem(parseInt(this.$route.query.index))
            }else{
              this.clickMenuItem(0)
            }
            
            // if (!this.servicesScroll) {
              // 占位高度
              // let length=this.serviceMenuList.length
              // let lastHeight=this.$refs.serviceList[length-1].offsetHeight
              // let windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight //窗口高度
              // let menuHeight = this.$refs.menuWrapper.getBoundingClientRect().height
              // let placeholderHeight = windowHeight - menuHeight - lastHeight + 10
              // this.listLastHeight =  "height:"+ placeholderHeight + "px"

              // this.servicesScroll = new BScroll(this.$refs.servicesWrapper_0, {
              //   startX: 0,
              //   scrollX: false,
              //   scrollY: true,
              //   probeType: 3,
              //   click: true
              // })

              // this.servicesScroll2 = new BScroll(this.$refs.servicesWrapper_1, {
              //   startX: 0,
              //   scrollX: false,
              //   scrollY: true,
              //   probeType: 3,
              //   click: true
              // })

              // this.servicesScroll.on('scroll', (pos) => {
              //   this.scrollY = Math.abs(pos.y)
              // })

              // this.servicesScroll.on('refresh', (pos) => {
              //   this.checkedDefault()
              // })

              //初始化itemHeight
              // this._initTops()

            // }else{
            //   this.servicesScroll.refresh()
            // }
        // })
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
      clickMenuItem(index){
        if(index < this.activeMeunIndex){
          this.transitionName = 'slide-right'
        }else if(index > this.activeMeunIndex){
          this.transitionName = 'slide-left'
        }
        this.activeMeunIndex = index
        this.$nextTick(() => {
          this.tabsLineChange(index)
        })
        // var li = this.$refs.servicesWrapper.getElementsByClassName('service-list')[index]
        // this.servicesScroll.scrollToElement(li, 300)
      },
      clickServieItem(id,jumpUrl,libraryId){
        if(jumpUrl){
          window.location.href = tool.replaceUrlMerchantId(jumpUrl,this.merchantId)
        }else{
          this.$router.push({path:'/couponGoods', query:{itemId: id, libraryId: libraryId}})
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
      },
      tabsLineChange(index){
        this.$refs.menuItem[index].style.animation = 'changeType 0.1s linear'
        setTimeout(() => {
          let width = this.$refs.menuItem[index].getBoundingClientRect().width
          this.$refs.tabsLine.style.width = width + 'px' 
          this.$refs.tabsLine.style.transform = 'translateX('+ this.$refs.menuItem[index].getBoundingClientRect().x +'px)'
          this.$refs.tabsLine.style.transitionDuration = '0.3s'
        }, 20)
      },
      getNewShopTequan(opts) {
        core.newShopTequan(opts).then(res => {
          // console.log(res)
          if (res.code && '00' === res.code) {
            if (res.result.data) {
              let data = JSON.parse(res.result.data)
              this.allData = data
            }
          } else {
            this.$toastBox.showToastBox(res.message)
          }
        }).catch(e => {
          this.$toastBox.showToastBox(e)
        })
      },
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
        // var li = this.$refs.menuWrapper.getElementsByClassName('menu-item')[newval - 1]
        // this.scroll.scrollToElement(li, 200)
      },
      listLastHeight(newval){
       
      }
    },
    activated(){
      if(this.servicesScroll){
        this.servicesScroll.refresh();
      }
    }
  }
</script>
<style lang="css">
  @-webkit-keyframes changeType {
    from {
      font-size: 1rem;
    }
    to {
      font-size: 1.25rem;
    }
  }

  @keyframes changeType {
    from {
      font-size: 1rem;
    }
    to {
      font-size: 1.25rem;
    }
  }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .service-center
    background-color rgba(245, 245, 245, 1)
    .serviceCenterContent
      position fixed
      left 0
      top 0
      bottom 0
      right 0
      max-width 750PX
      background-color rgba(245, 245, 245, 1)
      .all-service
        min-height 1px
        .menu-wrapper
          width 100%
          height 3.5rem
          position relative
          display flex
          justify-content space-evenly
          align-items center
          border-bottom 0.0625rem solid rgba(238,238,238,1)
          box-sizing border-box
          background-color rgba(255,255,255,1)
          .tabs-line
            position: absolute;
            bottom: 0px;
            left: 0;
            z-index: 1;
            height: 0.15rem;
            background-color: rgba(183,130,49,1);
            border-radius: 0.1rem;
          .menu-item
            height 3.5rem
            font-size: 1rem;
            color: rgba(153,153,153,1);
            font-weight: normal;
            height: 100%;
            box-sizing border-box
            line-height 3.5rem
          .active-menu-item
            color: rgba(196,143,73,1);
            animation: changeType 0.1s linear;
            font-size: 1.25rem;
            font-weight bold
        .serveTabs
          position absolute
          top 3.5rem
          left 0
          right 0
          bottom 0
          background-color rgba(245, 245, 245, 1)
          .services-Wrapper
            position absolute
            left 0
            top 0
            bottom 0
            right 0
            overflow hidden
            max-width 750PX
            padding 0.75rem
            background-color rgba(245, 245, 245, 1)
            .service-list
              padding 0.75rem 0
              .service-title
                font-size 1.13rem
                padding-bottom 0.25rem
                box-sizing border-box
                color rgba(61, 58, 57, 1)
          
              .service-itemWrap
                display flex
                flex-wrap wrap
                .service-item
                  margin-top 0.75rem
                  // width 5.06rem
                  width: 23%;
                  height 7.81rem
                  background url('./images/item-bg.png') no-repeat center
                  background-size 100% 100%
                  position relative
                  text-align center
                  margin-right 0.56rem
                  &:nth-child(4n+4) 
                    margin-right 0
                  .icon
                    padding-top 1rem
                    img
                      width:2.63rem;
                      height:2.63rem;
                      border-radius:50%;
                  .service-name
                    margin-top 1.62rem
                    font-size 0.75rem
                    white-space nowrap
                    overflow hidden
                    text-overflow ellipsis
                    color rgba(196, 143, 73, 1)
                    line-height 1.2
                  .service-des
                    margin-top 0.3rem
                    font-size 0.75rem
                    color rgba(61, 58, 57, 1)
                    padding 0 0.2rem
                    box-sizing border-box
                    white-space nowrap
                    overflow hidden
                    text-overflow ellipsis
                    line-height 1.2
                  .label
                    position absolute
                    left 0px
                    top -0.2rem
                    width 2.06rem
                    height 1rem



.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
    will-change: transform;
    transition: all .3s;
    position: absolute;
    width:100%;
    left:0;
}
.slide-right-enter {
    transform: translateX(-100%);
}
.slide-right-leave-active {
    transform: translateX(100%);
}
.slide-left-enter {
    transform: translateX(100%);
}
.slide-left-leave-active {
    transform: translateX(-100%);
}
</style>

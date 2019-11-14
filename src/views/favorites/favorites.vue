<template>
  <!-- 会员商品库展示 -->
  <div class="service-center favorites">
    <shop-header ref="shopHeader" v-if="showHeader" style="position: absolute;top:0;left: 0;z-index: 999" line-style="background:#fff" title="我的收藏"></shop-header>

    <div :style="serviceCenterStyle" class="serviceCenterContent">
      <div class="all-service"  v-show="!showLoad">
        <div class="menu-wrapper" :style="{ justifyContent: serveMeunData && serveMeunData.length === 1 ? 'flex-start' : 'space-evenly'}">
          <div class="menu-item" ref="menuItem" v-for="(item, index) in serveMeunData" :key="index"
            :class="[ index === activeMeunIndex  ? 'active-menu-item' : '']"
            @click="clickMenuItem(index)">
              {{item.goodsLibraryName}}
          </div>
          <div class="tabs-line" ref="tabsLine"></div>
        </div>
        <div>
          <transition-group tag="div" :name="transitionName">
            <div v-show="index == activeMeunIndex" v-for="(i, index) in serveMeunData" :key="i.goodsLibraryId" class="serveTabs">
              <scroll ref="servicesWrapper" class="services-Wrapper" :key="i.goodsLibraryId" >
                <ul class="services-content">
                  <li class="service-list">
                    <div>
                      <div class="service-itemWrap">
                        <div class="service-item" v-for="(item, index) in i.qyUserLikeItemResultList" :key="index"  @click="clickServieItem(item.itemId,item.jumpUrl,i.goodsLibraryId)">
                          <div class="icon">
                            <img :src="item.cover" :alt="item.title">
                          </div>
                          <div class="service-name">{{ item.name }}</div>
                          <div class="service-des">{{ item.subname }}</div>
                          <img v-if="hasLabel" class="label" src="./images/label.png" >
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </scroll>
            </div>
          </transition-group>
        </div>
        <div v-show="noFavorites" class="no-favorites">
          <div class="no-favorites-content fadeIn">
            <img src="./images/no-favorites.png" alt="no favorites" class="">
            <p class="no-favorites-text">您还没有收藏任何商品哦~</p>
            <button type="button" class="goShop" @click="goShop">去逛逛</button>
          </div>
        </div>
      </div>
      <loading style="padding-top: 40%" v-show="showLoad" :title="loadingTitle"></loading>
    </div>
  </div>
</template>

<script>
  import Scroll from '../../base/scroll/scroll'
  import ShopHeader from '../../base/shop-header/shop-header'
  import * as core from '../../api/serviceCenter'
  import tool from '../../common/js/util'
  import Loading from '../../base/loading/loading'

  export default {
    name: 'favorites',
    components: {
      ShopHeader,
      Loading,
      Scroll
    },
    data () {
      return {
        merchantId: window.infoData.merchantId,
        showLoad: true,
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
        passIdList: null,//要过滤掉的商品id
        transitionName: 'slide-left',
        noFavorites: true,
        hasLabel: false
      }
    },
    created () {
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
        core.vipGoodsLikeList(opts).then(res => {
          //console.log(res)
          if(res.code && '00' == res.code){
            if(res.result && res.result.length > 0){
              this.serveMeunData = res.result
              this._initScroll()
              this.noFavorites = false
            }else{
              this.noFavorites = true
            }
            this.showLoad = false
          } else {
            this.showLoad = false
            this.$toastBox.showToastBox(res.message)
          }
        })
      },
      _initScroll () { 
        if(this.$route.query.index > -1){
          // console.log(this.$route.query.index)
          this.clickMenuItem(parseInt(this.$route.query.index))
        }else{
          this.clickMenuItem(0)
        }
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
      goShop(){
        this.$router.push({path:'/member'})
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
        // var li = this.$refs.menuWrapper.getElementsByClassName('menu-item')[newval - 1]
        // this.scroll.scrollToElement(li, 200)
      },
      listLastHeight(newval){
       
      }
    },
    activated(){
      if(this.servicesScroll){
        this.$refs.servicesWrapper.refresh();
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
        .no-favorites
          position absolute
          top 0
          left 0
          right 0
          bottom 0
          .no-favorites-content
            height: 100%;
            padding-top 4rem
            text-align center
            background-color #fff
            img
              width 7.5rem
              height 7.5rem
            .no-favorites-text
              margin 1.5rem 0
              font-size 0.75rem
              color rgba(153, 153, 153, 1)
              font-size 1rem
            .goShop
              outline none
              background rgba(196, 143, 73, 1)
              color rgb(255,255,255)
              border none
              border-radius 0.25rem
              padding 0.59rem 1.45rem
              font-size 1.13rem;
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
          padding 0 0.75rem 
          box-sizing border-box
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
            padding 0 0.75rem
            background-color rgba(245, 245, 245, 1)
            .service-list
              padding 0
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
                    margin-top 1.72rem
                    font-size 0.75rem
                    white-space nowrap
                    overflow hidden
                    text-overflow ellipsis
                    color rgba(196, 143, 73, 1)
                  .service-des
                    margin-top 0.4rem
                    font-size 0.75rem
                    color rgba(61, 58, 57, 1)
                    padding 0 0.2rem
                    box-sizing border-box
                    white-space nowrap
                    overflow hidden
                    text-overflow ellipsis
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

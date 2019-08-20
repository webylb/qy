<template>
  <div class="service-center">
    <shop-header ref="shopHeader" v-if="showHeader" style="position: absolute;top:0;left: 0;z-index: 999;" line-style="background:#fff;max-width:750px" title="我喜欢"></shop-header>

    <div class="serviceCenterContent">
      <div class="all-service" >
        <div class="services-Wrapper" ref="servicesWrapper" :style="serviceCenterStyle" >
          <ul class="services-content" ref="servicesContent">
            <li class="service-list" ref="serviceList">
              <div>
                <div class="service-itemWrap">
                  <div class="service-item " v-for="(item,index) in serviceMenuList" :key="index">
                    <div class="icon" @click="clickServieItem(item.itemId,$event)">
                      <img :src="item.cover" :alt="item.name">
                      <div class="service-name">{{ item.name }}</div>
                      <div class="service-des">{{ item.subname }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll  from 'better-scroll'
  import ShopHeader from '../../base/shop-header/shop-header'
  import * as core from '../../api/serviceCenter'
  import tool from '../../common/js/util'
  import wxShareMixin from '../../common/js/wxShareMixin'

  export default {
    components: {
      ShopHeader
    },
    mixins:[wxShareMixin],
    data () {
      return {
        merchantName: window.infoData.merchantName,
        swiperList: [],
        showHeader: false,
        serviceCenterStyle: "",
        serviceMenuList: [],
        tops: [],
        scrollY: 0,
        packedIndex: 0,
        listLastHeight:'',
        isShowFiexd: false,
        shareUrl: location.href,
        shareLink:  window.location.href,  //分享出去的链接
        shareTitle: '',  //分享的标题
        shareDesc: '', //分享的详情介绍
        shareImgUrl: '',
      }
    },
    created () {
      //this.getShare()
      document.title = this.$route.meta.title
      let ua = navigator.userAgent.toLowerCase();
      let isWeixin = ua.indexOf('micromessenger') != -1;
      if (!isWeixin) {
        this.showHeader=true
        this.serviceCenterStyle = "top:2.75rem"
        // alert('Dragondean说这不是通过微信内置浏览器');
      } else {
        this.showHeader=false
        this.serviceCenterStyle = "top:0rem"
      }

      core.vipGoodsLikeList().then(res => {
        this.$nextTick(() => {
          //console.log(res)
          if(res.code && '00' == res.code){
            if(res.result && res.result.length > 0){
              this.serviceMenuList = res.result
              this._initScroll()
            }else{
              this.$router.push('/member')
            }
          } else if(res.code && '01' === res.code && res.isLogin == 'false'){
            if(res.url){
              window.location.href = res.url
            }
          }else  {
            this.$toastBox.showToastBox(res.message)
          }
        })
      })

    },
    mounted(){
      this.$nextTick(()=>{

      });
    },
    methods: {
      _initScroll () {
        // 创建分类列表的Scroll对象
        this.$nextTick(()=>{

            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.servicesWrapper, {
                startX: 0,
                scrollX: false,
                scrollY: true,
                probeType: 3,
                click: true
              })

              this.scroll.on('scroll', (pos) => {
                this.scrollY = Math.abs(pos.y)
              })

            }else{
              this.scroll.refresh()
            }
        })
      },
      clickServieItem(id,event){
        if(!event._constructed) {
          //console.log("1",event)
        }
        //console.log("2",event)

        //window.location.href = window.location.href.split("#")[0] + '?#' + '/couponGoods?itemId='+ id
        this.$router.push({path: '/couponGoods', query:{itemId: id}})
      }
    }
  }
</script>


<style lang="stylus" rel="stylesheet/stylus" scoped>
  .service-placeholder
    width 100%
  .service-center
    background-color #fff
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
          position absolute
          left 0
          top 0
          bottom 0
          right 0
          overflow hidden
          //padding 0 1rem 0rem 1rem
          .service-list
            padding-top 1.0625rem
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
              background-color rgb(213,182,94)
              border-radius 2px

          .service-itemWrap
            display flex
            flex-wrap wrap
            padding-top 0.75rem

            .service-item
              width 20%
              height 6.25rem
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

</style>

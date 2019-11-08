<template>
  <div class="order-nav">
    <div class="order-list">
      <div class="nav-item" ref="navItem" @click="handleNav(index)"
          v-for="(item,index) in navList" :key="index"
          :class="activeIndex===index?'active':''">{{item}}
        <!-- <div v-if="item==='待付款' && numData.unPayOrderCount > 0"
            :class="numData.unPayOrderCount>9?'num1':'num'">
          {{numData.unPayOrderCount>99 ? '99+' : numData.unPayOrderCount}}
        </div>
        <div v-if="item==='待激活' && numData.unActiveOrderCount > 0"
            :class="numData.unActiveOrderCount>9?'num1':'num'">
          {{numData.unActiveOrderCount>99 ? '99+' : numData.unActiveOrderCount }}
        </div>
        <div v-if="item==='待发货' && numData.unShipOrderCount > 0"
            :class="numData.unShipOrderCount>9?'num1':'num'">
          {{ numData.unShipOrderCount>99 ? '99+' : numData.unShipOrderCount}}
        </div> -->
      </div>
      <div class="tabs-line" ref="tabsLine"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'order-nav',
    data() {
      return {
        navList: ['全部', '待付款', '待激活', '待发货', '已完成']
      }
    },
    props: {
      numData: {
        type: Object,
        default: {
          unPayOrderCount: 0,
          unActiveOrderCount: 0,
          unShipOrderCount: 0,
        }
      },
      activeIndex: {
        type: Number,
        default: 0
      }
    },
    mounted(){
      
    },
    methods: {
      handleNav(e) {
        this.$emit('handleNav', e)
      },
      tabsLineChange(index){
        // this.$refs.navItem[index].style.animation = 'changeType 0.1s linear'
        setTimeout(() => {
          let width = this.$refs.navItem[index].getBoundingClientRect().width
          this.$refs.tabsLine.style.width = width + 'px' 
          this.$refs.tabsLine.style.transform = 'translateX('+ this.$refs.navItem[index].getBoundingClientRect().x +'px)'
          this.$refs.tabsLine.style.transitionDuration = '0.3s'
        }, 20)
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
  .order-nav
    background-color: #ffffff;
    .order-list
      width 100%
      height 3.5rem
      position relative
      display flex
      justify-content space-evenly
      align-items center
      .nav-item
        position relative
        text-align center
        height 3.5rem
        font-size: 1rem;
        color: rgba(153,153,153,1);
        font-weight: normal;
        height: 100%;
        box-sizing border-box
        line-height 3.5rem
        .num, .num1
          font-size 0.69rem
          box-sizing border-box
          background rgba(226, 58, 55, 1)
          position absolute
          left 95%
          min-width 1rem
          height 1rem
          border-radius 0.5rem
          text-align center
          line-height 1rem
          color #fff
          top 0.65rem
        .num1
          padding 0 0.25rem
      .active
        color: rgba(196,143,73,1);
        // animation: changeType 0.1s linear;
        // font-size: 1.25rem;
        font-weight bold
      .tabs-line
        position: absolute;
        bottom: 0px;
        left: 0;
        z-index: 1;
        height: 0.15rem;
        background-color: rgba(183,130,49,1);
        border-radius: 0.1rem;
</style>

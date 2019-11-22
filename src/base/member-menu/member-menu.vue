<template>
  <div>
    <div class="menu">
      <div class="switch_btn">
        <button type="button" @click="switchBtnGroup()">
          <!-- <i class="iconfont" ref="switchBtn">&#xe63a;</i> -->
          <div class="line1" :class="[switchStatus == 'on' ? 'active-line1' : '']"></div>
          <div class="line2" :class="[switchStatus == 'on' ? 'active-line2' : '']"></div>
          <div class="line3" :class="[switchStatus == 'on' ? 'active-line3' : '']"></div>
        </button>
      </div>
      <div class="btn_list" v-show="switchStatus == 'on'">
        <div class="btn_item" v-for="(item, index) in menuList" :key="index" :class="[switchStatus == 'on' ? 'menu-animate' : '']">
          <button type="button" ref="btnIndex" @click="jumplinkUrl(item.urlSelectOptionsValue || item.urlInputValue)">
            <img :src="item.img_url" alt="">
          </button>
        </div>
      </div>
    </div>
    <div class="menu-mask menu-fade" @click="switchBtnGroup()" v-show="switchStatus == 'on'"></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        switchStatus: 'off'
      }
    },
    props: {
      menuList: {
        type: Array
      },
      merchantId: {
        type: Number
      }
    },
    mounted() {

    },
    activated(){

    },
    beforeUpdate() {

    },
    methods: {
      onLoaded(){
        this.$emit('onLoaded')
      },
      jumplinkUrl(url){
        this.$emit('jumplinkUrl', url)
      },
      switchBtnGroup () {
        let length = this.menuList.length
        if (this.switchStatus === 'off') {
          this.switchStatus = 'on'
          
          setTimeout(() => {
            for (let i=0; i < length; i++) {
              this.$refs.btnIndex[i].style.transform = 'translateY(-'+ (length - i) * 4 +'rem)'
              this.$refs.btnIndex[i].style.transition = 'all 0.2s ease'
            }
          }, 20)
          
        } else if (this.switchStatus === 'on') {
      
          for (let i=0; i < length; i++) {
            this.$refs.btnIndex[i].style.transform = 'translateY(0rem)'
            this.$refs.btnIndex[i].style.transition = 'all 0.2s ease'
          }
          setTimeout(() => {
            this.switchStatus = 'off'
          }, 100)
        }
      }
    },
    destroyed() {

    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .menu-mask
    position fixed
    left 0
    top 0
    bottom 0
    right 0
    z-index 11
    background-color rgba(0,0,0,0.3)
  .menu
    width 100%
    max-width 750PX
    position fixed
    bottom 4.25rem
    right 0.75rem
    z-index 12
    display flex
    justify-content space-between
    align-items center
    height 3.25rem
    width 3.25rem
    border-radius 50%
  .btn_list {
    position: absolute;
    right: 0;
    bottom: 0;
    width 3.25rem
    height 3.25rem
    z-index: -1;
    .btn_item {
      position absolute
      width 3.25rem
      height 3.25rem
      border-radius 50%
      margin-bottom: 0.75rem;
    }
    button {
      width 3.25rem
      height 3.25rem
      border-radius 50%
      padding: 0;
      border: none;
      outline none 
      border none 
      img {
        width: 100%;
        height: 100%;
        border-radius 50%
        box-shadow 0rem 0.2rem 0.4rem 0rem rgba(171,171,171,0.5)
      }
    }
  }
  .switch_btn {
    width 3.25rem
    height 3.25rem
    border-radius 50%
    // transform rotate(-45deg)
    // transform-origin center
    button {
      outline none 
      border none 
      width 3.25rem
      height 3.25rem
      border-radius 50%
      padding: 0;
      color #fff
      //background-color rgba(183, 130, 49, 1)
      background-color rgba(0,0,0,0.7)
      box-shadow 0rem 0.15rem 0.5rem 0 rgba(53,53,53,.4);
      i {
        font-size: 1rem;
      }
      .line1 {
        width: 1.5rem;
        height: 0.1875rem;
        background: #fff;
        border-radius 0.1rem
        transition: all 0.3s ease;
        transform-origin: left top;
        transform: rotate(0deg);
        margin: 0 auto
        margin-bottom 0.3125rem
        position relative
        left 0
      }
      .active-line1 {
        left 0.27rem
        transform: rotate(43deg);
      }
      .line2 {
        width: 1.5rem;
        height: 0.1875rem;
        border-radius 0.1rem
        background: #fff;
        transition: all 0.1s ease;
        margin: 0 auto
        margin-bottom 0.3125rem
      }
      .active-line2 {
        opacity 0
      }
      .line3 {
        width: 1.5rem;
        height: 0.1875rem;
        border-radius 0.1rem
        background: #fff;
        transition: all 0.3s ease;
        transform-origin: left bottom;
        transform: rotate(0deg);
        transition: all 0.3s ease;
        margin: 0 auto
        position relative
        left 0
      }
      .active-line3 {
        left 0.27rem
        transform: rotate(-45deg);
      }
    }
  }

.menu-animate {
  -webkit-animation: bounce 0.5s linear 0.2s;
  -moz-animation: bounce 0.5s linear 0.2s;
  animation: bounce 0.5s linear 0.2s;
}

.menu-fade {
  -webkit-animation: fade 0.3s linear;
  -moz-animation: fade 0.3s linear;
  animation: fade 0.3s linear;
}

@-webkit-keyframes fade {
  0% {
    opacity 0
  }
  10% {
    opacity 0.1
  }
  30% {
    opacity 0.3
  }
  70% {
    opacity 0.7
  }
  90% {
    opacity 0.9
  }
  100% {
    opacity 1
  }
}
@keyframes fade {
  0% {
    opacity 0
  }
  10% {
    opacity 0.1
  }
  30% {
    opacity 0.3
  }
  70% {
    opacity 0.7
  }
  90% {
    opacity 0.9
  }
  100% {
    opacity 1
  }
}


@-webkit-keyframes bounce {
  0%,100% {
    -webkit-transform: translateY(0px);
  }
  10% {
    -webkit-transform: translateY(-3px);
  }
  30% {
    -webkit-transform: translateY(4px);
  }
  70% {
    -webkit-transform: translateY(-1px);
  }
  90% {
    -webkit-transform: translateY(2px);
  }
}
@-moz-keyframes bounce {
  0%,100% {
    -moz-transform: translateY(0px);
  }
  10% {
    -moz-transform: translateY(-3px);
  }
  30% {
    -moz-transform: translateY(4px);
  }
  70% {
    -moz-transform: translateY(-1px);
  }
  90% {
    -moz-transform: translateY(2px);
  }
}
@keyframes bounce {
  0%,100% {
    -webkit-transform: translateY(0px);
    -moz-transform: translateY(0px);
    -ms-transform: translateY(0px);
    -o-transform: translateY(0px);
    transform: translateY(0px);
  }
  10% {
    -webkit-transform: translateY(-3px);
    -moz-transform: translateY(-3px);
    -ms-transform: translateY(-3px);
    -o-transform: translateY(-3px);
    transform: translateY(-3px);
  }
  30% {
    -webkit-transform: translateY(4px);
    -moz-transform: translateY(4px);
    -ms-transform: translateY(4px);
    -o-transform: translateY(4px);
    transform: translateY(4px);
  }
  70% {
    -webkit-transform: translateY(-1px);
    -moz-transform: translateY(-1px);
    -ms-transform: translateY(-1px);
    -o-transform: translateY(-1px);
    transform: translateY(-1px);
  }
  90% {
    -webkit-transform: translateY(2px);
    -moz-transform: translateY(2px);
    -ms-transform: translateY(2px);
    -o-transform: translateY(2px);
    transform: translateY(2px);
  }
}
</style>


<template>
  <div>
    <div class="menu">
      <div class="switch_btn">
        <button type="button"  @click="switchBtnGroup()">
          <i class="iconfont" ref="switchBtn">&#xe63a;</i>
        </button>
      </div>
      <div class="btn_list" v-show="switchStatus == 'on'">
        <div class="btn_item" v-for="(item, index) in menuList" :key="index">
          <button type="button" ref="btnIndex" @click="jumplinkUrl(item.urlSelectOptionsValue || item.urlInputValue)">
            <img :src="item.img_url" alt="">
          </button>
        </div>
      </div>
    </div>
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
          
          this.$refs.switchBtn.style.transform = 'rotate(135deg)'
          this.$refs.switchBtn.style.transformOrigin = 'center'
          this.$refs.switchBtn.style.transition = 'all 0.3s ease'
          setTimeout(() => {
            for (let i=0; i < length; i++) {
              this.$refs.btnIndex[i].style.transform = 'translateY(-'+ (length - i) * 3.2 +'rem)'
              this.$refs.btnIndex[i].style.transition = 'all 0.2s ease'
            }
          }, 20)
          
        } else if (this.switchStatus === 'on') {
          this.$refs.switchBtn.style.transform = 'rotate(0deg)'
          this.$refs.switchBtn.style.transformOrigin = 'center'
          this.$refs.switchBtn.style.transition = 'all 0.3s ease'

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
  .menu
    width 100%
    position fixed
    bottom 3.5rem
    right 0.75rem
    z-index 10
    display flex
    justify-content space-between
    align-items center
    height 2.8rem
    width 2.8rem
    border-radius 50%
  .btn_list {
    position: absolute;
    right: 0;
    bottom: 0;
    width 2.8rem
    height 2.8rem
    z-index: -1;
    .btn_item {
      position absolute
      width 2.8rem
      height 2.8rem
      border-radius 50%
      margin-bottom: 0.33rem;
    }
    button {
      width 2.8rem
      height 2.8rem
      border-radius 50%
      padding: 0;
      overflow: hidden;
      border: none;
      outline none 
      border none 
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .switch_btn {
    width 2.8rem
    height 2.8rem
    border-radius 50%
    transform rotate(-45deg)
    transform-origin center
    button {
      outline none 
      border none 
      width 2.8rem
      height 2.8rem
      border-radius 50%
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
      color #fff
      i {
        font-size: 1rem;
      }
    }
  }
</style>


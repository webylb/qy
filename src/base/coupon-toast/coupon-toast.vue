<!--
 * @Description:
 * @Version: 1.0.0
 * @Author: web yang
 * @Email: 1475452561@qq.com
 * @Date: 2019-08-08 14:47:05
 * @LastEditors: web ylb
 * @LastEditTime: 2019-08-09 15:07:19
 -->
<template>
  <div class="coupon-toast" v-show="isShowToast" @click.stop="hideToastBox">
    <div class="coupon-toast-content" @click.stop="">
      <img :src="content" alt="" />
      <div class="coupon-close" @click="hideToastBox">
        <i class="iconfont">&#xe63f;</i>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      content: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        isShowToast: false,
      };
    },
    methods: {
      showToastBox: function () {
        this.isShowToast = true;
      },
      hideToastBox: function () {
        this.isShowToast = false;
      },
      destroy: function () {
        this.$destroy();
        document.body.removeChild(this.$el);
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .coupon-toast
    position fixed
    left 0
    top 0
    bottom 0
    right 0
    background rgba(0,0,0,0.5)
    z-index 1000
    .coupon-toast-content
      background-color #fff
      width 20rem
      min-height 3rem
      border-radius 10px
      display inline-block
      position absolute
      top 50%
      left 50%
      transform translate(-50%,-50%)
      text-align center
      img
        border-radius 10px
        width 100%
        height auto
      .coupon-close
        position absolute
        top 0
        left 0
        height 1.5rem
        width 1.5rem
        transform translateX(-50%)
        line-height 1.5rem
        text-align center
        display none
        i
          color #fff
</style>


<template>
  <div class="toast" v-show="isShowToast">
    <p>{{content}}</p>
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
        setTimeout(()=>{
          this.isShowToast = false;
        },1000)
      },
      destroy: function () {
        this.$destroy();
        document.body.removeChild(this.$el);
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .toast
    display inline-block
    position fixed
    top 50%
    left 50%
    transform translate(-50%,-50%)
    z-index 999
    width fit-content
    p
      color #fff
      font-size 1rem
      line-height 1
      padding 0.5rem 0.75rem
      border-radius 0.313rem
      display inline-block
      background-color rgba(0,0,0,.75)
</style>


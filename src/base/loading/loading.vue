<template>
  <div class="loading">
    <img v-show="loading" width="24" height="24" src="./images/loading.gif" />
    <p class="desc">{{title}}</p>
  </div>
</template>

<script>
  export default {
    name: "loading",
    props: {
      title: {
        type: String,
        default: '正在载入...'
      },
      loading:{
        type: Boolean,
        default: true
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .loading {
    width: 100%;
    text-align: center;

    .desc {
      line-height: 20px;
      font-size: 12px;
      color: #999;
    }
  }
</style>

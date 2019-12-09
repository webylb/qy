<template>
  <div>
    <div style="padding: 0.375rem 0.75rem" class="banner" v-if="bannerList.length > 0">
      <div class="banner-item" v-for="(item, index) in bannerList" :key="index">
        <a @click.stop="jumpBagDetail(item, index)"><img @load="onLoaded" class="needsclick" :src="item.img_url" ></a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    props: {
      bannerList: {
        type: Array
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
      jumpBagDetail(item, index){

        this.$emit('jumpBagDetail', item, index)
      }
    },
    destroyed() {

    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
   .banner
      .banner-item
        padding: 0.25rem 0
        img
          width 100%
          height auto
</style>


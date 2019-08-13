<template>
  <div>
    <div class="classify">
      {{ title }}
    </div>
    <div class="privilege-wrapper">
      <div class="item-wrapper">
        <slider :is-show-dots="false" class="slider-wrapper" :loop="false" :auto-play="false">
          <div >
            <div class="item-wrapper">
                <div class="item" v-for="(i,index) in privilegeList" :key="index" @click.stop="jumplinkUrl(i.jumpUrl)">
                  <img :src="i.flag ? i.icon : i.cover" alt="">
                  <div>
                    <p class="title">{{ i.flag ? i.name : i.title }}</p>
                    <p class="subhead">{{i.flag ? i.subtitle : i.subTitle}}</p>
                  </div>
                </div>
                <div class="item" @click.stop="toMore()">
                  <img src="./images/more.png" alt="">
                  <div>
                    <p class="title">发现</p>
                    <p class="subhead">更多好生活</p>
                  </div>
                </div>
            </div>
          </div>
        </slider>
      </div>
    </div>
  </div>
</template>

<script>
  import Slider from '../slider/slider'
  export default {
    data() {
      return {

      }
    },
    props: {
      privilegeList: {
        type: Array
      },
      title: {
        type: String,
        default: ''
      }
    },
    components: {
      Slider
    },
    mounted() {

    },
    activated(){

    },
    beforeUpdate() {
      if(this.privilegeList.length > 7){
        let pList = []
        for (var i = 0; i < Math.ceil(this.privilegeList.length / 8); i++) {
          pList.push([])
          pList[i] = this.privilegeList.slice(i * 8, i * 8 + 8)
        }
        this.privilegeList = JSON.parse(JSON.stringify(pList))
      }
    },
    methods: {
      onLoaded(){
        this.$emit('onLoaded')
      },
      jumplinkUrl(url){
        this.$emit('jumplinkUrl', url)
      },
      toMore(){
        this.$router.push({path: '/serviceCenter'})
      }
    },
    destroyed() {

    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .classify
      padding 1rem 3.2%
      color #333

  .privilege-wrapper
    position relative

    .slider-wrapper
      overflow hidden

      .item-wrapper
        height 14.281rem
        display flex
        justify-content flex-start
        flex-direction row
        flex-wrap wrap

        .item
          width 25%
          display flex
          flex-direction column
          align-items center
          .title
            font-size 0.813rem
            color #666
            padding 0.75rem 0 0.3rem
            text-align center

          .subhead
            font-size 0.688rem
            padding-bottom 1rem
            color #999
            padding-top 0.2345rem
            text-align center

          img
            height 3.125rem
            width 3.125rem
            border-radius 50%
</style>


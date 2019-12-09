<template>
  <div>
    <div class="privilege-wrapper">
      <div class="item-wrapper">
        <slider :dots-style="dotsStyle" class="slider-wrapper" :loop="false" :auto-play="false">
          <div class="item-wrapper" v-for="(item,index) in privilegeListData" :key="index">
            <div class="item" v-for="(i,index) in item" :key="index" @click.stop="jumplinkUrl(i.jumpUrl)">
              <img :src="i.icon" alt="">
              <div>
                <p class="title">{{ i.title }}</p>
                <p class="subhead" :class="[ paddingStyle ? 'subTitle' : '']">{{ i.subtitle }}</p>
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
        dotsStyle: 'line',
        privilegeListData: [],
        paddingStyle: false
      }
    },
    props: {
      privilegeList: {
        type: Array
      },
      title: {
        type: String,
        default: ''
      },
      showStyle: {
        type: String,
        default: 'single'
      }
    },
    components: {
      Slider
    },
    mounted() {
      if(this.showStyle == 'double'){
        if(this.privilegeList.length > 0){
          let pList = []
          for (var i = 0; i < Math.ceil(this.privilegeList.length / 8); i++) {
            pList.push([])
            pList[i] = this.privilegeList.slice(i * 8, i * 8 + 8)
          }
          this.privilegeListData = JSON.parse(JSON.stringify(pList))
        }
      }else{
        if(this.privilegeList.length > 0){
          let pList = []
          for (var i = 0; i < Math.ceil(this.privilegeList.length / 4); i++) {
            pList.push([])
            pList[i] = this.privilegeList.slice(i * 4, i * 4 + 4)
          }
          this.privilegeListData = JSON.parse(JSON.stringify(pList))
        }
        if(this.privilegeList && this.privilegeList.length > 4){
          this.paddingStyle = true
        }
      }
    },
    activated(){

    },
    beforeUpdate() {
      // console.log(this.showStyle)
      // if(this.showStyle == 'double'){
      //   if(this.privilegeList.length > 7){
      //     let pList = []
      //     for (var i = 0; i < Math.ceil(this.privilegeList.length / 8); i++) {
      //       pList.push([])
      //       pList[i] = this.privilegeList.slice(i * 8, i * 8 + 8)
      //     }
      //     this.privilegeListData = JSON.parse(JSON.stringify(pList))
      //   }else{
      //     this.privilegeListData = this.privilegeList
      //   }
      // }else{
      //   if(this.privilegeList.length > 3){
      //     let pList = []
      //     for (var i = 0; i < Math.ceil(this.privilegeList.length / 4); i++) {
      //       pList.push([])
      //       pList[i] = this.privilegeList.slice(i * 4, i * 4 + 4)
      //     }
      //     this.privilegeListData = JSON.parse(JSON.stringify(pList))
      //   }else{
      //     this.privilegeListData = this.privilegeList
      //   }
      // }
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
  .privilege-wrapper
    padding 0.75rem 0
    position relative

    .slider-wrapper
      overflow hidden

      .item-wrapper
        // height 14.281rem
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
            color rgba(61, 58, 57, 1)
            padding 0.75rem 0 0.25rem
            text-align center

          .subhead
            font-size 0.688rem
            color #999
            padding-top 0.1rem
            text-align center
          .subTitle
            padding-bottom 1rem

          img
            height 3.125rem
            width 3.125rem
            border-radius 50%
</style>


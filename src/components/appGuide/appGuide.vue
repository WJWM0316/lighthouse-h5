<template>
  <div class="fiexHeader">
    <div class="logoBox">
      <img src="../../assets/icon/applogo.png" alt="" />
      <div class="logoInfo">
        <h3 v-if="isToGuide">小灯塔</h3>
        <p v-show="isToGuide">职场人都在用的职场攻略进步神器</p>
        <p class="text" v-show="!isToGuide">
          在APP上获取最佳学习体验，更有海量职场话题等你发现~
        </p>
      </div>
    </div>
    <div class="appBtn" @click.stop="isToApp('Home_DLApp')" v-if="isToGuide">
      打开
    </div>
    <div class="appBtn guide" @click.stop="isToApp('Lesson_DLApp')" v-else>
      打开App<img src="../../assets/icon/btn.png" />
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import appGuide from '@/util/appGuide'
  import { statisticsCodeApi } from '@/api/common'
  @Component({
    props: {
      isToGuide: {
        type: Boolean,
        default: false
      }
    }
  })
  export default class appBtn extends Vue{
    isToApp (code) {
      statisticsCodeApi({code: code})
      let path = `ttbeacon://app:8080/launcher%3Ft%3D2%26id%3D${this.$route.params.communityId}`
      appGuide.isToApp(this.isToGuide, path)
    }
  }
</script>

<style lang="less" scoped>
  .fiexHeader{
    box-sizing: border-box;
    padding: 0 15px 0 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    /*width: 100%;*/
    height: 62px;
    background-color: #FBF9EF;
    .logoBox{
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: nowrap;
      color: #22292C;
      img{
        width: 44px;
        height: 44px;
        margin-right: 10px;
      }
      h3{
        font-size: 16px;
        font-weight: 700;
        text-align: left;
        line-height: 20px;
        margin: 0;
      }
      p{
        line-height: 16px;
        font-size: 12px;
        font-weight: 300;
        margin: 0;
      }
      .logoInfo{
        .text{
          color: #929292;
          font-size: 13px;
          font-weight: 300;
          span{
            white-space: nowrap;
          }
        }
      }
    }
    .appBtn{
      color: #22292C;
      font-size: 14px;
      font-weight: 400;
      width: 64px;
      height: 30px;
      background: #FFE266;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 15px;
      line-height: 30px;
      flex-shrink: 0;
    }
    .guide{
      width: 80px;
      white-space: nowrap;
      background: transparent;
      color: #D7AB70;
      font-size: 13px;
      margin-right: -8px;
      img{
        width: 10px;
        height: 11px;
        margin-left: 4px;
      }
    }
  }
</style>
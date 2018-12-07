<template>
  <div class="camp" @click.stop="toCamp">
    <div class="warp">
      <img :src="item.listImage" />
      <div class="time" v-if="item.remainDays !== 0">
        <p>开营倒计时</p>
        <strong>{{item.remainDays}}</strong><span>天</span>
        <img src="../../assets/icon/bg_xun_countdown@3x.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
@Component({
  props: {
    item: {
      type: Object
    }
  }
})
export default class camp extends Vue {
  toCamp () {
    console.log(this.item,8888888888)
    let url = ''
    if (this.item.isAuthor === 1 || this.item.isJoined === 1) {
      // 已加入
      url = `/introduce2/${this.item.communityId}/community`
    } else {
      // 未加入
      url = `/introduce2/${this.item.communityId}`
    }
    this.$router.push({path: url, query: {iscourse: 4}})
  }
}
</script>

<style lang="less" scoped="scoped">
.camp{
  box-sizing: border-box;
  padding: 0 15px;
  width: 100%;
  height: 100px;
  margin-bottom: 12px;
  .warp{
    border-radius: 3px;
    position: relative;
    width: 100%;
    height: 100%;
    img{
      width: 100%;
      height: 100%;
    }
    .time{
      z-index: 1;
      text-align: center;
      padding-top: 4px;
      position: absolute;
      top: 0px;
      right: 5px;
      width: 63px;
      height: 55px;
      font-size: 10px;
      color: #FFFFFF;
      font-weight: 300;
      img{
        width: 100%;
        height: 100%;
        z-index: -1;
        position: absolute;
        top: 0;
        left: 0;
      }
      p{
        line-height: 14px;
        margin-bottom: 2px;
      }
      strong{
        line-height: 20px;
        color: #FFE266;
        font-size: 24px;
        font-weight: 600;
      }
      span{
        line-height: 16px;
        font-size: 12px;
        font-weight: 500;
      }
    }
  }
}
</style>
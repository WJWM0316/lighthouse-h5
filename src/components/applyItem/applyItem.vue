<template>
  <div class="p-apply">
    <!--<img class="item-left" catchtap="handleTwo"-->
    <!--:src="item.avatarUrl || '../../static/icon/img_head_default.png'"-->
    <!--mode="aspectFill" catchtap="handleTwo">-->
    <!--<div class="item-middle">-->
    <!--<div class="item-middle-top fs30" catchtap="handleTwo">{{item.realName}}</div>-->
    <!--<div class="item-middle-middle fs30">{{item.reason}}</div>-->
    <!--</div>-->
    <!--<button-->
    <!--class="{{item.handleStatus === 0 && type === 1 ? 'item-right fs30 btn-common' : 'item-right fs30 not-btn button-reset'}}"-->
    <!--catchtap="handleFour">{{type === 1 ? otherToMeList[item.handleStatus] : meToOtherList[item.handleStatus]}}-->
    <!--</button>-->
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { XInput, XButton } from 'vux'
  import { testApi } from '@/api/pages/login'

  @Component({
    name: 'login-index',
    components: {
      XInput,
      XButton,
    },
    props: {
      item: {
        type: Object,
        twoWay: true
      },
      type: {
        type: Number,
        default: 1
      }
    }
  })
  export default class ApplyIndex extends Vue {
    report = true
    otherToMeList = ['同意', '已同意', '已拒绝']
    meToOtherList = ['等待通过', '已同意', '已拒绝']
    handleOne (e) { // 点击跳转申请详情
      this.$emit('tap-one', this.item.id, this.item.userId)
    }
    handleTwo (e) { // 点击跳转个人详情
//        this.$emit('tap-two', this.item.userId, this.item.LighthouseId)
    }
    handleThree (e) { // 跳转大咖社区
      this.$emit('tap-three', this.item.LighthouseId)
    }
    handleFour () { // 点击了同意
      if (this.item.handleStatus === 0 && this.type === 1) {
        this.$emit('tap-four', this.item.id, this.item.LighthouseId)
      }
    }
    created () {
    }

    mounted () {
    }
  }
</script>

<style lang="less" type="text/less">
  @import "../../styles/mixins";

  .apply-item {
    margin: 0 30px;
    padding: 40px 0;
    border-bottom: solid 1px #ededed;
    display: flex;
    align-items: center;
    .item-left {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      margin-right: 30px;
    }
    .item-middle {
      margin-right: 30px;
      width: 360px;
      .item-middle-top {
        color: #455683;
        .setEllipsis();
      }
      .item-middle-middle {
        .setEllipsis();
      }
      .item-middle-bottom {

        view:first-child {
          display: inline-block;
          color: #808080;
        }
        view:last-child {
          display: inline-block;
          color: #d69a54;
        }
        .item-middle-bottom-two {
          display: inline-block;
          .setEllipsis();
        }
      }

    }
    .item-right {
      text-align: center;
      width: 126px;
      height: 64px;
      line-height: 64px;
      padding: 0px;
    }
    .btn-common {
      text-align: center;
      line-height: 64px;
      border-radius: 32px;
      background: #ffe266;
    }
    .not-btn {
      color: #aeaeae;
    }

  }
</style>

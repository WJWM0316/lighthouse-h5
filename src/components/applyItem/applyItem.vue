<template>
  <div class="apply-item" @click="handleOne">
    <img class="item-left" @click.stop="handleTwo"
         :src="item.avatarUrl || '../../static/icon/img_head_default.png'">
    <div class="item-middle">
      <div class="item-middle-top fs15" @click.stop="handleTwo">{{item.realName}}</div>
      <div class="item-middle-middle fs15">{{item.reason}}</div>
    </div>
    <XButton
      :class="item.handleStatus === 0 && type === 1 ? 'item-right  btn-common' : 'item-right not-btn button-reset'"
      @click.stop="handleFour">{{type === 1 ? otherToMeList[item.handleStatus] : meToOtherList[item.handleStatus]}}
    </XButton>
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
    margin: 0 15px;
    padding: 20px 0;
    border-bottom: solid 1px #ededed;
    display: flex;
    align-items: center;
    .item-left {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-right: 15px;
    }
    .item-middle {
      margin-right: 15px;
      width: 180px;
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
      width: 63px;
      height: 32px;
      line-height: 32px;
      padding: 0px;
    }
    .btn-common {
      font-size: 15px;
      text-align: center;
      line-height: 32px;
      border-radius: 16px;
      background: #ffe266;
    }
    .not-btn {
      font-size: 15px;
      color: #aeaeae;
    }

  }
</style>

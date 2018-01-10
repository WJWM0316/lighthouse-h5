<template>
  <div class="p-apply">
    <!-- header -->
    <div class="header">
      <common-item  :item.sync='pageInfo'
                    @tap-one.user='goUserDetail'></common-item>
      <div class="reasion-title fs30">申请理由</div>
      <div class="user-input">
        <textarea placeholder="认真填写，对方才能感受到你的诚意哦~"
                  class="user-input-text"
                  maxlength="1000"
                  v-model="requestParams.reason"/>
        <div class="user-input-length">{{strLength}}/1000</div>
      </div>
      <div class="ask-btn" @click="exchangeWx" >确认申请</div>
      <div class="user-desc">
        <div>每天有 2 次申请交换微信的机会，今天剩余 <div class="residue">{{pageInfo.Remainder}}</div> 次</div>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { XInput, XButton } from 'vux'
  import {testApi} from '@/api/pages/login'
  import commonItem from '@/components/commonItem/commonItem'

  @Component({
    name: 'apply-index',
    components: {
      XInput,
      XButton,
      commonItem
    }
  })
  export default class ApplyIndex extends Vue {
    abc = ''
    created () {
    }
    mounted () {
    }
  }
</script>

<style lang="less" type="text/less">
  .p-apply {
    background-color: #f9f9f9;

    button:after {
      border-style: none;
    }

    .header {
      padding: 40rpx 30rpx;
      background-color: #fff;
      .reasion-title{
        margin-top: 40rpx;
        font-weight: 600;
      }
      & .userInfo {
        display: flex;
        font-size: 26rpx;
        color: #929292;
        margin-bottom: 40rpx;

        & text:first-of-type {
          font-size: 36rpx;
          margin-bottom: 16rpx;
          color: #354048;
          font-weight: 600;
        }
      }

      & .userInfo-img {
        width: 120rpx;
        height: 120rpx;
        background: pink;
        border-radius: 50%;
        position: relative;

        & .sex {
          position: absolute;
          width: 36rpx;
          height: 36rpx;
          bottom: 0;
          right: 0;
          border-radius: 50%;
        }
      }

      & .userInfo-desc {
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        margin-left: 30rpx;
      }

      & .user-input {
        margin-top: 20rpx;
        height: 280rpx;
        border-radius: 12rpx;
        background-color: #f9f9f9;
        border: solid 1rpx #dcdcdc;
        padding: 20rpx;
        position: relative;

        & .user-input-length {
          position: absolute;
          right: 30rpx;
          bottom: 20rpx;
          font-size: 24rpx;
          color: #bcbcbc;
        }

        & textarea {
          font-size: 30rpx;
          width: 100%;
          height: 100%;
        }
      }

      & .is-private {
        font-size: 28rpx;
        color: #d7ab70;
        margin-top: 20rpx;
      }

      & .ask-btn {
        margin-top: 40rpx;
        width: 650rpx;
        height: 88rpx;
        line-height: 88rpx;
        border-radius: 100rpx;
        background-color: #ffe266;
        font-size: 30rpx;
        color: #354048;
      }

      & .user-desc {
        margin-top: 24rpx;
        font-size: 24rpx;
        color: #bcbcbc;
        text-align: center;

        .residue {
          color: #d7ab70;
        }
      }
    }

    .container {
      margin-top: 20rpx;

      & .container-title {
        font-size: 34rpx;
        font-weight: 600;
        color: #354048;
        padding: 40rpx 30rpx 10rpx 30rpx;
        background: #fff;
      }
    }
  }
</style>


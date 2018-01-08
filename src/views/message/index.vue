<template>
  <div class="p-message-outer">
    <div class="exchange-wx" @click="goexChangeList">
      <div>交换微信申请</div>
      <div class="red-dot" v-if="isRead"></div>
      <img class="icon" style="margin-left: 10px;" src="./../../assets/icon/mypage_arrow.png">
    </div>
    <div class="space-line"></div>
    <div class="message-pannel fs15" v-if="dataList.length > 0">通知列表</div>
    <div class="message-container">
      <!--<repeat for='{{dataList}}' key='index' index='index' item='item'>-->
        <!--<message-item class='community-item'-->
                      <!--:item.sync='item'-->
                      <!--:itemIndex="index"-->
                      <!--@tap-one.user='goDetail'-->
                      <!--@tap-two.user='goUserDetail'-->
                      <!--@tap-three.user='goCommunityDetail'-->
                      <!--@tap-four.user='handleDetails'-->
                      <!--@audioEvent.user="audioEvent"-->
                      <!--@audioState.user="audioState"-->
                      <!--@videoEvent.user="videoEvent"-->
        <!--&gt;</message-item>-->
      <!--</repeat>-->
    </div>
    <div class="p-message" v-if="dataList.length === 0">
      <div class="icon-container">
        <img class="icon" :src="iconSrc">
      </div>
      <div class="text">暂时还没有消息哦～</div>
    </div>
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
    }
  })
  export default class ApplyIndex extends Vue {
    isRead = true
    iconSrc = 'http://cdnstatic.zike.com/Uploads/static/beacon/404.png'
    dataList = []
    goexChangeList () {
      this.$router.push({name: 'exchange-list'})
      console.log('goexChangeList')
    }

    created () {
    }

    mounted () {
    }
  }
</script>


<style lang="less" type="text/less">
  .p-message-outer {
    .space-line{
      width: 100%;
      height: 10px;
      background: #f8f8f8;
    }
    .message-pannel{
      font-weight:600;
      margin: 0 15px;
      padding: 15px 0;
      border-bottom: 2px solid #ededed;
    }
    .exchange-wx {
      font-weight: 500;
      margin: 0px 15px;
      padding: 15px 0;
      .red-dot {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: #ff3434;
        position: absolute;
        right: 37px;
        top: 18px;
      }
      .icon {
        width: 17px;
        height: 17px;
        border-style: none;
        position: absolute;
        right: 15px;
        top: 18px;
      }
    }

    .message-container {
    }
    .p-message {
      padding: 120px 15px 50px;
      text-align: center;
      .icon-container {
        margin-bottom: 18px;

        .icon {
          width: 130px;
          height: 130px;
        }
      }
      .text {
        line-height: 21px;
        font-size: 15px;
        color: #bcbcbc;
      }
    }

  }
</style>

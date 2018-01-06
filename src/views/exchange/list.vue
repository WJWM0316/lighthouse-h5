<template>
  <div class="p-exchange-list">
    <div class="toggle-tab fs15" :class="typeClassList[applyType -1]">
      <div @click="toggle(1)">我收到的申请</div>
      <div @clickp="toggle(2)">我发出的申请</div>
    </div>
    <div class="apply-list">
      <scroller @refresh="handleRefresh" @pullup="handlePullup">
      <div v-for='(item, index) in dataList'>
        <apply-item class='community-item'></apply-item>
      </div>
      </scroller>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import ApplyItem from '@/components/applyItem/applyItem'
  import { XInput, XButton } from 'vux'
  import ListMixin from '@/mixins/list'
  import { applyListApi, handleDetailsApi } from '../../api/pages/exchange.js'

  @Component({
    name: 'login-index',
    components: {
      XInput,
      XButton,
      ApplyItem
    },
    mixins: [ListMixin]
  })
  export default class ExchangeListIndex extends Vue {
    applyType = 1 // 类型：1我收到的申请，2我发出的申请
    typeClassList = ['one', 'two']
    dataList = [1, 2, 3, 4]
    iconSrc = 'http://cdnstatic.zike.com/Uploads/static/beacon/404.png'

    toggle (type) {
//      this.dataList = []
//      this.applyType = Number.parseInt(type)
//      this.pagination.end = false
//      this.getList({ page: 1 })
    }

    created () {
    }

    mounted () {
    }
  }
</script>

<style lang="less" type="text/less">
  .p-exchange-list {
    .toggle-tab {
      position: fixed;
      left: 15px;
      top: 0;
      right: 15px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      color: #929292;
      background: #fff;
      z-index: 99;

      & div {
        height: 40px;
        line-height: 40px;
      }
      &.one div:first-of-type,
      &.two div:last-of-type {
        color: #354048;
        font-weight: 500;
        position: relative;
      }
      &.one div:first-of-type:after,
      &.two div:last-of-type:after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 3px;
        border-radius: 1.5px;
        background-color: #ffe266;
      }
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
    .apply-list {
      padding-top: 44px;
    }
  }
</style>


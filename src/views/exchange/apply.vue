<template>
  <div class="p-apply">
    <!-- header -->
    <div class="header">
      <common-item :item='pageInfo'></common-item>
      <div class="reasion-title fs15">申请理由</div>
      <div class="user-input">
        <textarea placeholder="认真填写，对方才能感受到你的诚意哦~"
                  class="user-input-text"
                  maxlength="1000"
                  v-model="requestParams.reason"/>
        <div class="user-input-length">{{strLength}}/1000</div>
      </div>
      <div class="ask-btn" @click="exchangeWx">确认申请</div>
      <div class="user-desc">
        <div>每天有 2 次申请交换微信的机会，今天剩余
          <span class="residue">{{pageInfo.Remainder}}</span>
          次
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { XInput, XButton } from 'vux'
  import { surplusApi, exchangeWxApi } from '@/api/pages/exchange'
  import commonItem from '@/components/commonItem/commonItem'

  @Component({
    name: 'apply-index',
    components: {
      XInput,
      XButton,
      commonItem
    },
    computed: {
      'strLength': function () {
        return this.requestParams.reason.length
      }
    }
  })
  export default class ApplyIndex extends Vue {
    report = true
    countNum = 2
    pageInfo = {}
    requestParams = {
      uid: '',
      whereFrom: 1,
      whereid: '', // 来源id（若whereFrom是1，则这里为社区id）
      reason: ''
    }

    created () {
      const {userId, communityId} = this.$route.params
      this.requestParams['uid'] = userId
      this.requestParams['whereid'] = communityId
      this.getDetail()
    }

    mounted () {
    }

    async exchangeWx (e) { // 申请成功的时候，一天申请
      console.log('点击了发送按钮fuck', e.detail.formId)
      if (this.pageInfo.Remainder === 0) {
        this.$vux.toast.text('今天申请次数已用完', 'bottom')
        return
      }
      if (!this.requestParams.reason) {
        this.$vux.toast.text('请先填写申请理由', 'bottom')
        return
      }
      try {
        await exchangeWxApi({...this.requestParams})
        this.$vux.toast.text('申请成功', 'bottom')
      } catch (e) {
        this.$vux.toast.text(e.message, 'bottom')
      }
      setTimeout(() => {
        this.$router.go(-1)
      }, 2000)
    }

    async getDetail () {
      try {
        const resp = await surplusApi({userId: this.requestParams.uid})
        console.log('resp', resp)
        this.pageInfo = resp
      } catch (e) {
        this.$vux.toast.text(e.message, 'bottom')
      }
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
      padding: 20px 15px;
      background-color: #fff;
      .reasion-title {
        margin-top: 20px;
        font-weight: 600;
      }
      & .userInfo {
        display: flex;
        font-size: 13px;
        color: #929292;
        margin-bottom: 20px;

        & text:first-of-type {
          font-size: 13px;
          margin-bottom: 8px;
          color: #354048;
          font-weight: 600;
        }
      }

      & .userInfo-img {
        width: 60px;
        height: 60px;
        background: pink;
        border-radius: 50%;
        position: relative;

        & .sex {
          position: absolute;
          width: 18px;
          height: 18px;
          bottom: 0;
          right: 0;
          border-radius: 50%;
        }
      }

      & .userInfo-desc {
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        margin-left: 15px;
      }

      & .user-input {
        margin-top: 10px;
        height: 140px;
        border-radius: 6px;
        background-color: #f9f9f9;
        border: solid 1px #dcdcdc;
        padding: 10px;
        position: relative;

        & .user-input-length {
          position: absolute;
          right: 15px;
          bottom: 10px;
          font-size: 12px;
          color: #bcbcbc;
        }

        & textarea {
          font-size: 15px;
          border: transparent;
          width: 100%;
          height: 100%;
          background: #f9f9f9;
        }
      }

      & .is-private {
        font-size: 14px;
        color: #d7ab70;
        margin-top: 10px;
      }

      & .ask-btn {
        text-align: center;
        margin-top: 20px;
        width: 325px;
        height: 44px;
        line-height: 44px;
        border-radius: 50px;
        background-color: #ffe266;
        font-size: 15px;
        color: #354048;
      }

      & .user-desc {
        margin-top: 12px;
        font-size: 12px;
        color: #bcbcbc;
        text-align: center;

        .residue {
          color: #d7ab70;
        }
      }
    }

    .container {
      margin-top: 10px;

      & .container-title {
        font-size: 17px;
        font-weight: 600;
        color: #354048;
        padding: 20px 15px 5px 15px;
        background: #fff;
      }
    }
  }
</style>


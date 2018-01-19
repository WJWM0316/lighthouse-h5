<template>
  <div class="p-exchange-detail">
    <div class="header" v-if="!showRejectModal">
      <div class="userInfo">
        <div class="userInfo-img">
          <img class="headImg" :src="pageInfo.avatarUrl || defaultImg">
          <img class="sex"
               :src="pageInfo.gender === 1 ? boyImg : girlImg">
        </div>
        <div class="userInfo-desc">
          <div class="name">{{pageInfo.realName}}</div>
          <div class="persion-info">{{pageInfo.identify === 0 ? userCareer: pageInfo.career}}</div>
        </div>
      </div>
      <div class="item-list">
        <div class="item-info">
          <div class="item-info-left">申请理由</div>
          <div class="item-info-right item-border-top">
            {{pageInfo.reason}}
          </div>
        </div>
        <div class="item-info" v-if="!(pageInfo.handleStatus === 0 && applyType === 1)">
          <div class="item-info-left">申请状态</div>
          <div class="item-info-right">
            {{applyType === 1 ? otherToMeList[pageInfo.handleStatus] : meToOtherList[pageInfo.handleStatus]}}
          </div>
        </div>
        <div class="item-info" v-if="pageInfo.handleStatus === 1">
          <div class="item-info-left">对方微信</div>
          <div class="item-info-right">
            {{pageInfo.wechat}}
          </div>
        </div>
        <div class="item-info" v-if="pageInfo.handleStatus === 2 && applyType === 2">
          <div class="item-info-left">拒绝理由</div>
          <div class="item-info-right">
            {{pageInfo.refuseReason}}
          </div>
        </div>
      </div>
      <!--我收到的申请 并且是等我同意-->
      <div class="btn-group" v-if="pageInfo.handleStatus === 0 && applyType === 1">
        <div class="btn-item" @click="showReject(true)">拒绝</div>
        <div class="btn-item yellow-tan-bg" @click="handleDetails(1)">同意</div>
      </div>
    </div>
    <!--拒绝确认的框-->
    <div class="reject-container" v-else>
      <div class="user-input-s">
        <textarea placeholder="请填写拒绝理由"
                  class="user-input-text"
                  maxlength="100"
                  v-model="refuseReason"/>
        <div class="user-input-length">{{strLength}}/100</div>
      </div>
      <div class="btn-group">
        <div class="btn-item" @click="showReject(false)">取消</div>
        <div class="btn-item yellow-tan-bg" @click="handleDetails(2)">确定拒绝</div>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { XInput, XButton, Group, XTextarea } from 'vux'
  import { applyDetailsApi, handleDetailsApi } from '../../api/pages/exchange.js'

  @Component({
    name: 'exchange-detail-index',
    components: {
      XInput,
      XButton,
      Group,
      XTextarea
    },
    data () {
      return {
        report: true,
        otherToMeList: ['', '已同意', '已拒绝'],
        meToOtherList: ['等待通过', '对方已通过', '对方已拒绝'],
        showRejectModal: false,
        queryParams: {
          id: '',
          userId: '',
          type: 1
        },
        refuseReason: ''
      }
    },
    computed: {
      'applyType': function () {
        return parseInt(this.$route.params.type) || 1
      },
      'userCareer': function () {
        console.log('this.pageInfo', this.pageInfo)
        const {workTimeName, career, office} = this.pageInfo
        let careerStr = ''

        if (workTimeName) {
          careerStr += workTimeName
        }
        if (careerStr && career) {
          careerStr += ' | ' + career
        } else {
          careerStr += career
        }
        if (careerStr && office) {
          careerStr += ' | ' + office
        } else {
          careerStr += office
        }
        console.log('careerStr', careerStr)
        return careerStr
      },
      'strLength': function () {
        return this.refuseReason.length
      }
    }
  })
  export default class ExchangeDetailIndex extends Vue {
    girlImg = require('../../assets/icon/icon_girl.png') || ''
    boyImg = require('../../assets/icon/icon_boy.png') || ''
    defaultImg = require('../../assets/icon/img_head_default.png') || ''
    pageInfo = {
      LighthouseId: '',
      workTimeName: '',
      career: '',
      office: ''
    }

    created () {
      this.getDetail()
    }

    mounted () {
    }

    showReject (isShow) {
      console.log('isShow', isShow)
      if (isShow) {
        this.refuseReason = ''
        this.showRejectModal = true
      } else {
        this.refuseReason = ''
        this.showRejectModal = false // 隐藏拒绝框
      }
    }

    async handleDetails (isAgree) { // 直接同意申请
      const isAgreeNum = Number.parseInt(isAgree)
      const {id, LighthouseId} = this.$route.params
      try {
        await handleDetailsApi({id, LighthouseId, handleStatus: isAgreeNum, refuseReason: this.refuseReason})
        this.$vux.toast.text(isAgreeNum === 1 ? '已同意申请' : '已拒绝申请', 'bottom')
        this.getDetail()
      } catch (e) {
        this.$vux.toast.text(e.message, 'bottom')
      }
    }

    async getDetail () {
      this.showRejectModal = false
      const {id, userId, type} = this.$route.params
      console.log(id, userId, type)
      try {
        const resp = await applyDetailsApi({id, applyFrom: type})
        console.log('resp', resp)
        this.pageInfo = resp
      } catch (e) {
        this.$vux.toast.text(e.message, 'bottom')
      }
    }
  }
</script>


<style lang="less" type="text/less">
  @import "../../styles/mixins";

  .p-exchange-detail {
    background-color: #f9f9f9;

    button:after {
      border-style: none;
    }

    .header {
      padding: 20px 15px;
      background-color: #fff;

      .userInfo {
        display: flex;
        font-size: 13px;
        color: #929292;
        margin-bottom: 20px;
        div:first-of-type {
          font-size: 18px;
          margin-bottom: 8px;
          color: #354048;
          font-weight: 600;
        }

        .userInfo-img {
          position: relative;
          .headImg {
            width: 60px;
            height: 60px;
            background: pink;
            border-radius: 50%;
          }
          .sex {
            position: absolute;
            width: 18px;
            height: 18px;
            bottom: 0;
            right: 0;
            border-radius: 50%;
          }
        }

      }

      .userInfo-desc {
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        margin-left: 15px;

        .name {
          .setEllipsis(270px);
        }

        .persion-info {
          .setEllipsis(270px);
        }

      }
      &
      .item-list {

        .item-info {
          display: flex;
          position: relative;

          .item-border-top {
            border-top: solid 1px #ededed;
          }

          .item-info-left {
            padding: 20px 0;
            img-align: end;
            width: 90px;
            color: #929292;
            margin-right: 15px;
          }

          .item-info-right {
            width: 100%;
            padding: 20px 0;
            color: #354048;
            border-bottom: solid 1px #ededed;
          }

          .copy-btn {
            color: #d7ab70;
            position: absolute;
            right: 0;
            top: 20px;
          }

        }
      }
    }
    .btn-group {
      padding-top: 40px;
      display: flex;
      justify-content: space-around;
      background: #fff;
      align-items: center;
      .btn-item {
        font-size: 16px;
        width: 155px;
        height: 44px;
        border-radius: 22px;
        background-color: #ededed;
        display: flex;
        align-items: center;
        justify-content: center;
      }

    }
    .reject-container {
      padding: 15px;
      background: #fff;

      .user-input-s {
        margin-top: 20px;
        height: 140px;
        border-radius: 6px;
        border: solid 1px #dcdcdc;
        padding: 10px;
        position: relative;

        .user-input-length {
          position: absolute;
          right: 15px;
          bottom: 10px;
          font-size: 12px;
          color: #bcbcbc;
        }

        textarea {
          width: 100%;
          height: 100%;
          border: transparent;
        }

      }
    }
  }
</style>

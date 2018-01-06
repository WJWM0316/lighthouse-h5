<template>
  <div class="p-exchange-detail">
    <div>申请详情页</div>
    <!--<div class="header" v-if="!showRejectModal">-->
      <!--<div class="userInfo">-->
        <!--<div class="userInfo-img">-->
          <!--<img class="headImg" :src="pageInfo.avatarUrl || '../../static/icon/img_head_default.png'">-->
          <!--<img class="sex"-->
               <!--:src="pageInfo.gender === 1 ? '../../static/icon/icon_boy.png' : '../../static/icon/icon_girl.png'">-->
        <!--</div>-->
        <!--<div class="userInfo-desc">-->
          <!--<div class="name">{{pageInfo.realName}}</div>-->
          <!--<div class="persion-info">{{pageInfo.identify === 0 ? userCareer: pageInfo.career}}</div>-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="item-list">-->
        <!--<div class="item-info">-->
          <!--<div class="item-info-left">-->
            <!--申请理由-->
          <!--</div>-->
          <!--<div class="item-info-right item-border-top">-->
            <!--{{pageInfo.reason}}-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="item-info" v-if="!(pageInfo.handleStatus === 0 && queryParams.type === 1)">-->
          <!--<div class="item-info-left">申请状态</div>-->
          <!--<div class="item-info-right">-->
            <!--{{queryParams.type === 1 ? otherToMeList[pageInfo.handleStatus] : meToOtherList[pageInfo.handleStatus]}}-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="item-info" v-if="pageInfo.handleStatus === 1">-->
          <!--<div class="item-info-left">对方微信</div>-->
          <!--<div class="item-info-right">-->
            <!--{{pageInfo.wechat}}-->
          <!--</div>-->
          <!--<div class="copy-btn" @tap="copyWx">复制</div>-->
        <!--</div>-->
        <!--<div class="item-info" v-if="pageInfo.handleStatus === 2 && queryParams.type === 2">-->
          <!--<div class="item-info-left">拒绝理由</div>-->
          <!--<div class="item-info-right">-->
            <!--{{pageInfo.refuseReason}}-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
      <!--&lt;!&ndash;我收到的申请 并且是等我同意&ndash;&gt;-->
      <!--<div class="btn-group" v-if="pageInfo.handleStatus === 0 && queryParams.type === 1">-->
        <!--<XButton class="btn-item" @click=="showReject(true)">拒绝</XButton>-->
        <!--<XButton  class="btn-item yellow-tan-bg" @click="handleDetails(1)">同意</XButton>-->
      <!--</div>-->
    <!--</div>-->
    <!--拒绝确认的框-->
    <!--<div class="reject-container" v-else>-->
    <!--<div class="user-input-s">-->
    <!--<imgarea placeholder="请填写拒绝理由"-->
    <!--class="user-input-img"-->
    <!--placeholder-style="color: #bcbcbc;"-->
    <!--maxlength="100"-->
    <!--bindinput="bindKeyInput"-->
    <!--value="{{refuseReason}}"/>-->
    <!--<img class="user-input-length">{{strLength}}/100</img>-->
    <!--</div>-->
    <!--<div class="btn-group">-->
    <!--<button class="btn-item" @tap="showReject(false)">取消</button>-->
    <!--<form report-submit="{{report}}" @submit="handleDetails(2)">-->
    <!--<button form-type="submit" class="btn-item yellow-tan-bg">确定拒绝</button>-->
    <!--</form>-->
    <!--</div>-->
    <!--</div>-->
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
        pageInfo: {
          LighthouseId: ''
        },
        refuseReason: ''
      }
    },
    computed: {
      'userCareer': () => {
        console.log('this.pageInfo', this.pageInfo)
        const {workTimeName, career, office} = this.pageInfo
        console.log('career', career)
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
      'strLength': () => {
        return this.refuseReason.length
      }
    }
  })
  export default class ExchangeDetailIndex extends Vue {
    created () {
    }

    mounted () {
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
      padding: 40px 30px;
      background-color: #fff;

      &.userInfo {
        display: flex;
        font-size: 26px;
        color: #929292;
        margin-bottom: 40px;

        &
        img:first-of-type {
          font-size: 36px;
          margin-bottom: 16px;
          color: #354048;
          font-weight: 600;
        }

      }

      &
      .userInfo-img {
        position: relative;

        .headImg {
          width: 120px;
          height: 120px;
          background: pink;
          border-radius: 50%;
        }

        &
        .sex {
          position: absolute;
          width: 36px;
          height: 36px;
          bottom: 0;
          right: 0;
          border-radius: 50%;
        }

      }

      &
      .userInfo-desc {
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        margin-left: 30px;

        .name {
          width: 540px;
          .setEllipsis();
        }

        .persion-info {
          width: 540px;
          .setEllipsis();
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
            padding: 40px 0;
            img-align: end;
            width: 180px;
            color: #929292;
            margin-right: 30px;
          }

          .item-info-right {
            width: 100%;
            padding: 40px 0;
            color: #354048;
            border-bottom: solid 1px #ededed;
          }

          .copy-btn {
            color: #d7ab70;
            position: absolute;
            right: 0;
            top: 40px;
          }

        }
      }
    }
    .btn-group {
      padding-top: 80px;
      display: flex;
      justify-content: space-around;
      background: #fff;

      .btn-item {
        font-size: 32px;
        width: 310px;
        height: 88px;
        border-radius: 45px;
        background-color: #ededed;
      }

    }
    .reject-container {
      padding: 30px;
      background: #fff;

      .user-input-s {
        margin-top: 40px;
        height: 280px;
        border-radius: 12px;
        border: solid 1px #dcdcdc;
        padding: 20px;
        position: relative;

        .user-input-length {
          position: absolute;
          right: 30px;
          bottom: 20px;
          font-size: 24px;
          color: #bcbcbc;
        }

        imgarea {
          width: 100%;
        }

      }
    }
  }
</style>

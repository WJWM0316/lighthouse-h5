<template>
  <div class="p-body p-center-index">
    <div class="header">
      <div class="left">
        <p class="username">{{model.realName}}</p>
        <p class="job-info">
          {{model.workTimeName}}
          <template v-if="model.workTimeName && (model.career || model.office)"> | </template>
          {{model.career}}
          <template v-if="model.career && model.office"> | </template>
          {{model.office}}
        </p>
        <router-link class="edit-btn" to="/center/editinfo">点击编辑资料</router-link>
      </div>
      <div class="right">
        <image-item class="head" mode="horizontal" :src="model.avatarUrl || require('@/assets/icon/img_head_default.png')" />
      </div>
    </div>

    <div class="navs">
      <a href="#" class="item" @click.prevent.stop="handleCreate">
        <div class="left">
          <i class="icon u-icon-center-create" />
          <span class="title">{{model.isCommunity ? '塔主中心' : '创建我的灯塔'}}</span>
        </div>
        <div class="addon">
          <i class="addon-icon u-icon-center-angle-right" />
        </div>
      </a>
      <router-link :to="`/userInfo/${model.userId}/details`" class="item">
        <div class="left">
          <i class="icon u-icon-center-home" />
          <span class="title">我的主页</span>
        </div>
        <div class="addon">
          <i class="addon-icon u-icon-center-angle-right" />
        </div>
      </router-link>
      <router-link :to="`/center/help`" class="item">
        <div class="left">
          <i class="icon u-icon-center-help" />
          <span class="title">使用帮助</span>
        </div>
        <div class="addon">
          <i class="addon-icon u-icon-center-angle-right" />
        </div>
      </router-link>
      <router-link :to="`/center/protocol`" class="item">
        <div class="left">
          <i class="icon u-icon-center-protocol" />
          <span class="title">用户协议</span>
        </div>
        <div class="addon">
          <i class="addon-icon u-icon-center-angle-right" />
        </div>
      </router-link>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'

import { getInformationApi } from '@/api/pages/center'

@Component({
  name: 'center-index'
})
export default class HomeIndex extends Vue {
  model = {
  }

  created () {
    this.getModel()
  }

  async getModel () {
    try {
      this.model = await getInformationApi()
    } catch (error) {
      this.$vux.toast.text(error.message, 'bottom')
    }
  }

  /**
   * 创建灯塔
   */
  handleCreate () {
//    this.$router.push({name: 'center-create'})
    this.$vux.alert.show({
      title: '创建灯塔请联系',
      content: '小灯塔客服：020-28163063或添加客服微信：zike02',
      buttonText: '好的'
    })
  }
}
</script>

<style lang="less" type="text/less">
@import "../../styles/variables";
@import "../../styles/mixins";

.p-center-index {
  .header {
      .setFlex();
      margin-bottom: 20px;
      padding: 30px;
      line-height: 23px;
      font-size: 13px;

      .left {
        flex: 1 1 auto;

        .username {
          display: block;
          line-height: 26px;
          font-size: 20px;
          font-weight: bold;
        }

        .job-info {
          display: block;
          margin-bottom: 9px;
          color: #929292;
        }

        .edit-btn {
          display: inline-block;
          line-height: 19px;
          color: #d7ab70;
        }
      }

      .right {
        flex: 0 0 auto;
        font-size: 0;
        line-height: 1;

        .head {
          // background: #ccc;
          width: 80px;
          height: 80px;
          border-radius: 50%;
        }
      }
    }

    .navs {

      .item {
        .setFlex();
        padding: 20px 30px;
        line-height: 20px;
        font-size: 15px;
        color: @font-color-default;

        &:active {
          background: #f1f1f1;
        }

        .left {
          flex: 1 1 auto;

          .icon,
          .title {
            vertical-align: middle;
          }

          .icon {
            position: static;
            top: auto;
          }

          .title {
            display: inline-block;
            padding: 0 15px;
          }
        }

        .addon {
          flex: 0 0 auto;

          .addon-icon {
            position: static;
            top: auto;
            vertical-align: middle;
          }
        }
      }
    }
}
</style>

<template>
  <div class="p-body p-center-editinfo">
    <div class="top">
      <div class="panel">
        <image-item class="icon" :src="require('@/assets/icon/icon_smile.png')" />
        <p class="text">听说所有信息填写完善的用户都能得到导师的青睐~</p>
      </div>
      <p class="tips">* 小灯塔与自客账号共通，保存的信息会同步到自客。</p>
    </div>

    <div class="form">
      <div class="head form-group">
        <label class="label">
          <span class="asterisk">*</span>
          <span class="text">头像</span>
        </label>
        <div class="control-container">
          <image-item class="img-control" :src="form.avatarUrl || require('@/assets/icon/img_head_default.png')" mode="horizontal" />
        </div>
      </div>

      <div class="username form-group">
        <label class="label" for="realname">
          <span class="asterisk">*</span>
          <span class="text">姓名</span>
        </label>
        <div class="control-container">
          <input id="realname" class="control" type="text" placeholder="请填写姓名" v-model="form.realName" />
        </div>
      </div>

      <div class="gender form-group">
        <label class="label" for="gender">
          <span class="asterisk">*</span>
          <span class="text">性别</span>
        </label>
        <div class="control-container">
          <popup-picker :show.sync="showGenderPopupPicker" :show-cell="false" :data="genders" v-model="form.gender" />
          <input id="gender" class="control" type="text" placeholder="请选择性别" :value="genderText" readonly @click="handleShowGenderPopupPicker" />
        </div>
      </div>

      <div class="work-years form-group">
        <label class="label" for="workTime">
          <span class="asterisk">*</span>
          <span class="text">工作年限</span>
        </label>
        <div class="control-container">
          <!-- <popup-picker :show.sync="showPopupPicker" :show-cell="false" :data="[['1', '2', '3', '4', '5']]" v-model="value5"> -->
          <input id="workTime" class="control" type="text" placeholder="请选择工作年限" v-model="form.workTime" readonly />
        </div>
      </div>

      <div class="jobs form-group">
        <label class="label" for="career">
          <span class="asterisk">*</span>
          <span class="text">职业</span>
        </label>
        <div class="control-container">
          <input id="career" class="control" type="text" placeholder="请填写职业" v-model="form.career" />
        </div>
      </div>

      <div class="jobs form-group">
        <label class="label" for="office">
          <span class="asterisk">*</span>
          <span class="text">最近任职公司</span>
        </label>
        <div class="control-container">
          <input id="office" class="control" type="text" placeholder="请填写最近任职公司" v-model="form.office" />
        </div>
      </div>

      <div class="jobs form-group">
        <label class="label" for="phone">
          <span class="asterisk">*</span>
          <span class="text">手机号</span>
        </label>
        <div class="control-container">
          <input id="phone" class="control" type="number" placeholder="请填写手机号" maxlength="11" v-model="form.phone" disabled />
        </div>
      </div>

      <div class="jobs form-group">
        <label class="label" for="wechat">
          <span class="asterisk">*</span>
          <span class="text">微信号</span>
        </label>
        <div class="control-container">
          <input id="wechat" class="control" type="text" placeholder="请填写微信号" maxlength="20" v-model="form.weChat" />
        </div>
      </div>
    </div>

    <div class="btn-container">
      <button class="u-btn-save" @tap="handleSave">保存</button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { genderOptions } from '@/config/options'

import { PopupPicker } from 'vux'

import { getGeneralListApi } from '@/api/common'

@Component({
  name: 'center-editinfo',
  components: {
    PopupPicker
  }
})
export default class CenterEditinfo extends Vue {
  // 表单
  form = {
    avatarUrl: '', // 头像
    realName: '', // 用户姓名
    gender: [0], // 性别(0保密，1男，2女)
    workTime: '', // 自客工作年限id
    career: '', // 职业，头衔
    office: '', // 任职公司
    phone: '', // 手机号
    weChat: '' // 微信号
  }

  // 性别选项
  genders = [[
    {
      name: '男',
      value: 1
    },
    {
      name: '女',
      value: 2
    }
  ]]

  showGenderPopupPicker = false

  get genderText () {
    return genderOptions[this.form.gender[0]]
  }

  created () {
    this.getPageData()
  }

  async getPageData () {
    try {
      const res = await getGeneralListApi({ type: 3 })
      console.log(res)
    } catch (error) {
      this.$vux.toast.text(error.message, 'middle')
    }
  }

  handleShowGenderPopupPicker () {
    this.showGenderPopupPicker = true
  }

  handleSave () {}
}
</script>

<style lang="less" scoped>
@import "../../styles/variables";
@import "../../styles/mixins";

.p-center-editinfo {
  padding: 10px 15px 100px;

  .top {
    .panel {
      .setFlex();
      padding: 5px 20px;
      margin-bottom: 7px;
      background: #fffdf3;
      line-height: 19px;
      border-radius: 6px;
      font-size: 13px;
      color: #929292;

      .icon {
        flex: 0 0 auto;
        width: 50px;
        height: 50px;
      }

      .text {
        padding-left: 15px;
        padding-top: 6px;
      }
    }

    .tips {
      display: inline-block;
      width: 100%;
      line-height: 20px;
      font-size: 12px;
      color: #bcbcbc;
    }
  }

  .form {

    .form-group {
      display: flex;
      align-items: center;
      padding: 12px 0;
      line-height: 27px;
      border-bottom: solid 1px #dcdcdc; /* no */
      font-size: 15px;

      &.head {
        padding: 15px 0;

        .control-container {
          line-height: 1;
          font-size: 0;
        }
      }

      .label {
        flex: 0 0 auto;
        color: #666;

        .asterisk {
          margin-right: 9px;
          color: #d7ab70;
        }
      }

      .control-container {
        flex: 1 1 auto;
        padding-left: 15px;
        text-align: right;
      }

      .img-control {
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }

      .control {
        background: none;
        height: 21px;
        border: none;
        text-align: right;
      }
    }
  }

  .btn-container {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 12px 20px;
    background: #fff;
    border-top: solid 1px #ededed; /* no */
    z-index: 10;

    .u-btn-save {
      padding: 10px;
      background: #ffe266;
      width: 100%;
      line-height: 24px;
      border-radius: 22px;
      font-size: 15px;
      color: #354048;

      &::after {
        content: none;
      }
    }
  }
}
</style>


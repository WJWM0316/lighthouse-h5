<template>
  <div class="p-phone-login">
    <div class="img-container">
      <img src="../../assets/icon/login-logo.png" class="lh-logo">
    </div>
    <div class="input-group">
      <div class="section">
        <x-input placeholder="手机号"
                 type="tel"
                 :max="11"
                 v-model="info.mobile"
                 :show-clear="showClear"
                 class="input-common"></x-input>
      </div>
      <div class="section" style="position: relative" v-if="needImgCode">
        <x-input placeholder="图片验证码" v-model="info.verifyCode"
                 class="input-common"
                 :max="4" :show-clear="showClear">
          <img slot="right" class="weui-vcode-img" :src="codeImgUrl"
               @click="refreshCode">
        </x-input>
      </div>
      <div class="section" style="position: relative">
        <x-input placeholder="输入短信验证码" v-model="info.sms"
                 :show-clear="showClear"
                 type="tel"
                 :max="6"
                 class="login-input">
          <span slot="right" class="send-code">
            <time-btn ref="timerBtn" :login-info="info" @send="onSend"
                      :second="60" class="login-code-timer"
                      :type="sendSmsType"></time-btn>
          </span>
        </x-input>
      </div>
      <div type="primary" class="login-btn"
           :class="loginBtnValid ? '' : 'btn-disabled'"
           :disabled="!loginBtnValid"
           @click="goSubmit"
      >登录
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Group, XInput, XButton } from 'vux'
  import uuid from 'uuid'
  import TimeBtn from '@/components/pageCommon/timerBtn/TimeBtn.vue'
  import { loginApi, getCodeImg, isNeedGrantApi } from '@/api/pages/login'
  import brower from '@/util/browser/index'
  import settings from '@/config'

  @Component({
    name: 'login-index',
    components: {
      Group,
      XInput,
      XButton,
      TimeBtn
    }
  })
  export default class LoginIndex extends Vue {
    sendSmsType = 9 // 6.小程序登录,9微信浏览器小灯塔登录
    isComplete = false // 是否显示完善资料页面
    showClear = false // 输入框是否显示清空的按钮
    isLogin = true // 是否为登录
    isLoginEnabled = false // 登录按钮能不能点击
    isCommitInfo = false // 是否已经请求完善资料接口
    requestId = '' // 随机数
    codeImgUrl = '' // 验证码图片
    needImgCode = false // 是否需要手机验证码
    info = {
      mobile: '',
      sms: '',
      verifyCode: '',
      loginType: 2,
      from: '' // 1 注册 2 登录
    }

    async created () {
      this.refreshCode()
      const resp = await isNeedGrantApi() // 请求后端看需要手动获取授权
      if (brower.isWechat() && resp.isJump) {
        const hashParams = location.hash.substring(1)
        const hostname = location.href.split('?')[0]
        location.href = `${settings.serverUrl}/wap/wechat/snsapiUserinfo?zike_from=${hostname}&key=${hashParams}`
      }
    }

    onSend (imgcodeUrl) { // 显示图片验证码
      this.refreshCode()
//    console.log('send', imgcodeUrl)
//    this.needImgCode = true
//    this.codeImgUrl = imgcodeUrl
    }

    mounted () {
    }

    async refreshCode () {
      try {
        const resp = await getCodeImg()
        if (resp.imgcodeUrl) {
          this.codeImgUrl = resp.imgcodeUrl
          this.needImgCode = true
        }
      } catch (e) {
        this.$vux.toast.text(e.message, 'bottom')
      }
    }

    get loginBtnValid () {
      return this.info.mobile && this.info.sms
    }

    async goSubmit () {
      try {
        const resp = await loginApi(this.info)
        this.$store.dispatch('update_userinfo', {
          userinfo: resp
        })
        console.log('this.$route.query.redirect', this.$route.query.redirect)
        window.location.href = this.$route.query.redirect
      } catch (e) {
        this.$vux.toast.text(e.message, 'bottom')
      }
    }
  }
</script>

<style lang="less" type="text/less">
  .p-phone-login {
    .weui-cell {
      padding: 15px 0;
    }
    .img-container {
      text-align: center;
      padding-top: 50px;
      .lh-logo {
        width: 70px;
        height: 70px;
        background: pink;
        border-radius: 50%;
      }
    }
    .input-group {
      margin: 0 25px;
      padding-top: 25px;
      .section {
        margin-top: 25px;
        border-bottom: 1px solid #dcdcdc; /* no */

        .input-common {
          line-height: 20px;
          font-size: 16px;
        }
        .short-input {
          width: 200px;
        }
        .code-img {
          position: absolute;
          right: 0;
          top: 0;
          width: 90px;
          height: 30px;
        }
        .counter {
          position: absolute;
          right: 0;
          top: 2px;
          padding-right: 0;
          font-size: 16px;
          line-height: 20px;
          color: #d7ab70;
        }

      }
      .login-btn {
        width: 325px;
        height: 44px;
        background: #ffe266;
        border-radius: 50px;
        border: none;
        line-height: 44px;
        font-size: 15px;
        margin-top: 40px;
        text-align: center;
        color: rgba(0, 0, 0, 0.8);
        &::after {
          content: none;
        }
      }

      .login-btn-hover {
        background: #e5ca5b;
      }

      .btn-disabled {
        color: rgba(0, 0, 0, 0.3);
        background: rgba(255, 226, 102, .5);
      }
    }
    .weui-vcode-img {
      width: 90px;
      height: 30px;
    }
  }
</style>


import Vue from 'vue'
import Component from 'vue-class-component'
import { smsApi } from '@/api/pages/login'

@Component({
  name: 'timerBtn',
  props: {
    type: { // 6.小程序登录,9微信浏览器小灯塔登录
      type: Number,
      default: 9
    },
    loginInfo: {
      type: Object
    },
    second: {
      type: Number,
      default: 60
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
})
export default class TimeBtn extends Vue {
  time = 0
  timeFlag = false

  async runs () {
    if (this.time > 0) return
    if (!this.loginInfo.mobile) {
      this.$vux.toast.text('请输入手机号码', 'bottom')
    } else if (this.loginInfo.mobile.length !== 11) {
      this.$vux.toast.text('手机号码格式不对', 'bottom')
    } else {
      try {
        const params = {...this.loginInfo, from: this.type}
        await smsApi(params)
        this.$vux.toast.text('验证码发送成功，<br>请留意短信', 'bottom')
        this.time = this.second
        this.timeFlag = true
        this.timer()
      } catch (e) {
        this.$vux.toast.text(e.message, 'bottom')
        if (e.data && e.data.imgcodeUrl) this.$emit('send', e.data.imgcodeUrl)
      }
    }
  }

  timer () {
    if (this.time > 0) {
      this.time--
      setTimeout(this.timer, 1000)
    }
  }

  get text () {
    if (this.timeFlag === false) {
      return '获取验证码'
    } else {
      return this.time > 0 ? this.time + 's' : '重新获取'
    }
  }

  get style () {
    if (this.time > 0) {
      return 'phone-verifcode-out'
    } else {
      return 'phone-verifcode'
    }
  }
}

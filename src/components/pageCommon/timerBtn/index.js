import Vue from 'vue'
import Component from 'vue-class-component'
import { smsApi } from '@/api/pages/account'

@Component({
  name: 'timerBtn',
  props: {
    type: { // 1是求职者注册和第一步注册 2是企业端申请 3是求职者登录 4猎头端注册 5猎头端登录 6是企业端登录
      type: Number,
      default: 1
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
      this.$vux.toast.text('请输入手机号码', 'middle')
    } else if (this.loginInfo.mobile.length !== 11) {
      this.$vux.toast.text('手机号码格式不对', 'middle')
    } else {
      try {
        const params = {...this.loginInfo, from: this.type}
        await smsApi(params)
        this.$vux.toast.show({
          text: '验证码发送成功，<br>请留意短信',
          position: 'middle',
          time: 800,
          type: 'text'
        })
        this.time = this.second
        this.timeFlag = true
        this.timer()
      } catch (e) {
        this.$vux.toast.text(e.message, 'middle')
        if (e.data && e.data.imgcode_url) this.$emit('send', e)
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

// 微信jssdk mixin
import { getWechatSign } from '@/api/common'

export default {
  data () {
    return {
      wechatConfig: {
        debug: true,
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'chooseWXPay']
      }
    }
  },

  methods: {
    /**
     * 获取微信签名
     */
    async getWechatSign () {
      const params = {
        url: location.href.split('#')[0]
      }
      const res = await getWechatSign(params)
      this.wechatConfig = Object.assign({}, this.wechatConfig, res)
      this.setWechatConfig()
    },

    /**
     * 配置微信sdk
     */
    setWechatConfig () {
      this.$wechat.config(this.wechatConfig)
    },

    wechatChooseImage (options) {
      return new Promise((resolve, reject) => {
        this.$wechat.chooseImage({
          count: options.count || 9, // 默认9
          sizeType: options.sizeType || ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: options.sourceType || ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            resolve(res)
            var localIds = res.localIds // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          }
        })
      })
    }
  },

  created () {
    this.getWechatSign()
  }
}

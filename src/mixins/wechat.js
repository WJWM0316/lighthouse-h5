// 微信jssdk mixin
import { getWechatSign } from '@/api/common'

export default {
  data () {
    return {
      wechatConfig: {
        debug: true,
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'chooseWXPay']
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

    /**
     * 选择图片
     * @param {*} options
     */
    wechatChooseImage (options = {}) {
      return new Promise((resolve, reject) => {
        this.$wechat.chooseImage({
          count: options.count || 9, // 默认9
          sizeType: options.sizeType || ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: options.sourceType || ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            resolve(res)
            // const localIds = res.localIds // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          },
          fail: function (e) {
            reject(e)
          }
        })
      })
    },

    /**
     * 微信上传图片
     * @param {*} localId 需要上传的图片的本地ID，由chooseImage接口获得
     * @param {*} options
     */
    wechatUploadImage (localId, options = {}) {
      return new Promise((resolve, reject) => {
        this.$wechat.uploadImage({
          localId: '',
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function (res) {
            resolve(res)
            // const serverId = res.serverId // 返回图片的服务器端ID
          },
          fail: function (e) {
            reject(e)
          }
        })
      })
    }
  },

  created () {
    this.getWechatSign()
  }
}

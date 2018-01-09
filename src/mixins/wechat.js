// 微信jssdk mixin
import { getWechatSign } from '@/api/common'

export default {
  data () {
    return {
      wechatConfig: {
        debug: false,
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'chooseWXPay']
      }
    }
  },

  methods: {
    /**
     * 获取微信签名
     */
    async getWechatSign () {
      try {
        const params = {
          url: location.href.split('#')[0]
        }
        const res = await getWechatSign(params)
        this.wechatConfig = Object.assign({}, this.wechatConfig, res)
        this.setWechatConfig()
      } catch (error) {
        this.$vux.toast.text(error.message, 'middle')
      }
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
          localId: localId,
          isShowProgressTips: options.isShowProgressTips || 0, // sdk默认为1，显示进度提示
          success: function (res) {
            resolve(res)
            // const serverId = res.serverId // 返回图片的服务器端ID
          },
          fail: function (e) {
            reject(e)
          }
        })
      })
    },

    /**
     * 微信上传语音
     * @param {*} localId
     * @param {*} options
     */
    wechatUploadVoice (localId, options = {}) {
      return new Promise((resolve, reject) => {
        this.$wechat.uploadVoice({
          localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
          isShowProgressTips: options.isShowProgressTips || 1, // 默认为1，显示进度提示
          success: function (res) {
            // const serverId = res.serverId // 返回音频的服务器端ID
            resolve(res)
          },
          fail: function (e) {
            reject(e)
          }
        })
      })
    },

    /**
     * 获取一个微信的录音对象
     * @return {Object}
     */
    getWechatRecorder () {
      const self = this
      let _localId = ''
      return {
        /**
         * 触发回调
         * @param {*} callback
         */
        triggerCallback (callback, ...options) {
          if (this[callback] && this[callback] instanceof Function) {
            this[callback](...options)
          }
        },

        /**
         * 开始录音
         * @return {Promise}
         */
        startRecord () {
          self.$wechat.startRecord({
            success: () => {
              this.triggerCallback('onStartRecord')
              self.$wechat.onVoiceRecordEnd({
                // 录音时间超过一分钟没有停止的时候会执行 complete 回调
                complete: res => {
                  _localId = res.localId
                  this.triggerCallback('onRecordEnded', res)
                }
              })
            }
          })
        },

        /**
         * 停止录音
         * @return {Promise}
         */
        stopRecord () {
          self.$wechat.stopRecord({
            success: res => {
              _localId = res.localId
              console.log(res)
              alert(...res)
              this.triggerCallback('onStopRecord', res)
            }
          })
        },

        /**
         * 微信播放录音
         */
        playVoice (localId) {
          localId = localId || _localId
          if (!localId) {
            console.log('没有找到localId')
            return
          }
          self.$wechat.playVoice({
            localId: localId, // 需要播放的音频的本地ID，由stopRecord接口获得
            success: () => {
              this.triggerCallback('onPlayVoice')
            }
          })
          self.$wechat.onVoicePlayEnd({
            success: res => {
              // var localId = res.localId // 返回音频的本地ID
              this.triggerCallback('onPlayVoiceEnded', res)
            }
          })
        },

        /**
         * 微信暂停录音
         * @param {*} localId
         */
        pauseVoice (localId) {
          localId = localId || _localId
          if (!localId) {
            console.log('没有找到localId')
            return
          }
          self.$wechat.pauseVoice({
            localId: localId, // 需要暂停的音频的本地ID，由stopRecord接口获得
            success: () => {
              this.triggerCallback('onPauseVoice')
            }
          })
        },

        /**
         * 微信停止录音
         * @param {*} localId
         */
        stopVoice (localId) {
          localId = localId || _localId
          if (!localId) {
            console.log('没有找到localId')
            return
          }
          self.$wechat.stopVoice({
            localId: localId, // 需要停止的音频的本地ID，由stopRecord接口获得
            success: () => {
              this.triggerCallback('onStopVoice')
            }
          })
        }
      }
    }
  },

  created () {
    this.getWechatSign()
    this.$wechat.ready(() => {
      this.$store.dispatch('wechat_ready')
    })
  }
}

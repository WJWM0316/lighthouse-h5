<template>
  <div class="m-recorder" :class="`z-${status}`">
    <p class="progress">{{progress | duration}}</p>
    <p class="duration">{{duration | duration}}</p>
    <div class="controls">
      <!-- 默认 -->
      <template v-if="status === 'default'">
        <button type="button" class="control btn" @click="handleStart">
          <i class="icon u-icon-btn-recorder-start"></i>
          <!-- <image-item class="icon" src="../static/icon/btn_record_start.png" /> -->
          <span class="text">最多录制60秒，点击开始</span>
        </button>
      </template>
      <!-- 录制中 -->
      <template v-if="status === 'recording'">
        <button type="button" class="control btn" @click="handleFinish">
          <i class="icon u-icon-btn-recorder-stop"></i>
          <!-- <image-item class="icon" src="../static/icon/btn_record_pause.png" /> -->
          <span class="text">完成</span>
        </button>
      </template>
      <!-- 暂停中 -->
      <template v-if="status === 'pause'">
        <button type="button" class="control btn" @click="handleResume">
          <i class="icon u-icon-btn-recorder-start"></i>
          <!-- <image-item class="icon" src="../static/icon/btn_record_start.png" /> -->
          <span class="text">继续</span>
        </button>
        <button type="button" class="finish btn right" @click="handleFinish">
          <i class="icon u-icon-btn-recorder-finish"></i>
          <!-- <image-item class="icon" src="../static/icon/btn_record_finish.png" /> -->
          <span class="text">完成</span>
        </button>
      </template>
      <!-- 完成录制 -->
      <template v-if="status === 'finish'">
        <button type="button" class="restart btn left" @click="handleRestart">
          <i class="icon u-icon-btn-recorder-restart"></i>
          <!-- <image-item class="icon" src="../static/icon/btn_record_restart.png" /> -->
          <span class="text">重录</span>
        </button>
        <button type="button" class="control btn" @click="handlePlay">
          <i class="icon u-icon-btn-recorder-play"></i>
          <!-- <image-item class="icon" src="../static/icon/btn_record_play.png" /> -->
          <span class="text">试听</span>
        </button>
        <button type="button" class="publish btn right" @click="handlePublish">
          <i class="icon u-icon-btn-recorder-publish"></i>
          <!-- <image-item class="icon" src="../static/icon/btn_record_publish.png" /> -->
          <span class="text">{{publishBtnText}}</span>
        </button>
      </template>
      <!-- 试听中 -->
      <template v-if="status === 'listening'">
        <button type="button" class="restart btn left" @click="handleRestart">
          <i class="icon u-icon-btn-recorder-restart"></i>
          <!-- <image-item class="icon" src="../static/icon/btn_record_restart.png" /> -->
          <span class="text">重录</span>
        </button>
        <button type="button" class="control btn" @click="handleStop">
          <i class="icon u-icon-btn-recorder-stop"></i>
          <!-- <image-item class="icon" src="../static/icon/btn_record_stop.png" /> -->
          <span class="text">停止</span>
        </button>
        <button type="button" class="publish btn right" @click="handlePublish">
          <i class="icon u-icon-btn-recorder-publish"></i>
          <!-- <image-item class="icon" src="../static/icon/btn_record_publish.png" /> -->
          <span class="text">{{publishBtnText}}</span>
        </button>
      </template>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { mapGetters } from 'vuex'

import wechatMixin from '@/mixins/wechat'

@Component({
  name: 'recorder',
  mixins: [wechatMixin],
  computed: {
    ...mapGetters([
      'wechatReady',
    ])
  },
  watch: {
    wechatReady: {
      handler (val) {
        if (val) {
          this.manager = this.getWechatRecorder()
          this.init()
        }
      },
      immediate: true
    }
  },
  props: {
    // 上传按钮文本
    publishBtnText: {
      type: String,
      default: '发布'
    },

    // 上传确认信息框
    publishConfirmContent: {
      type: String,
      default: '确定要发布？'
    }
  }
})
export default class Recorder extends Vue {
  manager = null // 录音管理器
  duration = 0 // 录音总长度
  progress = 0 // 录音进度||播放进度
  status = 'default'
  localId = '' // 录音文件localId

  recorderInterval = null

  /**
   * 初始化
   */
  init () {
    this.manager.onStartRecord = () => {
      this.status = 'recording'
      this.startInterval()
      this.$emit('recording')
    }

    this.manager.onStopRecord = res => {
      this.localId = res.localId
      this.status = 'finish'
      this.duration = this.progress
      this.progress = 0
      this.stopInterval()
      this.$emit('finish', res)
    }

    this.manager.onRecordEnded = res => {
      this.localId = res.localId
      this.status = 'finish'
      this.duration = this.progress
      this.progress = 0
      this.stopInterval()
      this.$emit('finish', res)
    }

    this.manager.onPlayVoice = () => {
      this.status = 'listening'
      this.progress = 0
      this.startInterval()
      this.$emit('listen-play')
    }

    this.manager.onStopVoice = () => {
      this.status = 'finish'
      this.progress = 0
      this.stopInterval()
      this.$emit('listen-stop')
    }

    this.manager.onPlayVoiceEnded = () => {
      this.status = 'finish'
      this.progress = 0
      this.stopInterval()
      this.$emit('listen-ended')
    }
  }

  /**
   * 开始计时
   */
  startInterval () {
    this.stopInterval()
    this.recorderInterval = setInterval(() => {
      this.progress += 100
    }, 100)
  }

  /**
   * 停止计时
   */
  stopInterval () {
    if (this.recorderInterval) {
      clearInterval(this.recorderInterval)
    }
  }

  async upload () {
    try {
      const res = await this.wechatUploadVoice(this.localId)
      console.log(res)
    } catch (error) {
      this.$vux.toast.text(error.message, 'middle')
    }
  }

  /**
   * 销毁组件信息
   */
  destroy () {
    this.localId = ''
    this.status = 'default'
    this.manager && this.manager.stopVoice(false)
    this.duration = 0
    this.progress = 0
    this.stopInterval()
  }

  /**
   * 开始录音
   */
  handleStart () {
    // this.manager && this.manager.start({
    //   duration: 600000,
    //   format: 'mp3'
    // })
    this.manager && this.manager.startRecord()
  }

  /**
   * 暂停录音
   */
  handlePause () {
    // this.manager && this.manager.pause()
  }

  /**
   * 继续录音
   */
  handleResume () {
    // this.manager && this.manager.resume()
    // this.status = 'recording'
    // this.$apply()
    // this.startInterval()
  }

  /**
   * 完成录音
   */
  handleFinish () {
    // if (this.status === 'pause') {
    //   // 如果是暂停录音状态直接完成，会导致录音文件长度增加一倍，所以先继续再停止录制
    //   this.manager && this.manager.resume()
    // }
    this.manager && this.manager.stopRecord()
  }

  /**
   * 重新录制
   */
  handleRestart () {
    const self = this
    this.$vux.confirm.show({
      content: '确定要重录？',
      onConfirm () {
        self.progress = 0
        self.status = 'default'
        self.destroy()
      }
    })
  }

  /**
   * 试听播放
   */
  handlePlay () {
    this.manager && this.manager.playVoice()
  }

  /**
   * 停止播放
   */
  handleStop (callStopVoice = true) {
    this.manager && this.manager.stopVoice({ callStopVoice: callStopVoice })
  }

  /**
   * 发布
   */
  handlePublish () {
    const self = this
    this.$vux.confirm.show({
      content: this.publishConfirmContent,
      onConfirm () {
        self.upload()
      }
    })
    // this.$root.$parent.showConfirm(this.publishConfirmContent, () => {
    //   this.file.path = this.file.tempFilePath
    //   this.$root.$parent.showLoading('上传中（0%）')
    //   this.uploadAudio(this.file, {
    //     onProgress: res => {
    //       if (res.progress >= 100) {
    //         this.$root.$parent.showLoading(`上传完成`)
    //       } else {
    //         this.$root.$parent.showLoading(`上传中（${res.progress}%）`)
    //       }
    //     }
    //   }).then(res => {
    //     console.log('上传完成：', res)
    //     this.$root.$parent.hideLoading()
    //     this.$emit('upload-success', res)
    //   }).catch(e => {
    //     console.log('上传失败', e)
    //     this.$root.$parent.hideLoading()
    //     this.$emit('upload-error', e)
    //   })
    // })
  }
}
</script>

<style lang="less" scoped>
.m-recorder {
  padding: 35px 0 20px;
  background: #fff;

  &.z-finish,
  &.z-listening {

    .progress {
      margin-bottom: 0;
    }

    .duration {
      display: block;
    }
  }

  .progress {
    display: block;
    margin-bottom: 35px;
    line-height: 35px;
    font-size: 24px;
    text-align: center;
    color: #666;
  }

  .duration {
    display: none;
    margin-bottom: 13px;
    text-align: center;
    line-height: 22px;
    font-size: 14px;
    color: #d7ab70;
  }

  .controls {
    position: relative;
    text-align: center;

    .btn {
      background: none;
      line-height: 1;
      border: none;
      font-size: 0;

      &:focus {
        outline: none;
      }

      .icon {
        margin-bottom: 10px;
      }

      .text {
        display: block;
        line-height: 16px;
        font-size: 12px;
        color: #d7ab70;
      }

      &.left,
      &.right {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }

      &.left {
        left: 50px;
      }

      &.right {
        right: 50px;
      }

      &.control {
        .icon {
          width: 70px;
          height: 70px;
        }

        .text {
          color: #666;
        }
      }
    }
  }
}
</style>


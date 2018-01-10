<template>
  <div class="m-recorder" :class="`z-${status}`">
    <p class="progress">{{progress | duration}}</p>
    <p class="duration">{{duration | duration}}</p>
    <div class="controls">
      <!-- 默认 -->
      <template v-if="status === 'default'">
        <button type="button" class="control btn" @click="handleStart">
          <i class="icon u-icon-btn-recorder-start"></i>
          <span class="text">最多录制60秒，点击开始</span>
        </button>
      </template>
      <!-- 录制中 -->
      <template v-if="status === 'recording'">
        <button type="button" class="control btn" @click="handleFinish">
          <i class="icon u-icon-btn-recorder-stop"></i>
          <span class="text">完成</span>
        </button>
      </template>
      <!-- 暂停中 -->
      <!-- <template v-if="status === 'pause'">
        <button type="button" class="control btn" @click="handleResume">
          <i class="icon u-icon-btn-recorder-start"></i>
          <span class="text">继续</span>
        </button>
        <button type="button" class="finish btn right" @click="handleFinish">
          <i class="icon u-icon-btn-recorder-finish"></i>
          <span class="text">完成</span>
        </button>
      </template> -->
      <!-- 完成录制 -->
      <template v-if="status === 'finish'">
        <button type="button" class="restart btn left" @click="handleRestart">
          <i class="icon u-icon-btn-recorder-restart"></i>
          <span class="text">重录</span>
        </button>
        <button type="button" class="control btn" @click="handlePlay">
          <i class="icon u-icon-btn-recorder-play"></i>
          <span class="text">试听</span>
        </button>
        <button type="button" class="publish btn right" @click="handlePublish">
          <i class="icon u-icon-btn-recorder-publish"></i>
          <span class="text">{{publishBtnText}}</span>
        </button>
      </template>
      <!-- 试听中 -->
      <template v-if="status === 'listening'">
        <button type="button" class="restart btn left" @click="handleRestart">
          <i class="icon u-icon-btn-recorder-restart"></i>
          <span class="text">重录</span>
        </button>
        <button type="button" class="control btn" @click="handleStop">
          <i class="icon u-icon-btn-recorder-stop"></i>
          <span class="text">停止</span>
        </button>
        <button type="button" class="publish btn right" @click="handlePublish">
          <i class="icon u-icon-btn-recorder-publish"></i>
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

import { wechatUploadFileApi } from '@/api/common'

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
      if (this.duration > 0 && this.progress > this.duration) {
        this.progress = this.duration
      }
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

  /**
   * 上传文件到微信服务器
   */
  async upload () {
    try {
      this.$emit('uploading')
      const res = await this.wechatUploadVoice(this.localId)
      this.uploadWechatSuccess(res)
    } catch (error) {
      this.$vux.toast.text(error.message, 'bottom')
    }
  }

  /**
   * 文件成功上传到微信服务器
   */
  async uploadWechatSuccess ({ serverId }) {
    // todo 上传微信服务器成功，通知服务器，并发布
    try {
      const params = {
        medias: [{
          mediaId: serverId,
          fileType: 'audio'
        }]
      }
      const { files } = await wechatUploadFileApi(params)
      this.$emit('upload-success', files)
    } catch (error) {
      this.$vux.toast.test(error.message, 'bottom')
    }
  }

  /**
   * 清除
   */
  clear () {
    this.localId = ''
    this.status = 'default'
    this.manager && this.manager.stopVoice({ callStopVoice: false })
    this.duration = 0
    this.progress = 0
    this.stopInterval()
  }

  /**
   * 开始录音
   */
  handleStart () {
    this.manager && this.manager.startRecord()
  }

  /**
   * 完成录音
   */
  handleFinish () {
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
        self.clear()
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
  handleStop () {
    this.manager && this.manager.stopVoice()
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


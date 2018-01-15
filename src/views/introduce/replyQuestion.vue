<template>
  <div class="p-body p-reply-question">
    <question-item class="question" :model="problem" :communityId="communityId" @play-voice="handlePlayVoice" @pause-voice="handlePauseVoice" />
    <div class="tips" v-if="problem.status === 5">
      <p>* 问题已过期，可以回答，但不会获得报酬</p>
    </div>
    <div class="reply" v-if="problem.status !== 2 && problem.status !== 4">
      <div class="tabs">
        <button class="item u-btn" :class="{ 'z-active': replyType === 2 }" @click="handleSwitchReplyType(2)">
          <span class="text">语音回答</span>
        </button>
        <button class="item u-btn" :class="{ 'z-active': replyType === 1 }" @click="handleSwitchReplyType(1)">
          <span class="text">文字回答</span>
        </button>
      </div>
      <div class="contents">
        <div class="record-reply" v-if="replyType === 2">
          <recorder ref="recorder" @uploading="handleUploading" @upload-success="handleUploadSuccess" @listen-play="handleListenPlay" />
        </div>
        <div class="text-reply" v-else>
          <div class="form-group">
            <textarea class="control" maxlength="1000" placeholder="写下您的回答~" v-model="content" />
            <p class="addon" :class="{ 'z-active': content.length > 0 }"><span class="current">{{content.length}}</span>/{{lengths.textMax}}</p>
          </div>
          <div class="btn-container">
            <button class="u-btn-submit" @click="handleTextReply">确认回答</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

import QuestionItem from '@/components/questionItem'
import Recorder from '@/components/recorder'

import { getProblemInfoApi, replyApi } from '@/api/pages/qa'

@Component({
  name: 'reply-question',
  components: {
    QuestionItem,
    Recorder
  }
})
export default class ReplyQuestion extends Vue {
  // 文本长度
  lengths = {
    textMax: 1000, // 文本最大字数
  }

  id = '' // 问题id
  communityId = '' // 社区id
  replyType = 2 // 问题回答类型 1 => 文字；2 => 语音
  content = '' // 文字内容或者录音文件id
  master = {} // 大咖信息
  problem = {} // 问题详情
  serverIds = []

  audio = null
  audioEventCallbacks = {
    onPlay: null,
    onTimeUpdate: null,
    onPause: null,
    onStopOrEnded: null
  }

  created () {
    const { params } = this.$route
    this.communityId = params.communityId
    this.id = params.problemId

    this.getInfo()
  }

  /**
   * 获取问题信息
   */
  async getInfo () {
    try {
      const params = {
        communityId: this.communityId,
        problemId: this.id
      }

      const { master, problem } = await getProblemInfoApi(params)
      problem.answer.forEach(item => {
        item.voice = {
          progress: 0,
          status: 'default'
        }
      })

      this.master = master
      this.problem = problem
    } catch (error) {
      this.$vux.toast.text(error.message, 'bottom')
    }
  }

  /**
   * 回复问题
   */
  async reply () {
    try {
      this.$vux.loading.show({
        text: '加载中...'
      })
      const params = {
        communityId: this.communityId,
        problemId: this.id,
        type: this.replyType,
        contact: this.content
      }

      await replyApi(params)
      this.$vux.toast.text('回答成功', 'bottom')
      this.$router.go(-1)
    } catch (error) {
      this.$vux.toast.text(error.message, 'bottom')
    } finally {
      this.$vux.loading.hide()
    }
  }

  /**
   * 验证
   */
  validate () {
    let valid = true

    if (!this.content) {
      this.$vux.toast.text('请填写回答内容', 'bottom')
      valid = false
    }

    return valid
  }

  /**
   * 获取问题回答
   */
  getAnswerById (answerId) {
    let result = null
    for (let index in this.problem.answer) {
      const answer = this.problem.answer[index]
      if (answer.answerId === answerId) {
        result = answer
        break
      }
    }
    return result
  }

  /**
   * 点击切换回答类型
   */
  handleSwitchReplyType (type) {
    if (this.replyType !== type) {
      this.replyType = type
      this.content = '' // 切换tab，将内容清空
    }
  }

  /**
   * 上传录音中
   */
  handleUploading () {
    this.$vux.loading.show({
      text: '上传中...'
    })
  }

  /**
   * 上传录音成功
   */
  handleUploadSuccess (files) {
    const fileIds = files.map(item => item.fileId)
    this.serverIds = files.map(item => item.mediaId)
    this.content = fileIds[0]
    this.reply()
  }

  /**
   * 文字回答
   */
  handleTextReply () {
    if (this.validate()) {
      this.reply()
    }
  }

  /**
   * 播放录音
   */
  handlePlayVoice (url, communityId, problemId, answerId) {
    const answer = this.getAnswerById(answerId)
    if (!this.audio || this.audio.src !== url) {
      if (this.audio) {
        this.audio.pause()
        this.audioEventCallbacks.onStopOrEnded() // 此处无法自动触发上一次的时间监听，手动触发播放结束回调重置播放音频的状态
      } else {
        this.audio = new Audio()
      }

      this.audio.src = url

      // 销毁上一次的监听事件
      if (this.audioEventCallbacks.onPlaying) {
        this.audio.removeEventListener('playing', this.audioEventCallbacks.onPlaying)
      }
      if (this.audioEventCallbacks.onTimeUpdate) {
        this.audio.removeEventListener('timeupdate', this.audioEventCallbacks.onTimeUpdate)
      }
      if (this.audioEventCallbacks.onPause) {
        this.audio.removeEventListener('pause', this.audioEventCallbacks.onPause)
      }
      if (this.audioEventCallbacks.onStopOrEnded) {
        this.audio.removeEventListener('ended', this.audioEventCallbacks.onStopOrEnded)
      }

      this.audioEventCallbacks.onPlaying = e => {
        answer.voice.status = 'playing'
        this.$refs.recorder && this.$refs.recorder.stopPlayVoice() // 通知录音组件尝试停止播放录音试听
      }
      this.audioEventCallbacks.onTimeUpdate = e => {
        const progress = (this.audio.currentTime / this.audio.duration) * 100
        answer.voice.progress = parseInt(progress)
      }
      this.audioEventCallbacks.onPause = e => {
        answer.voice.status = 'default'
      }
      this.audioEventCallbacks.onStopOrEnded = e => {
        this.audio.currentTime = 0
        answer.voice.progress = 0
        answer.voice.status = 'default'
      }

      this.audio.addEventListener('playing', this.audioEventCallbacks.onPlaying)
      this.audio.addEventListener('timeupdate', this.audioEventCallbacks.onTimeUpdate)
      this.audio.addEventListener('pause', this.audioEventCallbacks.onPause)
      this.audio.addEventListener('stop', this.audioEventCallbacks.onStopOrEnded)
      this.audio.addEventListener('ended', this.audioEventCallbacks.onStopOrEnded)
    }

    this.audio.play()
    answer.voice.status = 'loading'
  }

  /**
   * 暂停播放录音
   */
  handlePauseVoice (communityId, problemId, answerId) {
    this.audio && this.audio.pause()
  }

  /**
   * 试听录音
   */
  handleListenPlay () {
    this.audio && this.audio.pause()
  }
}
</script>

<style lang="less" scoped>
@import "../../styles/variables";
@import "../../styles/mixins";

.p-reply-question {
  background: #f9f9f9;
  min-height: 100%;

  .question {
    margin-bottom: 10px;
  }

  .tips {
    margin-bottom: 10px;
    padding: 0 15px;
    line-height: 16px;
    font-size: 12px;
    color: #929292;
  }

  .reply {
    background: #fff;

    .tabs {
      .setTabs();
      text-align: center;

      .item {
        margin: 0 40px;
      }
    }

    .text-reply {
      padding: 20px 15px 15px;

      .form-group {
        position: relative;

        .control {
          box-sizing: border-box;
          padding: 10px 10px 30px;
          width: 100%;
          height: 125px;
          background: #f9f9f9;
          border: solid 1px #dcdcdc; /* no */
          border-radius: 6px;
          line-height: 19px;
          font-size: 15px;
          resize: none;

          &::placeholder {
            color: #bcbcbc;
          }
        }

        .addon {
          display: block;
          position: absolute;
          right: 10px;
          bottom: 10px;
          line-height: 16px;
          font-size: 12px;
          color: #bcbcbc;

          &.z-active .current {
            color: #d7ab70;
          }
        }
      }

      .btn-container {
        padding-top: 15px;
        text-align: center;

        .u-btn-submit {
          display: inline-block;
          box-sizing: border-box;
          padding: 6px 15px 5px;
          background: none;
          min-width: 100px;
          line-height: 20px;
          border: solid 1px #d7ab70; /* no */
          border-radius: 16px;
          font-size: 14px;
          text-align: center;
          color: #d7ab70;

          &.btn-hover {
            background: #d7ab70;
            color: #fff;
          }

          &::after {
            content: none;
          }
        }
      }
    }
  }
}
</style>


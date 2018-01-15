<template>
  <div class="p-body p-ask">
     <!-- header -->
    <div class="header">
      <div class="userInfo">
        <div class="userInfo-img">
          <image-item :src="userInfo.avatar" mode="horizontal" :round="true" />
          <image-item class="sex" :src="require('@/assets/icon/icon_boy.png')" mode="horizontal" />
        </div>
        <div class="userInfo-desc">
          <h3>{{userInfo.realName}}</h3>
          <p v-if="userInfo.career">{{userInfo.career}}</p>
        </div>
      </div>

      <div class="user-input">
        <textarea placeholder="点此输入您想要向大咖提问的问题"
                  maxlength="1000"
                  v-model="askContent"/>
        <p class="user-input-length">{{strLength}}/1000</p>
      </div>

      <div class="is-private">
        <div class="u-checkbox">
          <input id="private" type="checkbox" v-model="isPrivate" :true-value="1" :false-value="2" />
          <label for="private">
            <i class="icon u-icon"></i> 设为私密提问 {{isPrivate}}
          </label>
        </div>
      </div>

      <button type="button" class="ask-btn" :disabled="strLength <= 0" @click="handleAsk">{{isHasFree > 0 ? '提问' : '付费提问'}}</button>

      <div class="user-desc">
        <p v-if="isHasFree > 0">你还有 {{isHasFree}} 次机会向导师免费提问，你的提问将100%得到答复</p>
        <p v-else>你可以以每条 ￥{{pageInfo.problemPrice}} 的价格向导师进行付费提问。</p>
      </div>
    </div>

    <!-- container -->
    <div class="container">
      <div class="container-title" v-if="pageInfo.problem && pageInfo.problem.length > 0">历史提问</div>
      <div class="question-list">
        <question-item class="question"
            v-for="(item, index) in pageInfo.problem"
            :key="index"
            :model="item"
            :type="2"
            :communityId="communityId"
            @card-tap="handleCardTap"
            @play-voice="handlePlayVoice"
            @pause-voice="handlePauseVoice">
            <div class="btn-container" slot="footer" v-if="item.status === 2">
              <a class="u-btn-add-ask" @click.prevent.stop="handleWakeUpPump(index)">追问</a>
            </div>
        </question-item>
      </div>
    </div>

    <!-- <div class="ask-box" :class="{ show: isShowPumpBtn }">
      <div class="user-input">
        <input type="text" placeholder="每个问题只能追问一次"
              @blur="sleep"
              @focus="isPumpFocus"
              v-model="pumpContent"
              maxlength="1000" />
      </div>
      <button type="button" class="ask-btn" @click="btnClick(2)">追问</button>
    </div> -->

    <!-- 悬浮输入框 -->
    <suspension-input v-model="displaySuspensionInput"
      :placeholder="suspensionInputPlaceholder"
      :content="pumpContent"
      :commentIndex="commentIndex"
      :sendText="'追问'"
      @send="handleAppendAsk" />
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

import QuestionItem from '@/components/questionItem'
import suspensionInput from '@/components/suspensionInput/suspensionInput'

import ListMixin from '@/mixins/list'

import { getAskInfoApi, submitProblemApi, submitAnswerApi } from '@/api/pages/pageInfo'
import { payApi } from '@/api/pages/pay'

@Component({
  name: 'ask',
  mixins: [ListMixin],
  components: {
    QuestionItem,
    suspensionInput
  }
})
export default class Ask extends Vue {
  communityId = ''
  pageInfo = {}
  askContent = ''
  pumpContent = ''
  isPrivate = 2

  audio = null
  audioEventCallbacks = {
    onPlay: null,
    onTimeUpdate: null,
    onPause: null,
    onStopOrEnded: null
  }

  commentIndex = -1
  suspensionInputPlaceholder = '每个问题只能追问一次'
  displaySuspensionInput = false

  // 大咖用户信息
  get userInfo () {
    return this.pageInfo.master || {}
  }

  // 问题列表
  get problemList () {
    return this.pageInfo.problem || []
  }

  // 提问内容长度
  get strLength () {
    return this.askContent.length
  }

  // 是否还有免费次数
  get isHasFree () {
    return this.pageInfo['problemNum']
  }

  created () {
    this.communityId = this.$route.params.communityId
    this.pageInit()
  }

  /**
   * 页面初始化
   */
  async pageInit () {
    try {
      this.isCheck = false
      this.askContent = ''
      this.isPrivate = 2

      const params = {
        communityId: this.communityId
      }

      const res = await getAskInfoApi(params)
      this.pageInfo = res
      this.pageInfo.problem.forEach(item => {
        item.answer.forEach(answer => {
          answer.voice = {
            status: 'default',
            progress: 0
          }
        })
      })
    } catch (error) {
      this.$vux.toast.text(error.message, 'bottom')
    }
  }

  /**
   * 提问
   */
  async sendAsk (params) {
    try {
      const res = await submitProblemApi(params)
      if (params.payType === 1) {
        // todo 调起微信支付
      } else {
        this.$vux.toast.text('提问成功', 'bottom')
        this.pageInit()
      }
    } catch (error) {
      this.$vux.toast.text(error.message, 'bottom')
    }
  }

  /**
   * 追问
   */
  async submitAnswer (params) {
    try {
      await submitAnswerApi(params)
      this.$vux.toast.text('追问成功', 'bottom')
      this.pageInit()
    } catch (error) {
      this.$vux.toast.text(error.message, 'bottom')
    }
  }

  /**
   * 获取问题回答
   */
  getAnswerById (problemId, answerId) {
    console.log(problemId, answerId, this.problemList)
    let result = null
    let find = false
    for (let [, problem] of this.problemList.entries()) {
      if (problemId !== problem.problemId) {
        continue
      }

      for (let [, answer] of problem.answer.entries()) {
        if (answer.answerId === answerId) {
          result = answer
          find = true
          break
        }
      }

      if (find) {
        break
      }
    }
    return result
  }

  /**
   * 点击提问|付费提问
   */
  handleAsk () {
    const self = this
    const contact = this.askContent.trim()
    if (!contact) {
      this.$vux.toast.text('内容不能为空', 'bottom')
      return
    }

    const isPay = this.isHasFree > 0 ? 2 : 1
    const communityId = this.communityId
    const params = {
      communityId,
      contact,
      private: this.isPrivate,
      payType: isPay
    }

    this.$vux.confirm.show({
      title: '提示',
      content: '提问后就不能再次修改问题，请确认',
      confirmText: '确定提问',
      cancelText: '修改一下',
      onConfirm: () => {
        if (isPay === 2) {
          // 免费提问
          self.sendAsk(params)
        } else {
          // :todo 付费提问
          self.sendAsk({...params, payType: 1})
        }
      }
    })
  }

  /**
   * 点击问题列表追问按钮，唤起悬浮输入框
   * @param {Number} index 问题索引
   */
  handleWakeUpPump (index) {
    this.commentIndex = index
    this.displaySuspensionInput = true
  }

  /**
   * 点击悬浮窗追问
   */
  handleAppendAsk ({ value, commentIndex }) {
    const problem = this.problemList[commentIndex]

    this.$vux.confirm.show({
      title: '提示',
      content: '提问后就不能再次修改问题，请确认',
      confirmText: '确定提问',
      cancelText: '修改一下',
      onConfirm: () => {
        this.submitAnswer({
          communityId: this.communityId,
          problemId: problem.problemId,
          contact: value
        })
      },
      onCancel: () => {
        this.pumpContent = value
        this.displaySuspensionInput = true
      }
    })
  }

  /**
   * 跳转提问详情
   */
  handleCardTap (communityId, item) {
    this.$router.push(`/details/circle/${item.problemId}/3`)
  }

  /**
   * 播放录音
   */
  handlePlayVoice (url, communityId, problemId, answerId) {
    const answer = this.getAnswerById(problemId, answerId)
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
    this.audio.pause()
  }
}
</script>

<style lang="less" scoped>
@import "../../styles/mixins";
@import "../../styles/variables";

.p-ask {
  background-color: #f9f9f9;

  button:after {
    border-style: none;
  }

  & image {
    width: 100%;
    height: 100%;
  }

  .header {
    padding: 20px 15px;
    background-color: #fff;

    & .userInfo {
      display: flex;
      font-size: 13px;
      color: #929292;

      & text:first-of-type {
        font-size: 18px;
        margin-bottom: 8px;
        color: #354048;
        font-weight: bold;
      }
    }

    & .userInfo-img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      position: relative;

      & image {
        border-radius: 50%;
      }

      & .sex {
        position: absolute;
        width: 18px;
        height: 18px;
        bottom: 0;
        right: 0;
      }
    }

    & .userInfo-desc {
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      margin-left: 15px;
      font-size: 13px;

      & > h3 {
        font-size: 18px;
        color: @font-color-default;
      }
    }

    & .user-input {
      margin-top: 20px;
      height: 140px;
      border-radius: 6px;
      background-color: #f9f9f9;
      border: solid 1px #dcdcdc; /* no */
      padding: 10px;
      position: relative;

      & .user-input-length {
        position: absolute;
        right: 15px;
        bottom: 10px;
        font-size: 12px;
        color: #bcbcbc;
      }

      & textarea, & input {
        font-size: 15px;
        background: none;
        width: 100%;
        height: 100%;
        border: none;
        resize: none;

        &::placeholder {
          color: #bcbcbc;
        }
      }
    }

    & .is-private {
      margin-top: 10px;

      .u-checkbox {
        .icon {
          background-image: url("../../assets/icon/checkbox_private.png");
          .setSize(18px, 18px);
        }

        & > label {
          line-height: 18px;
          font-size: 14px;
          color: #d7ab70;
        }

        & > input:checked ~ label {
          .icon {
            background-image: url("../../assets/icon/checkbox_private_checked.png");
          }
        }
      }
    }

    & .ask-btn {
      margin-top: 20px;
      padding: 10px;
      width: 100%;
      background: #ffe266;
      line-height: 24px;
      border-radius: 22px;
      border: none;
      font-size: 15px;
      color: #354048;

      &[disabled] {
        opacity: .5;
      }

      &::after {
        content: none;
      }
    }

    & .user-desc {
      margin-top: 12px;
      font-size: 12px;
      color: #bcbcbc;
      text-align: center;
    }
  }

  .container {
    margin-top: 10px;

    & .container-title {
      font-size: 17px;
      font-weight: bold;
      color: #354048;
      padding: 20px 15px 5px 15px;
      background: #fff;
    }

    .question-list {
      .question {
        margin-bottom: 10px;
      }

      .btn-container {
        padding-bottom: 15px;

        .u-btn-add-ask {
          margin: -10px;
          padding: 10px;
          line-height: 19px;
          font-size: 15px;
          font-weight: bold;
          color: #d7ab70;
        }
      }
    }
  }
}
</style>

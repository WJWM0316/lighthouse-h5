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
          <input id="private" type="checkbox" :checked="isCheck" />
          <label for="private">
            <i class="icon u-icon"></i> 设为私密提问
          </label>
        </div>
      </div>

      <button type="button" class="ask-btn" :disabled="strLength <= 0" @click="btnClick(1)">{{isHasFree > 0 ? '提问' : '付费提问'}}</button>

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
              <a class="u-btn-add-ask" @click.prevent.stop="wakeUpPump(item)">追问</a>
            </div>
        </question-item>
      </div>
    </div>

    <div class="ask-box" :class="{ show: isShowPumpBtn }">
      <div class="user-input">
        <input type="text" placeholder="每个问题只能追问一次"
              @blur="sleep"
              @focus="isPumpFocus"
              v-model="pumpContent"
              maxlength="1000" />
      </div>
      <button type="button" class="ask-btn" @click="btnClick(2)">追问</button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

import QuestionItem from '@/components/QuestionItem'

import ListMixin from '@/mixins/list'

import { getAskInfoApi, submitProblemApi, submitAnswerApi } from '@/api/pages/pageInfo'
import { payApi } from '@/api/pages/pay'

@Component({
  name: 'ask',
  mixins: [ListMixin],
  components: {
    QuestionItem
  }
})
export default class Ask extends Vue {
  routeInfo = ''
  pageInfo = {}
  communityId = ''
  askContent = ''
  pumpContent = ''
  isPrivate = 2
  isCheck = true
  isShowPumpBtn = false
  isPumpFocus = false
  operatingObject = ''
  audio = null

  get userInfo () {
    return this.pageInfo.master || {}
  }

  get roblemList () {
    return this.pageInfo.problem || []
  }

  get strLength () {
    return this.askContent.length
  }

  get isHasFree () {
    return this.pageInfo['problemNum']
  }

  btnClick (type, e) {
    console.log(type, e)
    const self = this
    const contact = type === '1' ? this.askContent.trim() : this.pumpContent.trim()

    console.log('提问内容： ' + contact)
    if (!contact) {
      this.$broadcast('show-message', {content: '内容不能为空'})
      return
    }

    const isPay = this.isHasFree > 0 ? 2 : 1
    const communityId = this.routeInfo.communityId
    const params = {
      communityId,
      contact,
      private: this.isPrivate,
      payType: isPay,
      formId: e.detail.formId
    }

    console.log(params)
    this.$vux.confirm.show({
      title: '提示',
      content: '提问后就不能再次修改问题，请确认',
      confirmText: '确定提问',
      cancelText: '修改一下',
      onConfirm: () => {
        if (type === '1') {
          // 拥有免费次数
          if (isPay === 2) {
            self.sendAsk(params)
          } else {
            // :todo 付费提问
            self.sendAsk({...params, payType: 1})
          }
        } else {
          console.log('追问', communityId)
          self.submitAnswer({
            communityId,
            problemId: self.operatingObject.problemId,
            contact,
            formId: e.detail.formId
          })
        }
      }
    })
  }

  // 唤起悬浮输入框
  wakeUpPump (item) {
    if (item.problemId !== this.operatingObject.problemId) {
      this.operatingObject = ''
      this.pumpContent = ''
    }
    this.operatingObject = item
    this.isShowPumpBtn = true
    this.isPumpFocus = true
  }

  sleep () {
    console.log(this.pumpContent)
    this.isPumpFocus = false
    this.isShowPumpBtn = false
  }

  // Api
  sendAsk (params) { // 提问
    const self = this
    submitProblemApi(params).then(res => {
      console.log('res', res)
      if (params.payType === 1) {
        res.success = function () {
          // 刷新当前页
          self.$broadcast('show-message', {content: '提问成功'})
          self.pageInit()
        }
        wx.requestPayment(res)
      } else {
        self.$broadcast('show-message', {content: '提问成功'})
        self.pageInit()
      }
    }).catch(e => {
      self.$broadcast('show-message', {content: e.message})
    })
  }

  submitAnswer (params) { // 追问
    const self = this
    console.log('afefewf', params)
    submitAnswerApi(params).then(res => {
      self.pageInit()
      self.$broadcast('show-message', {content: '提问成功'})
    }).catch(e => {
      self.$broadcast('show-message', {content: e.message})
    })
  }

  // 页面初始化
  pageInit () {
    const { communityId } = this.$route.params
    const self = this

    this.isCheck = false
    this.askContent = ''
    this.pumpContent = ''
    this.isPrivate = 2

    getAskInfoApi({
      communityId
    }).then(res => {
      console.log(res)
      self.pageInfo = res
      self.communityId = self.pageInfo.communityId
      self.pageInfo.problem.forEach(item => {
        item.releaseTime = self.format(item.releaseTime * 1000, 'YYYY-MM-DD HH:mm')
        item.answer.forEach(answer => {
          answer.voice = {
            status: 'default',
            progress: 0
          }
        })
      })
      this.$apply()
    }).catch(e => {
    })
  }

  /**
   * 获取问题回答
   */
  getAnswerById (problemId, answerId) {
    let result = null
    let find = false
    for (let [, problem] of this.pageInfo.problem.entries()) {
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

  created () {
    this.pageInit()
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

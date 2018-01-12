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
          <recorder @upload-success="handleUploadSuccess" @listen-play="handleListenPlay" />
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

import QuestionItem from '@/components/QuestionItem'
import Recorder from '@/components/Recorder'

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

  audio = null
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
        }

        .control-placeholder {
          color: #bcbcbc;
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


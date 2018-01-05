<template>
  <div class="m-question-item" :class="`type-${type}`">
    <div class="hd">
      <template v-if="type === 2">
        <div class="middle">
          <text class="time">{{model.releaseTime}}</text>
        </div>
      </template>
      <template v-else>
        <a href="#" class="head" @click.prevent.stop="handleUserDetail">
          <image-item class="image" :src="model.user.avatar || require('@/assets/icon/img_head_default.png')" />
        </a>
        <div class="middle">
          <text class="username">{{model.user.realName}}</text>
          <text class="time">{{model.releaseTime}}</text>
        </div>
      </template>
      <div class="addon-text">{{statusOptions[model.status]}}</div>
    </div>

    <div class="bd">
      <div class="item">
        <p class="text"><span class="private" v-if="model.private === 1">私密</span> 问：{{model.content}}</p>
      </div>
      <template v-if="showDetails">
        <template v-for="(item, index) in model.answer">
          <template v-if="item.answerType === 1">
            <div class="item" :key="`answer_${index}`">
              <p class="text">追问：{{item.content}}</p>
            </div>
          </template>
          <template v-else>
            <div class="item master-item" :key="`answer_${index}`" v-if="item.type === 1">
              <a href="#" class="head" @click.prevent.stop="handleUserDetail">
                <image-item :src="model.user.avatar || require('@/assets/icon/img_head_default.png')" />
              </a>
              <div class="text-container">
                <p class="text">{{item.content}}</p>
              </div>
            </div>
            <div class="item master-item" :key="`answer_${index}`" v-else>
              <a href="#" class="head" @click.prevent.stop="handleUserDetail">
                <image-item :src="model.user.avatar || require('@/assets/icon/img_head_default.png')" />
              </a>
              <div class="voice">
                <div class="voice-container z-read" @click="handleTapVoice">
                  <div class="progress">
                    <div class="bar" :style="{ width: `${item.voice.progress || 0}%` }"></div>
                  </div>
                  <div class="controls">
                    <image-item class="status" :class="{ 'z-loading': item.voice.status === 'loading' }" :src="audioStatusIcons[item.voice.status]" />
                    <text class="dutraion">{{item.duration || 0}}s</text>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>
      </template>
    </div>
    <div class="ft">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'question-item',
  props: {
    // 类型，默认1带头像，2不带头像
    type: {
      type: Number,
      default: 1
    },

    // 是否显示追问等详情
    showDetails: {
      type: Boolean,
      default: true
    },

    // 数据
    model: {
      type: Object,
      default () {
        return {}
      }
    },

    // 问题对应社区id
    communityId: {
      type: [String, Number]
    }
  }
})
export default class QuestionItem extends Vue {
  // 语音状态icon
  audioStatusIcons = {
    default: '../../static/icon/music_play.png',
    loading: '../../static/icon/music_loading.png',
    playing: '../../static/icon/music_listen.gif'
  }

  // 问题状态列表
  statusOptions = {
    1: '未回答',
    2: '已回答',
    3: '有追问',
    4: '已回答',
    5: '已过期'
  }
}
</script>

<style lang="less" scoped>
@import "../../styles/variables";
@import "../../styles/mixins";

@keyframes kf-loading {
  form {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}

.m-question-item {
  padding-left: 15px;
  background: #fff;

  // &:active {
  //   background: #f1f1f1;
  // }

  &.type-2 {
    .hd {
      .middle .time {
        font-size: 13px;
      }

      .addon-text {
        line-height: 17px;
      }
    }
  }

  .hd {
    display: flex;
    padding: 15px 15px 15px 0;
    border-bottom: solid 1px #dcdcdc; /* no */

    .head,
    .addon {
      flex: 0 0 auto;
    }

    .middle {
      flex: 1 1 auto;
    }

    .head {
      padding-right: 15px;
      line-height: 1;
      font-size: 0;

      .image {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
    }

    .middle {
      padding-right: 15px;

      .username {
        .setSingleLine();
        display: block;
        line-height: 22px;
        font-size: 15px;
        font-weight: bold;
      }

      .time {
        .setEllipsis();
        display: block;
        line-height: 17px;
        font-size: 12px;
        color: #bcbcbc;
      }
    }

    .addon-text {
      line-height: 22px;
      font-size: 13px;
      color: #929292;
    }
  }

  .bd {
    padding: 18px 0 17px;

    .item {
      line-height: 22px;
      font-size: 15px;

      & + .item {
        margin-top: 15px;
      }

      &.master-item {
        display: flex;

        .head {
          flex: 0 0 auto;
        }


        .voice,
        .text-container {
          flex: 1 1 auto;
          padding-left: 10px;
        }

        .text-container {
          align-self: center;
        }
      }

      .head {
        line-height: 1;
        font-size: 0;

        & > image {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
      }

      .voice-container {
        position: relative;
        box-sizing: border-box;
        max-width: 240px;
        height: 40px;

        &::after {
          content: " ";
          position: absolute;
          right: -8px;
          top: 0;
          background: #ff3434;
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        &.z-read::after {
          content: none;
        }

        .progress {
          position: relative;
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          background: rgba(255, 226, 102, .4);
          line-height: 1;
          border-radius: 0 20px 20px 20px;
          font-size: 0;
          color: #666;
          overflow: hidden;

          .bar {
            position: absolute;
            left: 0;
            top: 0;
            background: #ffe266;
            width: 30%;
            height: 100%;
          }
        }

        .controls {
          display: flex;
          justify-content: space-between;
          box-sizing: border-box;
          position: absolute;
          left: 0;
          top: 0;
          padding: 10px 15px;
          width: 100%;

          .status {
            position: relative;
            width: 20px;
            height: 20px;

            &.z-loading {
              animation: kf-loading 1s linear infinite;
            }
          }

          .dutraion {
            display: inline-block;
            font-size: 15px;
            line-height: 20px;
          }
        }
      }

      .private {
        padding: 0 3px;
        background: #d7ab70;
        line-height: 19px;
        border-radius: 3px;
        font-size: 13px;
        color: #fff;
      }
    }
  }
}
</style>

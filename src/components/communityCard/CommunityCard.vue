<template>
  <a href="#" class="m-community" :class="cardClasses" @click.prevent.stop="handleTap">
    <div class="cover-container">
      <image-item class="cover" :src="community.detailImg" mode="full" />
      <div class="master">
        <h3 class="name" :class="{ round: type === 1 }">
          <span class="text" v-text="community.master && community.master.realName"></span>
        </h3>
        <p class="career" v-text="community.master && community.master.career"></p>
      </div>
      <slot name="cover-addon"></slot>
    </div>

    <div class="info" :class="{ 'type-2': type === 2 }">
      <h3 class="title" v-text="community.title"></h3>
      <p class="desc" v-text="community.simpleIntro"></p>
      <div class="bottom">
        <div class="left">
          <!-- 已结束 -->
          <p v-if="isEnd">灯塔已关闭</p>
          <!-- 已加入 -->
          <p class="time-range" v-else-if="community.isAuthor === 1 || community.isJoined === 1">开课时间：{{community.startTime * 1000 | date('YYYY年MM月DD日')}}-{{community.endTime * 1000 | date('YYYY年MM月DD日')}}</p>
          <!-- 未加入且未开社 -->
          <p class="countdown" v-else-if="duration">{{duration | duration}}后开启</p>
          <!-- 未加入且已开社 -->
          <p v-else>灯塔已开启</p>
        </div>
        <div class="right">
          <template v-if="community.isAuthor !== 1 && community.isJoined !== 1 && !isEnd">
            <p class="residue" v-if="community.remainingJoinNum <= 0">已满员</p>
            <p class="residue" v-else-if="community.freeJoinedNum && community.payJoinedNum"><span class="number">{{community.freeJoinedNum + community.payJoinedNum}}</span> 人已加入</p>
          </template>
        </div>
      </div>
    </div>
  </a>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'community-card',
  props: {
    // 大咖信息
    community: {
      type: Object,
      default () {
        return {
          master: {}
        }
      }
    },

    // 类型：1为列表页卡片，2为详情页卡片
    type: {
      type: Number,
      default: 1
    }
  },
  watch: {
    'community.startTime': {
      handler (val) {
        if (this.community.isAuthor !== 1 && this.community.isJoined !== 1 && !this.isEnd) {
          // 启用倒计时
          const countdown = this.getCountdown()
          countdown.start(this.community.startTime * 1000, (timestamp) => {
            if (timestamp > 0) {
              this.duration = timestamp
            } else {
              this.duration = 0
            }
          })
        }
      },
      deep: true,
      immediate: true
    }
  }
})
export default class CommunityCard extends Vue {
  // 卡片类名集合
  cardClasses = {
    [`type-${this.type}`]: true,
    'z-joined': this.community.isAuthor === 1 || this.community.isJoined === 1,
    'z-full': this.community.remainingJoinNum <= 0,
    'z-unread': this.community.newMessage
  }

  duration = 0

  // 是否已结束
  get isEnd () {
    return this.community.endTime * 1000 < new Date().getTime()
  }

  /**
   * 点击卡片
   */
  handleTap (e) {
    // 列表页才触发点击
    this.$emit('tap-card', this.community)
  }

  /**
   * 获取倒计时对象
   * 先调用函数获取
   */
  getCountdown () {
    let t = null

    // 停止倒计时
    const stop = (t) => {
      if (t) {
        clearInterval(t)
      }
    }

    // 启动倒计时
    const start = (endTimestamp, callback) => {
      callback = callback && typeof callback === 'function' ? callback : function (timestamp) {}
      stop(t) // 先停止存在的倒计时
      const now = new Date().getTime()
      const timestamp = endTimestamp - now >= 0 ? endTimestamp - now : 0
      callback(timestamp)
      if (timestamp > 0) {
        t = setInterval(() => {
          const cNow = new Date().getTime()
          const cTimestamp = endTimestamp - cNow >= 0 ? endTimestamp - cNow : 0
          callback(cTimestamp)
          if (cTimestamp <= 0) {
            stop(t)
          }
        }, 1000)
      }

      return t
    }

    return {
      start,
      stop
    }
  }
}
</script>

<style lang="less">
@import "../../styles/variables";
@import "../../styles/mixins";

.m-community {
  display: block;

  &.type-1 {

    .cover-container {

      .cover {
        border-radius: 3px;
      }

      .master {
        border-radius: 0 0 3px 3px;

        .name {
          .text {
            .setEllipsis();
          }
        }

        .career {
          .setEllipsis();
          font-size: 11px;
        }
      }
    }

    .info {
      .title {
        .setEllipsis();
      }

      .desc {
        .setEllipsis();
      }
    }
  }

  &.type-2 {

    .cover-container {
      height: 245px;

      .master {
        padding-bottom: 17px;
      }
    }

    .info {
      padding: 0 15px;
    }
  }

  &.z-unread {

    .cover-container {

      .master {

        .name {

          &::after {
            content: " ";
          }
        }
      }
    }
  }

  .cover-container {
    position: relative;
    margin-bottom: 10px;
    height: 226px;

    .cover {
      background: #ccc;
      width: 100%;
      height: 100%;
    }

    .master {
      box-sizing: border-box;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 12px;
      background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, .2));
      /*width: 100%;*/
      color: #fff;

      .name {
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        line-height: 1;
        font-size: 0;
        font-weight: normal;
        max-width: 100%;

        .text {
          display: inline-block;
          line-height: 40px;
          font-size: 27px;
        }

        &.round {
          padding: 0 8px;
          background: #ffe266;
          border-radius: 11px;
          text-align: center;
          color: #354048;

          .text {
            line-height: 22px;
            font-size: 13px;
          }
        }

        &::after {
          content: none;
          display: block;
          box-sizing: border-box;
          position: absolute;
          right: -5px;
          top: -3px;
          background-color: #ff3434;
          width: 12px;
          height: 12px;
          border: solid 2px #fff;
          border-radius: 50%;
        }
      }

      .career {
        margin-bottom: -7px;
        display: block;
        line-height: 24px;
        font-size: 13px;
      }
    }
  }

  .info {

    .title {
      display: block;
      line-height: 24px;
      font-weight: normal;
      font-size: 18px;
      color: @font-color-default;
    }

    .desc {
      display: block;
      margin-bottom: 6px;
      line-height: 21px;
      font-size: 13px;
      color: #929292;
    }

    .bottom {
      display: flex;
      font-size: 13px;
      line-height: 19px;
      color: #929292;

      .left {
        flex: 1 1 auto;

        .countdown {
          margin-right: 5px;
          color: #d7ab70;
        }

        .time-range {
          color: #bcbcbc;
        }
      }

      .right {
        flex: 0 0 auto;

        .residue {

          .number {
            color: #d7ab70;
          }
        }
      }
    }
  }
}
</style>

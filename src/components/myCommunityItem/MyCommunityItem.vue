<template>
  <div class="my-community-item">
    <div class="bd" @click="handleClickItem">
      <div class="left">
        <h3 class="title" v-text="model.title"></h3>
        <p class="desc" v-text="model.simpleIntro">我曾经实现，相信你也可以做得到</p>
        <div class="other">
          <p class="status" :class="{ 'z-overed': isOffline || isOverred }" v-text="statusText"></p>
          <template v-if="!isOffline">
            <p class="time" v-if="isOverred">停止报名</p>
            <p class="time" v-else-if="isStart">{{model.startTime * 1000 | date('YYYY-MM-DD')}} 至 {{model.endTime * 1000 | date('YYYY-MM-DD')}}</p>
            <p class="time" v-else><span class="countdown">{{duration * 1000 | duration}}</span> 后开启</p>
          </template>
        </div>
      </div>
      <div class="cover">
        <image-item class="image-item" :src="model.icon" mode="horizontal" />
      </div>
    </div>
    <footer class="ft">
      <router-link :to="`/center/shareLite/${model.communityId}`" class="share u-btn"><i class="u-icon-share-gray" /> 分享</router-link>
      <router-link :to="`/center/classmates/${model.communityId}/0`" class="pay u-btn">付费学员({{model.payJoinedNum}})</router-link>
      <router-link :to="`/center/classmates/${model.communityId}/1`" class="free u-btn">免费学员({{model.freeJoinedNum}})</router-link>
    </footer>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'my-community-item',
  props: {
    // 数据项
    model: {
      type: Object,
      default: {}
    }
  }
})
export default class MyComponentItem extends Vue {
  now = parseInt(new Date().getTime() / 1000) // 当前时间
  duration = 0 // 距离开启时间差

  countdown = null

  // 是否已经下线
  get isOffline () {
    return this.communityStatus === 2
  }

  // 是否已经结束
  get isOverred () {
    return this.now > this.model.endTime
  }

  // 是否已经开启
  get isStart () {
    return this.now > this.model.startTime && this.now < this.model.endTime
  }

  // 是否已满员
  get isFull () {
    return this.model.freeJoinedNum >= this.model.freeJoinNum && this.model.payJoinedNum >= this.model.payJoinNum
  }

  // 状态文本
  get statusText () {
    let text = ''
    if (this.isOffline) {
      text = '已下线'
    } else if (this.isOverred) {
      text = '已结束'
    } else if (this.isFull) {
      text = '已满员'
    } else if (this.isStart) {
      text = '已开启'
    } else {
      text = '招募中'
    }

    return text
  }

  created () {
    if (!this.isStart) {
      // 未开启，时间倒计时
      this.countdown = this.getCountdown()
      this.countdown.start()
    }
  }

  beforeDestroy () {
    this.countdown && this.countdown.stop()
  }

  /**
   * 获取倒计时对象
   */
  getCountdown () {
    let t = null
    let duration = this.duration

    const updateDuration = () => {
      this.now = parseInt(new Date().getTime() / 1000) // 更新当前时间
      duration = this.model.startTime - this.now
      this.duration = duration > 0 ? duration : 0
    }

    return {
      start () {
        updateDuration()

        setInterval(() => {
          updateDuration()
          if (duration <= 0) {
            this.stop()
          }
        }, 1000)
      },

      stop () {
        if (t) clearInterval(t)
      }
    }
  }

  /**
   * 点击整项
   */
  handleClickItem () {
    this.$emit('tap-item')
  }
}
</script>

<style lang="less" scoped>
@import "../../styles/variables";
@import "../../styles/mixins";

.my-community-item {
  background: #fff;

  .bd {
    .setFlex();
    padding: 20px 15px 15px;

    &:active {
      background: #f1f1f1;
    }

    .left {
      flex: 1 1 auto;

      .title {
        line-height: 22px;
        font-size: 18px;
      }

      .desc {
        margin-bottom: 3px;
        line-height: 24px;
        font-size: 13px;
        color: #666;
      }

      .other {
        line-height: 1;

        .status,
        .time {
          display: inline-block;
          vertical-align: middle;
          line-height: 20px;
          font-size: 13px;
        }

        .status {
          padding: 0 8px;
          background: rgba(255, 226, 102, .15);
          min-width: 56px;
          text-align: center;
          color: @color-primary;

          &.z-overed {
            background: #f8f8f8;
            color: #bcbcbc;
          }
        }

        .time {
          color: #929292;

          .countdown {
            color: @color-primary;
          }
        }
      }
    }

    .cover {
      flex: 0 0 auto;

      .image-item {
        background: #ccc;
        width: 70px;
        height: 70px;
        line-height: 70px;
        border-radius: 3px;
      }
    }
  }

  .ft {
    .setFlex();
    border-top: solid 1px #ededed; /* no */

    .u-btn {
      box-sizing: border-box;
      position: relative;
      flex: 1 1 auto;
      padding: 14px 15px 12px;
      line-height: 24px;
      font-size: 15px;
      color: @font-color-default;

      &:active {
        background: #f1f1f1;
      }

      &:not(:last-child)::after {
        content: " ";
        display: block;
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: -12px;
        background: #ededed;
        width: 1px; /* no */
        height: 24px;
      }

      &.share {
        flex: 0 0 auto;
        min-width: 88px;
      }
    }
  }
}
</style>

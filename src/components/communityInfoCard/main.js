
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'community-info-card',
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
    cardType: {
      type: String,
      default: 'joined'
    },
    showFreeIdentification: {
      type: Boolean,
      default () {
        return true
      }
    },

    // 类型：1为列表页卡片, 2为详情页卡片, 3为已加入列表
    type: {
      type: Number,
      default: 1
    }
  },
  watch: {
    'community.startTime': {
      handler (val) {
        // if (this.community.isAuthor !== 1 && this.community.isJoined !== 1 && !this.isEnd) {
        if (!this.isEnd) {
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
  },
  computed: {
    // 是否已结束
    isEnd () {
      return this.community.endTime * 1000 < new Date().getTime()
    },
    // 是否已开启
    isStart () {
      return this.community.startTime * 1000 < new Date().getTime()
    },
    communityStatus () {
      if (this.type === 3) {
        if (this.isEnd) {
          return '已结束'
        } else if (this.isStart) {
          return '已开启'
        } else {
          return '未开启'
        }
      } else {
        if (this.isEnd) {
          return '已结束'
        } else if (this.community['communityStatus'] === 2) {
          return ''
        } else if (this.community['remainingJoinNum'] <= 0) {
          return '已满员'
        } else {
          return ''
        }
      }
    },
    newMessage () {
      return this.community.newMessage
    }
  }
})
export default class communityInfoCard extends Vue {
  // 卡片类名集合
  cardClasses = {
    [`type-${this.type}`]: true,
    'z-joined': this.community.isAuthor === 1 || this.community.isJoined === 1,
    'z-full': this.community.remainingJoinNum <= 0,
    'z-unread': this.community.newMessage
  }

  duration = 0

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

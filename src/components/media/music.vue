<template>
	<div class="audio-wrapper">
    <div class="audio-left" @click.stop="oper()">
      <img src="./../../assets/icon/music_play.png" v-if="playStatus === 1"></img>
      <img src="./../../assets/icon/stop@3x.png" v-else-if="playStatus === 2"></img>
      <img class="rotateZ" src="./../../assets/icon/music_loading.png" v-else-if="playStatus === 3">
      <img src="./../../assets/icon/music_listen.gif" v-else>
    </div>
    <div class="audio-right" v-if="durationData > 0">
      <range class="progressBar"
        ref="range"
        :key="itemIndex"
        v-show="disabled"
        v-model="progress"
        minHTML=" " 
        maxHTML=" "
        :rangeBarHeight='2' 
        :disabled="disabled" 
        :max="durationData"
        @touchstart.native="touchStart" 
        @touchend.native="touchEnd" 
        @touchMove.native="touchMove" >
      </range>
      <div class="audio-time" v-text="formatTime(transTime(durationData))"></div>
      <div class="curTime" v-show="isShowLabel" v-text="formatTime(transTime(currentTime))" :style="{'left': moveLeft}"></div>
    </div>
</div>
</template>
<script type="text/javascript">
	import Vue from 'vue'
  import { mapState } from 'vuex'
  import { Range, Cell, Group } from 'vux'
	import Component from 'vue-class-component'
  require('./../../assets/icon/music_play.png')
	@Component({
    name: 'music',
    props: {
      source: {
        type: Object,
        default: {}
      },
      itemIndex: {
        type: Number,
        default: 0
      }
    },
    components: {
      Range,
      Cell,
      Group
    },
    computed: {
      durationData () {
        return this.source.duration
      },
      ...mapState({
        playList: state => state.musicController.playList, // 播放列表
      }),
    },
    watch: {
      progress (val, old) {
        this.moveLeft = this.$refs.range.range.handle.style.left
        this.currentTime = val
      }
    }
  })
  export default class music extends Vue {
  	playStatus = 1 // 1未播放 2暂停 3加载中 4播放中
    progress = 0 // 进度条
    currentTime = 0 // 播放帧
    duration = 0 // 音频时长
    startTime = 0
    endTime = 0
    audio = ''
    src = ''
    moveLeft = ''
    disabled = false //音乐未播放禁止操作进度条
    isShowLabel = false // 是否显示游标


    mounted () {
      
      this.audio = this.$root.$children[0].audio
      let _this = this
      // 监听加载过程开始
      this.audio.addEventListener('loadstart ', function () {
        if (_this.src === _this.audio.src) {
          _this.playStatus = 3
        }
      }, false)

      // 监听缓冲暂停时
      this.audio.addEventListener('waiting', function () {
        if (_this.src === _this.audio.src) {
          _this.playStatus = 3
        }
      }, false)

      // 监听可以播放时
      this.audio.addEventListener('canplay', function () {
        if (_this.src === _this.audio.src) {
          _this.playStatus = 1
        }
      }, false)

      // 监听缓冲暂停又开始时
      this.audio.addEventListener('canplaythrough', function () {
        if (_this.src === _this.audio.src) {
          _this.playStatus = 1
        }
      }, false)

      // 监听播放过程
      this.audio.addEventListener('timeupdate', function () {
        if (_this.src === _this.audio.src) {
          if (!_this.audio.paused) {
            _this.playStatus = 4
          }
          _this.moveLeft = _this.$refs.range.range.handle.style.left
          _this.progress = _this.audio.currentTime
        }
      }, false)

      // 监听播放完成事件
      this.audio.addEventListener('ended', function () {
        if (_this.src === _this.audio.src) {
          _this.audioEnded();
        }
      }, false)

      // 监听数据不可用时
      this.audio.addEventListener('stalled', function () {
        if (_this.src === _this.audio.src) {
          _this.$vux.toast.text('音频加载失败，请刷新页面', 'bottom')
        }
      }, false)
    }

    // 按钮操作
    oper () {
      if (this.audio.paused) {
        this.playMusic()
        this.duration = parseInt(this.audio.duration)
      } else {
        this.pauseMusci()
      }
      this.$root.$children[0].audioEven(this.itemIndex)
    }

    // 播放
    playMusic () {
      this.$store.dispatch('music_play')
      this.src = this.source.fileUrl
      this.disabled = true
      // 监听数据不可用时
      if (this.audio.defaultMuted) {
        this.$vux.alert.show({
          title: '提示',
          content: '您已设置静音，请开启！',
        })
      }
    }

    // 暂停
    pauseMusci () {
      this.$store.dispatch('music_pause')
      this.playStatus = 2
    }

    // 播放结束后
    audioEnded() {
      this.progress = 0
      this.moveLeft = 0
      this.audio.currentTime = 0
      this.currentTime = 0
      this.playStatus = 1
    }

    // 进度时间转化
    transTime(value) {
      var time = "";
      var h = parseInt(value / 3600);
      value %= 3600;
      var m = parseInt(value / 60);
      var s = parseInt(value % 60);
      if (h > 0) {
          time = this.formatTime(h + ":" + m + ":" + s);
      } else {
          time = this.formatTime(m + ":" + s);
      }
      return time;
    }

    // 时间格式化
    formatTime(value) {
      var time = "";
      var s = value.split(':');
      time = s[0] + ':' + (s[1].length == 1 ? ("0" + s[1]) : s[1]);
      return time;
    }

    // 滑动开始停止音乐获取起点位置
    touchStart () {
      this.startTime = this.progress
      this.isShowLabel = true
      this.audio.pause()
    }

    // 滑动结束播放音乐获取结束位置
    touchEnd () {
      if (this.audio.paused && !this.audio.ended) {
        this.audio.play()
        this.endTime = this.progress
        this.isShowLabel = false
        if (Math.abs(this.endTime - this.startTime) > 1) {
          this.audio.currentTime = this.progress
          this.endTime = 0
          this.startTime = 0
          
        }
      }
    }

    
  }
</script>
<style>
.audio-wrapper {
  width: 210px;
  height: 40px;
  border-radius: 0 20px 20px 20px;
  background-color: rgba(255, 226, 102, 0.35);
}

.audio-left {
    float: left;
    text-align: center;
    width: 15%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.audio-left img {
    width: 16.5px;
    height: 16.5px;
}

.audio-right {
    float: right;
    width: 85%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding-right: 40px;
    box-sizing: border-box;
}

.progressBar {
  width: 100% !important;
  margin: 0 !important;
}
.range-bar {
  background-color: #fff !important;
}
.range-quantity {
  background-color: #ffe266 !important;
}
.progressBar .range-handle {
  width: 12px !important;
  height: 12px !important;
  background-color: #ffe266 !important;
}

.curTime {
  width: 55px;
  height: 33px;
  border-radius: 1px;
  text-align: center;
  line-height: 33px;
  background-color: #ffe266;
  position: absolute;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.06);
  top: -48px;
  left: 0;
  font-size: 13px;
  color: #354048;
  margin-left: -17.5px;
}
.curTime::after {
  content: '';
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 16px solid #ffe266;
  position: absolute;
  bottom: -14px;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
}

.audio-time {
  width: 40px;
  text-align: center;
  color: #666666;
  font-size: 12px;
  position: absolute;
  right: 0;
}

.audio-length-total {
    float: right;
    font-size: 12px;
}

.audio-length-current {
    float: left;
    font-size: 12px;
}
  .rotateZ {
    animation: rotateZ linear 1s infinite;
  }

  @keyframes rotateZ {
    from {
      transform: rotateZ(0)
    }
    to {
      transform: rotateZ(-360deg)
    }
  }
</style>
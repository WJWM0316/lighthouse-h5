<template>
	<div class="audio-wrapper">
    <div class="audio-left" @click.stop="oper()">
      <img class="playIcon" src="./../../assets/icon/music_play.png" v-if="playStatus === 1"></img>
      <img class="icon-loading rotateZ" src="./../../assets/icon/music_loading.png" v-else-if="playStatus === 2">
      <img class="icon-playing" src="./../../assets/icon/music_listen.gif" v-else>
    </div>
    <div class="audio-right">
      <range v-model="progress" :rangeBarHeight='10' @on-change="onChange" @touchstart.native="touchStart" @touchend.native="touchEnd" :disabled="disabled" v-show="disabled"></range>
      <div class="progress-bar-bg" id="progressBarBg">
      </div>
      <div class="audio-time"><span class="audio-length-current" id="audioCurTime">{{currentTime}}</span><span class="audio-length-total">{{duration}}</span></div>
    </div>
</div>
</template>
<script type="text/javascript">
	import Vue from 'vue'
  import { Range, Cell, Group } from 'vux'
	import Component from 'vue-class-component'
  require('./../../assets/icon/music_play.png')
	@Component({
    name: 'music',
    components: {
      Range,
      Cell,
      Group
    },
    watch: {
      progress (val, old) {
        this.currentTime = val / 100 * this.duration
      }
    }
  })
  export default class music extends Vue {
  	playStatus = 1 // 1 未播放 2 加载中 3播放中
    progress = 0 // 进度条
    currentTime = 0 // 播放帧
    duration = '' // 音频时长
    startTime = 0
    endTime = 0
    rate = 0 // 进度条比例
    audio = ''
    src = ''
    disabled = false //音乐未播放禁止操作进度条
    // 按钮操作
    oper () {
      if (this.audio.paused) {
        this.playMusic()
        this.duration = this.audio.duration
      } else {
        this.pauseMusci()
      }
    }
    playMusic () {
      this.audio.play()
      this.disabled = true
    }
    pauseMusci () {
      this.audio.pause()
      this.playStatus = 1
    }
    // 播放结束
    audioEnded() {
      this.progress = 0
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
      var i = 0;
      for (; i < s.length - 1; i++) {
          time += s[i].length == 1 ? ("0" + s[i]) : s[i];
          time += ":";
      }
      time += s[i].length == 1 ? ("0" + s[i]) : s[i];
      return time;
    }

    onChange (val) {
      // 进度条比例
      this.rate = val / 100
    }

    // 滑动开始停止音乐获取起点位置
    touchStart () {
      this.startTime = this.progress
      this.audio.pause()      
    }

    // 滑动结束播放音乐获取结束位置
    touchEnd () {
      if (this.audio.paused && !this.audio.ended) {
        this.audio.play()
        this.endTime = this.progress
        if (Math.abs(this.endTime - this.startTime) > 5) {
          this.audio.currentTime = this.rate * this.duration
          this.endTime = 0
          this.startTime = 0
        }
      }
      
    }
    // 监听音频播放时间并更新进度条
    mounted () {
      this.audio = new Audio()
      this.audio.src = 'https://cdnstatic.ziwork.com/test/audio/2018-05-29/a8f5355e58555a82969c572e8ca6d489.mp3'
      let _this = this

      // 监听资源下载
      this.audio.addEventListener('progress', function () {
        _this.playStatus = 2
      }, false);

      // 监听可以播放时
      this.audio.addEventListener('canplay', function () {
        _this.playStatus = 1
      }, false);

      // 监听播放过程
      this.audio.addEventListener('timeupdate', function () {
        if (!_this.audio.paused) {
          _this.playStatus = 3
          console.log(11)
        }
        _this.progress = parseInt((_this.audio.currentTime / _this.duration).toFixed(2) * 100)
      }, false)

      // 监听播放完成事件
      this.audio.addEventListener('ended', function () {
        _this.audioEnded();
      }, false);

      
      
    }
    
  }
</script>
<style>
.audio-wrapper {
  background-color: #fcfcfc;
  margin: 10px auto;
  max-width: 670px;
  height: 70px;
  border: 1px solid #e0e0e0;
}

.audio-left {
    float: left;
    text-align: center;
    width: 18%;
    height: 100%;
}

.audio-left img {
    width: 40px;
    position: relative;
    top: 15px;
    margin: 0;
    display: initial;   /* 解除与app的样式冲突 */
    cursor: pointer;
}

.audio-right {
    margin-right: 2%;
    float: right;
    width: 80%;
    height: 100%;
}

.audio-right p {
    font-size: 15px;
    height: 35%;
    margin: 8px 0;

    /* 歌曲名称只显示在一行，超出部分显示为省略号 */
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 243px;   /* 要适配小屏幕手机，所以最大宽度先设小一点，后面js根据屏幕大小重新设置 */    
}

.progress-bar-bg {
    background-color: #d9d9d9;
    position: relative;
    height: 2px;
    cursor: pointer;
}

.progress-bar {
    background-color: #649fec;
    width: 0;
    height: 2px;
}

.progress-bar-bg span {
    content: " ";
    width: 10px;
    height: 10px;
    border-radius: 50%;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    background-color: #3e87e8;
    position: absolute;
    left: 0;
    top: 50%;
    margin-top: -5px;
    margin-left: -5px;
    cursor: pointer;
}

.audio-time {
    overflow: hidden;
    margin-top: -1px;
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
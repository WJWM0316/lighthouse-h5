<template>
	<div class="audio-wrapper">
    <audio ref="audio">
      <source src="https://cdnstatic.zike.com/product/audio/2018-05-27/ffb340c02529772ee36b1fa331fdb0f4.mp3" type="audio/mp3">
    </audio>
    <div class="audio-left" @click.stop="oper()"><image class="playIcon" :src="playIcon"></image></div>
    <div class="audio-right">
      <range v-model="progress" :rangeBarHeight='10' @on-change="onChange" :step="step"></range>
      <div class="progress-bar-bg" id="progressBarBg">
      </div>
      <div class="audio-time"><span class="audio-length-current" id="audioCurTime">{{currentTime}}</span><span class="audio-length-total">01:06</span></div>
    </div>
</div>
</template>
<script type="text/javascript">
	import Vue from 'vue'
  import { Range, Cell, Group } from 'vux'
	import Component from 'vue-class-component'
	@Component({
    name: 'music',
    components: {
      Range,
      Cell,
      Group
    },
    watch: {
      progress (val) {
        // this.step ++
        console.log('进度', val)
      }
    }
  })
  export default class music extends Vue {
  	playIcon  = '../../assets/icon/music_play.png'
    progress = 10
    step = 1
    currentTime = ''
    audio = ''
    // 按钮操作
    oper () {
      if (this.audio.paused) {
        this.audio.play()
      } else {
        this.audio.pause()
      }
    }
    // 进度条
    updateProgress (audio) {
      var value =  audio.currentTime / audio.duration * 100
      this.progress = value
      this.currentTime = this.transTime(this.audio.currentTime);
    }

    audioEnded() {
      this.progress = 0
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
      // console.log('change', val)
    }

    // 监听音频播放时间并更新进度条
    mounted () {
      this.audio = this.$refs.audio
      let _this = this

      // 监听播放过程
      this.audio.addEventListener('timeupdate', function () {
        _this.updateProgress(_this.audio);
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
</style>
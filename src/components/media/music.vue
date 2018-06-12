<template>
	<div class="audio-wrapper"  @click.stop="oper()" ref="musicWrap">
    <div class="audio-left">
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
  import sessionstorage from '@/util/sessionstorage'
  import { musicListApi } from '@/api/pages/pageInfo'
  require('./../../assets/icon/music_play.png')
	@Component({
    name: 'music',
    props: {
      communityId: {
        type: String,
        default: ''
      },
      touerImg: {
        type: String,
        default: ''
      },
      type: {
        type: Number,
        default: 1
      },
      circleId: {
        type: String,
        default: ''
      },
      source: {
        type: Object,
        default: {}
      },
      itemIndex: {
        type: Number,
        default: 0
      },
      isPlayList: {
        type: Boolean,
        default: false
      },
      isTeacher: { // 是否是导师内容列表
        type: Boolean,
        default: false
      },
      isTeacherCon: { // 是否是朋友圈详情
        type: Boolean,
        default: false
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
        musicPlay: state => state.musicController.musicPlay, // 是否播放
        curIndex: state => state.musicController.curIndex, // 播放序号
        isLastPage: state => state.musicController.isLastPage, // 是否有下一页
        isPreload: state => state.musicController.isPreload, // 是否需要预加载
        playList: state => state.musicController.playList, // 播放列表
        prevMusic: state => state.musicController.prevMusic, // 上一首播放
        listener_loadstart: state => state.musicController.listener_loadstart, // 监听状态
        listener_waiting: state => state.musicController.listener_waiting, // 监听状态
        listener_canplay: state => state.musicController.listener_canplay, // 监听状态
        listener_canplaythrough: state => state.musicController.listener_canplaythrough, // 监听状态
        listener_timeupdate: state => state.musicController.listener_timeupdate, // 监听状态
        listener_ended: state => state.musicController.listener_ended, // 监听状态
        listener_stalled: state => state.musicController.listener_stalled // 监听状态
      }),
    },
    watch: {
      communityId (val, old) {
        // this.$store.dispatch('undate_play_list', {})
        // console.log('当前塔' + val, '上一个塔' + old, this.playList)
      },
      isPlayList (val) {
        this.musicList = val.circles
        console.log('进入音频续播页面', val)
      },
      isTeacher () {},
      isTeacherCon () {},
      isLastPage (val) {},
      curIndex (val) {},
      isPreload (val) {},
      progress (val, old) {
        if (this.$refs.range) { this.moveLeft = this.$refs.range.range.handle.style.left }
        this.currentTime = val
      },
      musicPlay (val) {
        if (val === false && this.source.fileUrl === this.audio.src) {
          this.playStatus = 2
        }
      },
      prevMusic (val) {
        if (this.playStatus === 4) {
          this.playStatus = 2
        }
        if (val.currentTime > 0 && val.fileId === this.source.fileId) {
          this.audio.currentTime = val.currentTime
          this.currentTime = val.currentTime
          this.playStatus = val.playStatus
          this.disabled = true
          this.isShowLabel = false
        }
      },
      listener_loadstart (val) {
        this.musicListenerFun('loadstart')
      },
      listener_waiting (val) {
        this.musicListenerFun('waiting')
      },
      listener_canplay (val) {
        this.musicListenerFun('canplay')
      },
      listener_canplaythrough (val) {
        this.musicListenerFun('canplaythrough')
      },
      listener_timeupdate (val) {
        this.musicListenerFun('timeupdate')
      },
      listener_ended (val) {
        this.musicListenerFun('ended')
      },
      listener_stalled (val) {
        this.musicListenerFun('stalled')
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
    curCircleId = '' // 当前circleId
    moveLeft = ''
    isExist = false
    
    disabled = false //音乐未播放禁止操作进度条
    isShowLabel = false // 是否显示游标
    isGetList = true // 检测是否需要重新请求列表
    musicList = [] // 本地记录播放列表 用来累加
    mounted () {
      this.curCircleId = this.circleId
      this.audio = this.$root.$children[0].audio
    }

    musicListenerFun (type) {
      switch (type) {
        case 'loadstart':
          if (this.source.fileUrl === this.audio.src) {
            this.playStatus = 3
          }
          break
        case 'waiting':
          if (this.source.fileUrl === this.audio.src) {
            this.playStatus = 3
          }
          break
        case 'canplay':
          if (this.source.fileUrl === this.audio.src) {
            this.playStatus = 1
          }
          break
        case 'canplaythrough':
          if (this.source.fileUrl === this.audio.src) {
            this.playStatus = 1
          }
          break
        case 'timeupdate':
          if (this.source.fileUrl === this.audio.src) {
            if (!this.audio.paused) {
              this.playStatus = 4
              this.disabled = true
            }
            if (this.$refs.range) { this.moveLeft = this.$refs.range.range.handle.style.left }
            this.progress = this.audio.currentTime
          }
          break
        case 'ended':
          // 同一个组件  或者 导师内容详情
          if (this.source.fileUrl === this.audio.src) {
            console.log('liebiao',  this.playList.circles)
            this.audioEnded()
            // 播放下一首
            // console.log(_this.source.fileUrl, _this.audio.src)
            if (this.isPlayList && this.curIndex < this.playList.circles.length - 1) {
              try {
                this.$store.dispatch('music_play')
                this.$root.$children[0].isAutoPlay = false
                let index = this.curIndex + 1
                this.$store.dispatch('undate_curIndex', index)
                console.log('我要播放的音频', index, this.playList.circles[index].files[0].fileUrl)
                this.audio.src = ''
                this.audio.src = this.playList.circles[index].files[0].fileUrl
                const _this = this
                setTimeout(function () {
                  _this.audio.play()
                }, 100)
                this.$root.$children[0].controllerDetail = {
                  imgUrl: this.touerImg,
                  communityId: this.communityId,
                  circleId: this.playList.circles[index].circleId,
                  type: this.playList.circles[index].circleType
                }
                // 如果还剩2条音频则提前加载下一个列表且还有下一页
                if (this.isLastPage && this.curIndex >= this.playList.circles.length - 2) {
                  this.$store.dispatch('undate_isPreload', true)
                  let data = {
                    communityId: this.communityId,
                    circleId: this.playList.circles[this.playList.circles.length - 1].circleId,
                    count: 5,
                    orderBy: 'asc' //顺序 asc 或者倒叙 desc，默认 asc
                  }
                  musicListApi(data).then(res => {
                    if (res.circles.length < 5) {
                      this.$store.dispatch('undate_isLastPage', false)
                    } else {
                      this.$store.dispatch('undate_isLastPage', true)
                    }
                    let list = res.circles
                    this.playList.circles = this.playList.circles.concat(list || [])
                    this.playList.circles = this.distinct(this.playList.circles)
                    this.$store.dispatch('undate_play_list', this.playList)
                    console.log('预加载后的音频列表', this.playList.circles)
                  })
                }
              }
              catch (e) {
                console.log('调起播放请求被新的加载请求中断,重新播放', e)
                this.audio.play()
              }
            } else {
              console.log('已经全部播放完毕')
              this.audioEnded()
            }
          }
          // 如果不是导师列表音频 音频结束手动重置组件状态
          if (!this.isTeacherCon){
            this.progress = 0
            this.playStatus = 1
          }
          break
        case 'stalled':
          if (this.source.fileUrl === this.audio.src) {
            this.$vux.toast.text('音频加载失败，请刷新页面', 'bottom')
          }
      }
    }


    // 检测播放音频是否存在列表中
    checkCircleId (id) {
      if (this.playList && this.playList.circles) {
        this.playList.circles.filter((item, index) => {
          if (id === item.circleId) {
            if (this.isTeacher) {
              this.$store.dispatch('undate_curIndex', index)
            }
            this.src = item.files[0].fileUrl || item.files.fileUrl
            this.isGetList = false
            console.log(this.curIndex, id, this.src, '我当前的点击')
          }
        })
      }
    }

    // 音频列表数组去重
    distinct (data) {
      let i, j, len = data.length
      for(i = 0; i < len; i++){
        for(j = i + 1; j < len; j++){
         if(data[i].circleId === data[j].circleId){
          data.splice(j,1);
          len--;
          j--;
         }
        }
      }
      console.log('去重', data)
      return data;
    }

    // 获取音频列表
    async getList () {
      this.checkCircleId(this.curCircleId)
      // 判断是否需要重新获取音频列表
      if (this.communityId === this.playList.communityId && !this.isGetList) {
        this.operRoot()
        return false
      }
      // if (this.isLastPage) {
        let data = {
          communityId: this.communityId,
          circleId: this.curCircleId,
          count: 5,
          orderBy: 'asc' //顺序 asc 或者倒叙 desc，默认 asc
        }
        await musicListApi(data).then(res => {
          if (res.circles.length < 5) {
            this.$store.dispatch('undate_isLastPage', false)
          } else {
            this.$store.dispatch('undate_isLastPage', true)
          }
          let list = res
          this.musicList = this.musicList.concat(list.circles || [])
          list.circles = this.distinct(this.musicList)
          this.$store.dispatch('undate_play_list', list)
          this.checkCircleId(this.curCircleId)
          this.operRoot()
        })
      // }
    }

    // 调用根组件开关
    operRoot () {

      if (this.audio.paused || this.audio.src !== this.src) {
        this.playMusic()
      } else {
        this.pauseMusci()
      }
      let data = {
        fileId: this.source.fileId,
        filePath: this.source.fileUrl,
        playStatus: this.playStatus,
        index: this.itemIndex,
        progress: this.progress,
        currentTime: this.currentTime,
        disabled: this.disabled,
        isShowLabel: this.isShowLabel
      }
      this.$root.$children[0].controllerDetail = {
        imgUrl: this.touerImg,
        communityId: this.communityId,
        circleId: this.circleId,
        type: this.type
      }
      this.$root.$children[0].audioEven(data)
    }

    // 按钮操作
    oper () {
      if (this.isPlayList) {
        this.getList()
      } else {
        this.src = this.source.fileUrl
        this.operRoot()
      }  
    }

    // 播放
    playMusic () {
      this.$store.dispatch('music_play')
      this.$root.$children[0].isAutoPlay = true
      this.disabled = true
      if (this.audio.src !== this.src) {
        this.audio.src = this.src
      }
      // 监听数据不可用时
      if (this.audio.defaultMuted) {
        this.$vux.alert.show({
          title: '提示',
          content: '您已设置静音，请开启声音！',
        })
      }
    }

    // 暂停
    pauseMusci () {
      this.$store.dispatch('music_pause')
    }

    // 播放结束后
    audioEnded() {
      this.progress = 0
      this.moveLeft = 0
      this.audio.currentTime = 0
      this.currentTime = 0
      this.playStatus = 1
      this.audio.pause()
      this.$store.dispatch('music_pause')
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
      this.$store.dispatch('music_pause')
      this.audio.pause() 
    }

    // 滑动结束播放音乐获取结束位置
    touchEnd () {
      if (this.audio.paused && !this.audio.ended) {
        this.$store.dispatch('music_play')
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
  top: 50% !important;
  margin-top: -6px !important;
  background-color: #ffe266 !important;
}

.curTime {
  width: 55px;
  height: 33px;
  border-radius: 1px;
  text-align: center;
  line-height: 26px;
  background: url('./../../assets/icon/bg_progressbar_up@3x.png') no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: -35px;
  left: 0;
  font-size: 13px;
  color: #354048;
  margin-left: -21.5px;
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
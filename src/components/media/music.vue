<template>
	<div class="audio-wrapper" :class="{'lesson' : isLesson}"  @click.stop="oper()" ref="musicWrap">
    <div class="audio-left" v-if="!isLesson">
      <img src="./../../assets/icon/music_play.png" v-if="playStatus === 1"></img>
      <img src="./../../assets/icon/stop@3x.png" v-else-if="playStatus === 2"></img>
      <img class="rotateZ" src="./../../assets/icon/music_loading.png" v-else-if="playStatus === 3">
    </div>
    <div class="audio-left" v-if="isLesson">
      <img src="./../../assets/icon/playing.png" v-if="playStatus === 1"></img>
      <img src="./../../assets/icon/playing.gif" v-else-if="playStatus === 2"></img>
      <img class="rotateZ" src="./../../assets/icon/music_loading.png" v-else-if="playStatus === 3">
    </div>
    <div class="audio-right" :class="{'big' : isShowLabel}">
      <range class="progressBar"
        ref="range"
        :key="itemIndex"
        v-show="disabled"
        v-model="progress"
        minHTML=" " 
        maxHTML=" "
        :rangeBarHeight='barHeight' 
        :disabled="disabled" 
        :max="durationData"
        @touchstart.native="touchStart" 
        @touchend.native="touchEnd" >
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
  import { musicListApi, playAudioApi } from '@/api/pages/pageInfo'
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
      isPlayList: {	//是否列表播放
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
      },
      jumpFind: { // 是否是发现页面跳转
        type: Boolean,
        default: false
      },
      isLesson: { // 是否是课节音频
        type: Boolean,
        default: false
      },
      isDetailCon: {	//暂无作用
        type: Boolean,
        default: false
      },
      isTower: {	
        type: Boolean,
        default: false
      },
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
      communityId (val, old) {},
      isPlayList (val) {
        this.musicList = val.circles
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
          this.playStatus = 1
        }
      },
      prevMusic (val) {
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
  	playStatus = 1 // 待播放 2播放中 3加载中
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
    barHeight = 2 // 进度条高度
    mounted () {
    	this.isLesson ? this.barHeight = 8 : this.barHeight = 2
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
          // if (this.source.fileUrl === this.audio.src) {
          //   this.playStatus = 1
          // }
          // break
        case 'timeupdate':
          if (this.source.fileUrl === this.audio.src) {
            if (!this.audio.paused) {
              this.playStatus = 2
              this.disabled = true
            }
            if (this.$refs.range) { this.moveLeft = this.$refs.range.range.handle.style.left }
            this.progress = this.audio.currentTime
          } else {
            // 其他的如果是显示播放状态的改为暂停状态
            if (this.playStatus === 2) {
              this.playStatus = 1
            }
          }
          break
        case 'ended':
          // 同一个组件  或者 导师内容详情
          if (this.source.fileUrl === this.audio.src) {
            this.audioEnded()
            // 播放下一首
            if (this.isPlayList && this.curIndex < this.playList.circles.length - 1) {
              try {
                this.$store.dispatch('music_play')
                this.$root.$children[0].isAutoPlay = false
                let index = this.curIndex + 1
                this.$store.dispatch('undate_curIndex', index)
                
                
                this.removeRed(this.playList.circles[index].files[0].fileId)
                console.log('我要播放的音频', index, this.playList.circles[index].files[0].fileUrl)
                this.audio.src = this.playList.circles[index].files[0].fileUrl
                const _this = this
                setTimeout(function () {
                  _this.audio.play()
                }, 100)
                if (this.isTeacher) {
                  this.$root.$children[0].controllerDetail = {
                    imgUrl: this.touerImg,
                    communityId: this.communityId,
                    circleId: this.playList.circles[index].circleId,
                    type: this.playList.circles[index].circleType,
                    isJoin: true
                  }
                }
                console.log('我要播放的音频', index, this.playList.circles[this.curIndex].files[0].fileId)
                if (!this.playList.circles[this.curIndex].files[0].isPlayed) {
                  let id = this.playList.circles[this.curIndex].files[0].fileId
                    playAudioApi({id}).then(res => {
                    this.source.isPlayed = true
                  })
                } 
                // this.removeRed(this.playList.circles[this.curIndex].files[0].fileId)
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
                const _this = this
                setTimeout(function () {
                  _this.audio.play()
                }, 200)
              }
            } else {
              console.log('已经全部播放完毕')
              this.audioEnded()
            }
          } else {
            // 重置内容详情播放完的状态
            if (this.playStatus === 1) {
              this.progress = 0
              this.moveLeft = 0
              this.audio.currentTime = 0
              this.currentTime = 0
              this.playStatus = 1
              this.audio.pause()
            }
          }
          // 如果不是导师列表音频 音频结束手动重置组件状态
          if (!this.isTeacherCon){
            this.progress = 0
            this.playStatus = 1
            this.currentTime = 0
          }
          break
        case 'stalled':
          if (this.source.fileUrl === this.audio.src) {
            this.$vux.toast.text('音频加载失败，请重新点击播放', 'bottom')
          }
      }
    }
    
    // 消除红点
    async removeRed (fileId) {
      console.log(this.source.isPlayed, this.source.fileId)
      if (!this.source.isPlayed) {
        await playAudioApi({fileId}).then(res => {
          this.source.isPlayed = true
        })
      } 
    }
    

    // 检测播放音频是否存在列表中
    checkCircleId (id) {
      if (this.playList && this.playList.circles) {
        this.playList.circles.filter((item, index) => {
          if (id === item.circleId) {
            if (this.isTeacher || this.isTeacherCon) {
              this.$store.dispatch('undate_curIndex', index)
            }
            this.src = this.source.fileUrl
            this.isGetList = false
            console.log(this.curIndex, id, this.src, '我当前的播放')
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
        setTimeout(res => {
          this.operRoot()
        }, 100)
      })
    }

    // 调用根组件开关
    operRoot () {
      if (this.audio.paused || this.audio.src !== this.src) {
        // ios兼容
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
      let isJoin = false
      let jumpFind = false
      this.jumpFind ? jumpFind = true : jumpFind = false
      this.isTower ? isJoin = true : isJoin = false
      this.$root.$children[0].controllerDetail = {
        imgUrl: this.touerImg,
        communityId: this.communityId,
        circleId: this.circleId,
        type: this.type,
        isJoin: isJoin,
        jumpFind: jumpFind
      }
      console.log(this.$root.$children[0].controllerDetail, 2222222222222)
      this.$root.$children[0].audioEven(data)
    }

    // 按钮操作
    oper () {
      this.$root.$children[0].isBackStage = false
      this.removeRed(this.source.fileId)
      if (this.isPlayList) {
        this.getList()
      } else {
        this.src = this.source.fileUrl
        this.operRoot()
      }  
    }

    // 播放
    playMusic () {
      if (this.playStatus === 2) {
        this.audio.src = ''
      }
      this.$store.dispatch('music_play')
      this.$root.$children[0].isAutoPlay = true
      this.disabled = true
      if (this.audio.src !== this.src) {
        this.audio.src = this.src
      }
    }

    // 暂停
    pauseMusci () {
      this.$store.dispatch('music_pause')
    }
   
    audioEnded() {
      this.progress = 0
      this.moveLeft = 0
      this.audio.currentTime = 0
      this.currentTime = 0
      this.playStatus = 1
      this.disabled = false
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
        const _this = this
        this.$store.dispatch('music_play')
        setTimeout(function () {
          _this.audio.play()
        }, 100)
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
  width: 240px;
  height: 40px;
  border-radius: 0 20px 20px 20px;
  background-color: rgba(255, 226, 102, 0.35);
}
.audio-wrapper.detail {
  width: 210px;
}

.audio-left {
    float: left;
    text-align: center;
    width: 18%;
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
    width: 82%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding-right: 63px;
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
  width: 14px !important;
  height: 14px !important;
  top: 50% !important;
  margin-top: -7px !important;
  margin-left: -7px !important;
  background: none !important;
  box-shadow: none !important;
  display: block;
}
.progressBar .range-handle::after {
  content: '';
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -4px 0 0 -4px;
  border-radius: 50%;
  width: 8px !important;
  height: 8px !important;
  background-color: #ffe266 !important;
}
.big .progressBar .range-handle::after {
  width: 12px !important;
  height: 12px !important;
  margin: -6px 0 0 -6px !important;
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
  margin-left: -25px;
}

.audio-time {
  width: 56px;
  text-align: right;
  color: #666666;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  position: absolute;
  padding-right: 15px;
  padding-left: 3px;
  box-sizing: border-box;
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
.audio-wrapper.lesson {
  width: 335px;
  height: 60px;
  margin: 0 auto;
  box-sizing: border-box;
  border-radius: 30px !important;
  background:rgba(255,226,102,0.12);
}
.audio-wrapper.lesson .audio-left {
  width: 73px;
}
.audio-wrapper.lesson .audio-left img {
  width: 44px;
  height: 44px;
}
.audio-wrapper.lesson .audio-left img.rotateZ {
  width: 22px;
  height: 22px;
}
.audio-wrapper.lesson .audio-right .progressBar .range-handle {
  width: 12px !important;
  height: 12px !important;
  background : #fff !important;
  box-shadow:0px 2px 8px 0px rgba(255,226,102,1) !important;
}
.audio-wrapper.lesson .audio-right .progressBar .range-handle::after {
  content: none;
}
.audio-wrapper.lesson .audio-right {
  width: 262px;
}
.audio-wrapper.lesson .audio-right .audio-time {
  padding-right: 25px;
}
.audio-wrapper.lesson .audio-right .range-bar {
  background:#EDEDED !important;
  border-radius:5px;
}
</style>
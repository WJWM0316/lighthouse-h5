<template>
  <div id="app" style="height: 100%" v-cloak>
  	<keep-alive>
       <router-view v-if="$route.meta.keepAlive">
          <!-- 这里是会被缓存的视图组件！ -->
       </router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive">
      <!-- 这里是不被缓存的视图组件！ -->
    </router-view>
    <tabbar slot="bottom" id="homeNav" class="home-nav" v-show="isNavShow"
            @on-index-change="goSomeWhere">
      <tabbar-item :selected="isSelected(tab.src)"
                   :key="index"
                   v-for="(tab, index) in tabList">
        <img slot="icon" :src="tab.icon">
        <img slot="icon-active" :src="tab.selectIcon">
        <span slot="label">{{tab.label}}</span>
      </tabbar-item>
    </tabbar>
    <div class="musicControl" v-show="isShowController && !$route.meta.hideController">
      <div class="fileImg" @click.stop="jumpDeatil()"><img :src="controllerDetail.imgUrl" alt=""></div>
      <div class="playBtn" @click.stop="musicControl()">
        <img src="./assets/icon/bnt_yuyin_play@3x.png" v-show="!musicPlay">
        <img src="./assets/icon/stop@3x.png" v-show="musicPlay">
      </div>
      <div class="closeBtn" v-show="!musicPlay" @click.stop="closeContraler()">
        <img src="./assets/icon/bnt_suspensionbar_clos@3x.png" alt="">
      </div>
    </div>
    <div class="home-mask" v-if="isShowQrcodes">
      <div class="qr-container">
        <i class="u-icon-close icon-close" @click="closeQrCode(1)"></i>
        <div class="title">支付成功</div>
        <div class="content">长按识别二维码，添加课程小助手拉您加入课程交流群</div>
        <img class="qrcode" src="./assets/page/qr_kf_1.jpg">
      </div>
    </div>
    <div class="home-mask" v-if="isShowQrcodes2">
      <div class="qr-container">
        <i class="u-icon-close icon-close" @click="closeQrCode(2)"></i>
        <div class="title">支付成功</div>
        <div class="content">长按识别二维码，来撩客服小姐姐~</div>
        <img class="qrcode" src="./assets/page/qr_kf_2.jpg">
      </div>
    </div>
    <div class="home-mask" v-if="isShowQrcodes3">
      <div class="qr-container">
        <i class="u-icon-close icon-close" @click="closeQrCode(3)"></i>
        <div class="title">支付成功</div>
        <div class="content">长按识别二维码，来撩客服小姐姐~</div>
        <img class="qrcode" src="./assets/page/qr_kf_3.jpg">
      </div>
    </div>
    <div class="home-mask" v-if="isShowQrcodes4">
      <div class="qr-container">
        <i class="u-icon-close icon-close" @click="closeQrCode(4)"></i>
        <div class="title">支付成功</div>
        <div class="content">长按识别二维码，立即进入课程学员交流群~~</div>
        <img class="qrcode" src="./assets/page/qr_kf_4.png">
      </div>
    </div>

  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { Tabbar, TabbarItem, ViewBox, XCircle, cookie } from 'vux'
import { mapState } from 'vuex'
import wxUtil from '@/util/wx'
import browser from '@/util/browser'
import sessionstorage from '@/util/sessionstorage'
import settings from '@/config/index'
import WechatMixin from '@/mixins/wechat'
import {newCountCodeApi, musicListApi, playAudioApi} from '@/api/pages/pageInfo'
@Component({
  name: 'app',
  mixins: [WechatMixin],
  components: {
    Tabbar,
    TabbarItem,
    ViewBox,
    XCircle
  },
  computed: {
    isNavShow: function () { // 导航条是否展示
      return this.$store.getters.navIsShow
    },
    isShowQrcodes: function () { // 公众号二维码是否展示
      return this.$store.getters.isShowQrcode
    },
    isShowQrcodes2: function () { // 公众号二维码是否展示
      return this.$store.getters.isShowQrcode2
    },
    isShowQrcodes3: function () { // 公众号二维码是否展示
      return this.$store.getters.isShowQrcode3
    },
    isShowQrcodes4: function () { // 公众号二维码是否展示
      return this.$store.getters.isShowQrcode4
    },
    ...mapState({
      musicPlay: state => state.musicController.musicPlay, // 是否播放
      playList: state => state.musicController.playList, // 播放列表
      prevMusic: state => state.musicController.prevMusic, // 上一首播放
      isLastPage: state => state.musicController.isLastPage, // 是否有下一页
      isPreload: state => state.musicController.isPreload, // 是否需要预加载
      curIndex: state => state.musicController.curIndex, // 播放序号
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
    '$route': {
      handler (route) {
        wxUtil.fixedUrl()
        // 自定义分享信息路径
        const customSharePageName = ['introduce', 'introduce-detail', 'community', 'center-help', 'distribution-rankings']
        if (customSharePageName.indexOf(route.name) < 0) {
          // 页面分享信息
          this.wechatShare({
            'titles': '小灯塔|互联网职场学习平台|照亮你职场的路',
            'title': '小灯塔|互联网职场学习平台|照亮你职场的路',
            'desc': '名师高徒，社群化训练和学习！职场人脉，吸收大咖进阶干货！',
            'imgUrl': 'https://cdnstatic.zike.com/Uploads/static/beacon/lighthouse-logo.png',
            'link': location.origin + '/beaconweb/#/'
          })
        }
        //  数据统计 如果路由参数测试  则发送统计请求
        const { messageId='' } = this.$route.query || ''
        const { communityId } = this.$route.params || ''
        const params = {
          messageId
        }
        if (messageId) {
          this.countCode(params)
        }
        let storageMusic = sessionstorage.get('storageMusic')
        if (storageMusic && communityId) {
          const storageId = storageMusic.controllerDetail.communityId
          if (storageId !== communityId) {
            this.isBackStage = true
          } else {
            this.isBackStage = false
          }
        }
        
      },
      immediate: true
    },
    musicPlay (val) {}
  }
})
export default class App extends Vue {
  tabList = [
    {
      icon: require('./assets/icon/tab-lighthouse-2@3x.png'),
      selectIcon: require('./assets/icon/invalid-name@3x.png'),
      src: '/index',
      label: '灯塔'
    },
    {
      icon: require('./assets/icon/tab_discover@3x.png'),
      selectIcon: require('./assets/icon/tab_discover_pre@3x.png'),
      src: '/find',
      label: '发现'
    },
    {
      icon: require('./assets/icon/tab-massage-2@3x.png'),
      selectIcon: require('./assets/icon/tab-massage-1@3x.png'),
      src: '/message',
      label: '消息'
    },
    {
      icon: require('./assets/icon/tab-me-2@3x.png'),
      selectIcon: require('./assets/icon/tab-me-1@3x.png'),
      src: '/center',
      label: '我的'
    }
  ]
  data () {
    return {
      audio: '', // 音频载体
      isShowController: false, // 是否现在音频悬浮窗
      curUrl: '', // 记录播放路径，用来判断音频切换
      cur: {}, // 当前播放音频的对象
      prev: [], // 播放过音频的记录
      isAutoPlay: false, // 是否自动播放
      isBackStage: false, // 切换不同塔后续播问题
      communityId: '', // 获取路径communityId
      controllerDetail: {
        imgUrl: '',
        communityId: '',
        circleId: '',
        type: '',
        isJoin: false,
        jumpFind: false
      }
    }
  }
  goSomeWhere (index) {
    this.$router.push(this.tabList[index].src)
  }
  isSelected (src) {
    return this.$route.path === src
  }
  closeQrCode (type) {
    this.$store.dispatch('hide_qr', {type})
    location.reload()
  }
  async countCode (params) {
    await newCountCodeApi(params)
  }

  mounted () {
    this.audio = new Audio()
    const _this = this
    let iosAutoPlay = false
    if (browser._version.ios) {
      let _this = this
      this.audio.src = 'https://cdnstatic.ziwork.com/test/audio/2018-06-14/73e5119b2e475c94f38d8e44e2b9dbdf.mp3'
      document.addEventListener("WeixinJSBridgeReady", function () {
        if (_this.audio.src === 'https://cdnstatic.ziwork.com/test/audio/2018-06-14/73e5119b2e475c94f38d8e44e2b9dbdf.mp3') {
           _this.audio.play()
        }
      }, false)
    }
    // 页面刷新后 用于本地存储记录播放位置
    let storageMusic = sessionstorage.get('storageMusic')
    if (storageMusic && !this.$route.meta.hideController) {
      console.log(storageMusic, '本地存储')
      this.controllerDetail = storageMusic.controllerDetail
      if (this.controllerDetail.isJoin) {
        this.$store.dispatch('undate_isLastPage', storageMusic.isLastPage)
        this.$store.dispatch('undate_play_list', storageMusic.playList)
        this.$store.dispatch('undate_curIndex', storageMusic.curIndex)
        this.$store.dispatch('undate_isPreload', storageMusic.isPreload)
        this.$store.dispatch('undate_play_list', storageMusic.playList)
        this.$store.dispatch('undate_listener_loadstart', storageMusic.listener_loadstart)
        this.$store.dispatch('undate_listener_waiting', storageMusic.listener_waiting)
        this.$store.dispatch('undate_listener_canplay', storageMusic.listener_canplay)
        this.$store.dispatch('undate_listener_canplaythrough', storageMusic.listener_canplaythrough)
        this.$store.dispatch('undate_listener_timeupdate', storageMusic.listener_timeupdate)
        this.$store.dispatch('undate_listener_ended', storageMusic.listener_ended)
        this.$store.dispatch('undate_listener_stalled', storageMusic.listener_stalled)
        this.audio.src = storageMusic.playList.circles[storageMusic.curIndex].files[0].fileUrl
      } else {
        this.audio.src = storageMusic.curUrl
      }
      if (storageMusic.musicPlay) {
        this.$store.dispatch('music_play')
        this.isShowController = true
        this.audio.currentTime = storageMusic.currentTime
        // ios 自动播放
        this.audio.play()
        document.addEventListener("WeixinJSBridgeReady", function () {
          iosAutoPlay = true
          if (storageMusic.currentTime > 0) {
             _this.audio.currentTime = storageMusic.currentTime
           setTimeout(function () {
              _this.audio.play()
            }, 300)
          }
        }, false)
      } else {
        this.isShowController = false
        this.$store.dispatch('music_pause')
      }
    }
    function storageFun () {
      let storageMusic = {
        musicPlay: _this.musicPlay,
        curUrl: _this.audio.src,
        playList: _this.playList,
        curIndex: _this.curIndex,
        currentTime: _this.audio.currentTime,
        controllerDetail: _this.controllerDetail,
        isLastPage: _this.isLastPage,
        isPreload: _this.isPreload,
        listener_loadstart: _this.listener_loadstart,
        listener_waiting: _this.listener_waiting,
        listener_canplay: _this.listener_canplay,
        listener_loadstart: _this.listener_loadstart,
        listener_canplaythrough: _this.listener_canplaythrough,
        listener_timeupdate: _this.listener_timeupdate,
        listener_ended: _this.listener_ended,
        listener_stalled: _this.listener_stalled
      }
      sessionstorage.set('storageMusic', storageMusic)
    }
    
    // 在文件开始加载且未实际加载任何数据前运行的脚本。
    this.audio.addEventListener('loadstart', function () {
      let data = _this.listener_loadstart
      data ++
      _this.$store.dispatch('undate_listener_loadstart', data)
    }, false)

    // 当媒介已停止播放但打算继续播放时（比如当媒介暂停已缓冲更多数据）运行脚本
    this.audio.addEventListener('waiting', function () {
      let data = _this.listener_waiting
      data ++
      _this.$store.dispatch('undate_listener_waiting', data)
    }, false)

    // 当文件就绪可以开始播放时运行的脚本（缓冲已足够开始时）
    this.audio.addEventListener('canplay', function () {
      let data = _this.listener_canplay
      data ++
      _this.$store.dispatch('undate_listener_canplay', data)
      if (storageMusic.currentTime > 0 && iosAutoPlay) {
        iosAutoPlay = false
        _this.audio.currentTime = storageMusic.currentTime
      }
    }, false)

    // 当媒介能够无需因缓冲而停止即可播放至结尾时运行的脚本
    this.audio.addEventListener('canplaythrough', function () {
      let data = _this.listener_canplaythrough
      data ++
      _this.$store.dispatch('undate_listener_canplaythrough', data)
    }, false)

    // 当媒介被用户或程序暂停时运行的脚本。
    this.audio.addEventListener('pause', function () {
      _this.$store.dispatch('music_pause')
      _this.audio.pause()
    }, false)

    // // 当播放位置改变时（比如当用户快进到媒介中一个不同的位置时）运行的脚本。
    this.audio.addEventListener('timeupdate', function () {
      let data = _this.listener_timeupdate
      data ++
      _this.$store.dispatch('undate_listener_timeupdate', data)
      storageFun()
    }, false)

    // // 当媒介已到达结尾时运行的脚本（可发送类似“感谢观看”之类的消息
    
    this.audio.addEventListener('ended', function () {
      if (_this.isBackStage) {
        // 播放下一首
        console.log('我是根我要下一首了', _this.curIndex, _this.playList.circles.length - 1)
        if (_this.curIndex < _this.playList.circles.length - 1) {
          try {
            _this.$store.dispatch('music_play')
            _this.$root.$children[0].isAutoPlay = false
            let index = _this.curIndex + 1
            _this.$store.dispatch('undate_curIndex', index)
            console.log('我要播放的音频', index, _this.playList.circles[index].files[0].fileUrl)
            if (!_this.playList.circles[_this.curIndex].files[0].isPlayed) {
              _this.removeRed(_this.playList.circles[_this.curIndex].files[0].fileId)
            }
            _this.audio.src = _this.playList.circles[index].files[0].fileUrl
            setTimeout(function () {
              _this.audio.play()
            }, 100)
            let storageMusic = sessionstorage.get('storageMusic')
            _this.controllerDetail = storageMusic.controllerDetail
            // 如果还剩2条音频则提前加载下一个列表且还有下一页
            if (_this.isLastPage && _this.curIndex >= _this.playList.circles.length - 2) {
              _this.$store.dispatch('undate_isPreload', true)
              let data = {
                communityId: _this.controllerDetail.communityId,
                circleId: _this.playList.circles[_this.playList.circles.length - 1].circleId,
                count: 5,
                orderBy: 'asc' //顺序 asc 或者倒叙 desc，默认 asc
              }
              musicListApi(data).then(res => {
                if (res.circles.length < 5) {
                  _this.$store.dispatch('undate_isLastPage', false)
                } else {
                  _this.$store.dispatch('undate_isLastPage', true)
                }
                let list = res.circles
                _this.playList.circles = _this.playList.circles.concat(list || [])
                _this.playList.circles = _this.distinct(_this.playList.circles)
                _this.$store.dispatch('undate_play_list', _this.playList)
                console.log('预加载后的音频列表', _this.playList.circles)
              })
            }
          }
          catch (e) {
            console.log('调起播放请求被新的加载请求中断,重新播放', e)
            setTimeout(function () {
              _this.audio.play()
            }, 100)
          }
        } else {
          console.log('已经全部播放完毕')
        }
      } else {
        let data = _this.listener_ended
        data ++
        _this.$store.dispatch('undate_listener_ended', data)
      }
      storageFun()
    }, false)

    // 在浏览器不论何种原因未能取回媒介数据时运行的脚本。
    this.audio.addEventListener('stalled', function () {
      _this.$store.dispatch('music_pause')
      let data = _this.listener_stalled
      data ++
      _this.$store.dispatch('undate_listener_stalled', data)
    }, false)


    // 
    
  }

  // 消除红点
  removeRed (fileId) {
    playAudioApi({fileId}).then(res => {
    })
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
  jumpDeatil () {
    if (this.controllerDetail.isJoin) {
      this.$router.push('/details/' + this.controllerDetail.circleId + '/' + this.controllerDetail.type + '?communityId=' + this.controllerDetail.communityId)
    } else {
      if (this.controllerDetail.jumpFind) {
        let modeType = 'circle'
        switch (this.controllerDetail.type) {
          case 1:
            modeType = 'circle'
            break
          case 2:
            modeType = 'post'
            break
          case 3:
            modeType = 'problem'
            break
        }
        this.$router.push('/index/details/' + this.controllerDetail.circleId + '/?modeType=' + modeType)
      }
      
    }
  }
  // 悬浮窗开关
  musicControl () {
    if (this.audio.paused) {
      const _this = this
      setTimeout(function () {
        _this.audio.play()
      }, 100)
      this.$store.dispatch('music_play')
    } else {
      this.audio.pause()
      this.$store.dispatch('music_pause')
    }
  }
  // 关闭悬浮窗
  closeContraler () {
    this.isShowController = false
  }
  // 控制全局音乐播放被音频组件调用
  audioEven (data) {
    this.isShowController = true // 打开悬浮窗
    this.cur = data
    // 总开关
    if (this.audio.paused) {
      try {
        if (this.curUrl !== data.filePath) {
          this.curUrl = data.filePath
          // 记录上一个播放记录
          if (this.prev.length === 0 || this.prev[this.prev.length-1] && this.prev[this.prev.length-1].fileId !== data.fileId && this.isAutoPlay) {
            this.prev.push(this.cur)
            this.prev[0].currentTime = this.audio.currentTime
            this.audio.ended ? this.prev[0].playStatus = 1 : this.prev[0].playStatus = 1
            this.$store.dispatch('undate_prevMusic', this.prev[this.prev.length-1])
            if (this.prev.length > 2) {
              this.prev.shift()
            }
          }
          // // 点击不一样的音频就要换url了
          // this.audio.src = data.filePath
        }
        const _this = this
        // 开始播放
        console.log('开始播放')
        this.audio.play()
        setTimeout(function () {
          _this.audio.play().catch(function (e) {
            console.log(e, '阻塞了重新调起play()')
            _this.audio.play()
          })
        }, 500)
      }
      catch (e) {
        // this.audio.play()
        console.log(e, 'src还未赋予报错后直接重新调起play')
      }
    } else {
      // 暂停
      this.audio.pause()
      console.log('暂停播放')
    }
  }
}
</script>

<style lang="less" type="text/less">
@import "./styles/index";
[v-cloak] {
  display: none !important;
} 
.home-nav {
  left: 50%;
  transform: translateX(-50%);
  max-width: 375px;
}
.home-mask {
  z-index: 1000;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(38, 38, 38, .5);
  .qr-container{
    position: relative;
    left: 50%;
    top: 50%;
    margin-left: -142px;
    margin-top: -151px;
    width: 285px;
    height: 302px;
    background: #fff;
    border-radius: 6px;
    text-align: center;
  }
  .icon-close{
    position: absolute;
    right: 16px;
    top: 16px;
  }
  .title{
    color: #354048;
    font-size: 22px;
    padding-top: 31px;
  }
  .content{
    position: relative;
    color: #666666;
    font-size: 15px;
    margin-top: 8px;
    padding: 0 10px;
  }
  .qrcode{
    margin-top: 12px;
    width: 160px;
    height: 160px;
  }
}
.weui-tabbar {
  background-color: #FFF !important;
}
.musicControl {
  height: 44px;
  padding: 0 15px 0 3px;
  border-radius: 44px;
  background: #fff;
  position: fixed;
  left: 10px;
  bottom: 64px;
  display: flex;
  align-items: center;
  box-shadow: 0 1.5px 6px 0 rgba(0, 0, 0, 0.18);
  .fileImg {
    width: 38px;
    height:38px;
    border-radius: 50%;
    overflow: hidden;
    &.playing {
      animation: playing 20000s linear infinite;
    }
    @keyframes playing {
      0% { transform: rotate(0deg) }
      100% { transform: rotate(3600000deg) }
    }
    img {
      width: 38px;
      height:38px;
      display: block;
    }
  }
  .playBtn, .closeBtn {
    width: 20px;
    margin-left: 15px;
    img {
      width: 100%;
      display: block;
    }
  }
}
</style>

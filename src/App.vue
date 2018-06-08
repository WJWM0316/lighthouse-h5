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
      <div class="fileImg" :class="{'playing' : musicPlay}"><img src="https://cdnstatic.ziwork.com/Uploads/static/picture/2018-06-04/10e47b75b8395107d0a516cce1c2032c.png" alt=""></div>
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
import settings from '@/config/index'
import WechatMixin from '@/mixins/wechat'
import {newCountCodeApi, musicListApi} from '@/api/pages/pageInfo'
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
      prevMusic: state => state.musicController.prevMusic // 上一首播放
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
        const params = {
          messageId
        }
        if (messageId) {
          this.countCode(params)
        }
      },
      immediate: true
    },
    musicPlay () {}
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
      isAutoPlay: false // 是否自动播放
    }
  }
  goSomeWhere (index) {
//    if (index === 1) {
//      window.location.href = this.tabList[1].src
//      return
//    }
    this.$router.replace(this.tabList[index].src)
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
    this.audio.reload = false
    // this.$store.dispatch('undate_play_list', this.playList)
  }

  // 悬浮窗开关
  musicControl () {
    if (this.audio.paused) { 
      this.audio.play()
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
    if (this.musicPlay) {
      try {
        if (this.curUrl !== data.filePath) {
          this.curUrl = data.filePath
          // 记录上一个播放记录
          if (this.prev.length === 0 || this.prev[this.prev.length-1] && this.prev[this.prev.length-1].fileId !== data.fileId && this.isAutoPlay) {
            this.prev.push(this.cur)
            this.prev[0].currentTime = this.audio.currentTime
            this.audio.ended ? this.prev[0].playStatus = 1 : this.prev[0].playStatus = 2
            this.$store.dispatch('undate_prevMusic', this.prev[this.prev.length-1])
            console.log('切换音乐了')
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
        this.audio.play().catch(function (e) {
          console.log(e, '阻塞了重新调起play')
          _this.audio.play()
        })
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
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.18);
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

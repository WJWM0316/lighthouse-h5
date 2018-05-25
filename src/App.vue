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
        <div class="content">长按识别二维码，立即进入课程学员交流群~</div>
        <img class="qrcode" src="./assets/page/qr_kf_4.jpg">
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
import {newCountCodeApi} from '@/api/pages/pageInfo'
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
    }
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
        console.log('code222222', messageId)
        if (messageId) {
          this.countCode(params)
        }

      },
      immediate: true
    }
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
</style>

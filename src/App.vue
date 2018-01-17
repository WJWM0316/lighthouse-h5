<template>
  <div id="app" style="height: 100%">
    <router-view></router-view>
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
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { Tabbar, TabbarItem, ViewBox, XCircle, cookie } from 'vux'
import { mapState } from 'vuex'
import settings from '@/config/index'
import WechatMixin from '@/mixins/wechat'

@Component({
  name: 'app',
//  mixins: [WechatMixin],
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
  },
  watch: {
//    '$route': {
//      handler (route) {
//        // 自定义分享信息路径
//        const customSharePageName = ['introduce', 'introduce-detail', 'community', 'center-help']
//        if (customSharePageName.indexOf(route.name) < 0) {
//          // 页面分享信息
//          this.wechatShare({
//            'titles': '小灯塔|职场导师知识分享社区|照亮你职场的路',
//            'title': '小灯塔|职场导师知识分享社区|照亮你职场的路',
//            'desc': '名师高徒，社群化训练和学习！职场人脉，吸收大咖进阶干货！',
//            'imgUrl': 'https://cdnstatic.zike.com/Uploads/static/beacon/head-banner.png',
//            'link': location.origin + '/beaconweb'
//          })
//        }
//      },
//      immediate: true
//    }
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
  created () {
//    var ua = navigator.userAgent.toLowerCase()
//    var isWeixin = ua.indexOf('micromessenger') !== -1
//    if (!isWeixin) {
//      document.head.innerHTML = '<title>抱歉，出错了</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0"><link rel="stylesheet" type="text/css" href="https://res.wx.qq.com/connect/zh_CN/htmledition/style/wap_err1a9853.css">'
//      document.body.innerHTML = '<div class="page_msg"><div class="inner"><span class="msg_icon_wrp"><i class="icon80_smile"></i></span><div class="msg_content"><h4>请在微信客户端打开链接</h4></div></div></div>'
//    }
  }
}
</script>

<style lang="less" type="text/less">
@import "./styles/index";

.home-nav {
  left: 50%;
  transform: translateX(-50%);
  max-width: 375px;
}
</style>

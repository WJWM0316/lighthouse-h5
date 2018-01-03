<template>
  <div id="app">
    <router-view></router-view>
    <tabbar slot="bottom" id="homeNav" class="home-nav" v-show="isNavShow"
            @on-index-change="goSomeWhere">
      <tabbar-item :selected="isSelected(tab.src)"
                   :key="index"
                   v-for="tab,index in tabList"
      >
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

@Component({
  name: 'app',
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
    isSelected (src) {
      return this.$route.path === src
    }
  },
  watch: {
  }
})
export default class App extends Vue {
  tabList = [
    {
      icon: require('./assets/home/home@3x.png'),
      selectIcon: require('./assets/home/home_selected@3x.png'),
      src: '/index',
      label: '首页'
    },
    {
      icon: require('./assets/home/zike@3x.png'),
      selectIcon: require('./assets/home/zike_selected@3x.png'),
      src: settings.urlService,
      label: '约见'
    },
    {
      icon: require('./assets/home/purchased@3x.png'),
      selectIcon: require('./assets/home/purchased_selected@3x.png'),
      src: '/buy/course',
      label: '已购'
    },
    {
      icon: require('./assets/home/me@3x.png'),
      selectIcon: require('./assets/home/me_selected@3x.png'),
      src: '/user/index',
      label: '我的'
    }
  ]
  goSomeWhere (index) {
    if (index === 1) {
      window.location.href = this.tabList[1].src
      return
    }
    this.$router.replace(this.tabList[index].src)
  }
}
</script>

<style lang="less" type="text/less">
@import "./styles/index";
</style>

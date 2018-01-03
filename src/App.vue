<template>
  <div id="app">
    <router-view></router-view>
    <!--<tabbar slot="bottom" id="homeNav" class="home-nav" v-show="isNavShow"-->
            <!--@on-index-change="goSomeWhere">-->
      <!--<tabbar-item :selected="isSelected(tab.src)"-->
                   <!--:key="index"-->
                   <!--v-for="tab,index in tabList"-->
      <!--&gt;-->
        <!--<img slot="icon" :src="tab.icon">-->
        <!--<img slot="icon-active" :src="tab.selectIcon">-->
        <!--<span slot="label">{{tab.label}}</span>-->
      <!--</tabbar-item>-->
    <!--</tabbar>-->
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { Tabbar, TabbarItem, ViewBox, XCircle, cookie } from 'vux'
import { mapState } from 'vuex'

@Component({
  name: 'app',
  components: {
    Tabbar,
    TabbarItem,
    ViewBox,
    XCircle
  },
  computed: {
  },
  watch: {
  }
})
export default class App extends Vue {
}
</script>

<style lang="less" type="text/less">
@import "./styles/index";
</style>

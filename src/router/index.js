import Vue from 'vue'
import Router from 'vue-router'
// 引入模块路由
import homes from './home'
import centers from './center'
import messages from './message'
import login from './login'
import page from './page'
import exchange from './exchange'
import store from './../store'
import { share } from '@/api/wx/share'

Vue.use(Router)

const routes = [
  ...homes, // 首页
  ...centers, // 我的
  ...messages, // 消息
  ...page,
  ...login, // 登录
  ...exchange // 交换微信
]

const router = new Router({
  mode: 'history',
  base: '/beaconweb/',
  routes
})

router.beforeEach(async (to, from, next) => {
  if (!to.matched.length) {
    router.push('/404')
    next()
  }
  // 控制导航条是否显示
  if (to.matched.some(record => record.meta.navHide)) {
    store.dispatch('hide_nav')
  } else {
    store.dispatch('show_nav')
  }
  // 是否使用自定义分享
  if (!to.matched.some(record => record.meta.customShare)) {
    // 页面分享信息
    share(this.$wechat, this.$http, {
      'titles': '小灯塔|职场导师知识分享社区|照亮你职场的路',
      'title': '小灯塔|职场导师知识分享社区|照亮你职场的路',
      'desc': '名师高徒，社群化训练和学习！职场人脉，吸收大咖进阶干货！',
      'imgUrl': 'https://cdnstatic.zike.com/Uploads/static/beacon/head-banner.png',
      'link': location.origin
    })
  }
  next() // 确保一定要调用 next()
})
//
router.afterEach(function (to) {
})

// 全局路由生命周期
export default router

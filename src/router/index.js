import Vue from 'vue'
import Router from 'vue-router'
// 引入模块路由
import homes from './home'
import centers from './center'
import messages from './message'
import find from './find'
import login from './login'
import page from './page'
import exchange from './exchange'
import store from './../store'

Vue.use(Router)

const routes = [
  ...homes, // 首页
  ...centers, // 我的
  ...messages, // 消息
  ...find, // 发现
  ...page,
  ...login, // 登录
  ...exchange // 交换微信
]

const router = new Router({
  // mode: 'history',
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
  
  next() // 确保一定要调用 next()
})
//
router.afterEach(function (to, from) {
})

// 全局路由生命周期
export default router

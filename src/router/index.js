import Vue from 'vue'
import Router from 'vue-router'
// 引入模块路由
import homes from './home'
import tests from './test'
import store from './../store'
// 请求接口
import {isLoginApi} from '@/api/page/account'

Vue.use(Router)

const routes = [
  ...homes, // 首页
  ...tests // test
]

const router = new Router({
  mode: 'history',
  base: '/zikeweb/',
  routes
})

// router.beforeEach((to, from, next) => {
//   if (!to.matched.length) {
//     router.push('/404')
//   }
//   window.scroll(0, 0)
//   next()
// })

router.beforeEach(async (to, from, next) => {
  if (!to.matched.length) {
    router.push('/404')
    next()
  }
  // // 进入'我的'和'已购'之前先验证是否登录，同样也会导致没有在登录页记录来源路径
  // if (to.name === 'userIndex' || to.name === 'buy') {
  //   await isLoginApi()
  // }
  // 控制导航条是否显示
  if (to.matched.some(record => record.meta.navHide)) {
    store.dispatch('hide_nav')
  } else {
    store.dispatch('show_nav')
  }
  // // 音乐悬浮条是否显示
  // if (to.matched.some(record => record.meta.musicStripHide)) {
  //   store.dispatch('hide_music_stript')
  // } else {
  //   store.dispatch('show_music_stript')
  // }
  // // 音乐悬浮条距离底部高度
  // if (to.matched.some(record => record.meta.musicStripBottom > -1)) {
  //   let bottom = to.matched[0].meta.musicStripBottom
  //   store.dispatch('update_music_stript_bottom_height', bottom)
  // } else {
  //   store.dispatch('update_music_stript_bottom_height', 84)
  // }
  next() // 确保一定要调用 next()
})
//
router.afterEach(function (to) {
})

// 全局路由生命周期
export default router

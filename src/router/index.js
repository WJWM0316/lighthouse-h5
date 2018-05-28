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

  // 介绍页面需要做百度统计
  if (to.name === 'introduce') {
    setTimeout(()=>{
     var _hmt = _hmt || [];
     (function() {
      //每次执行前，先移除上次插入的代码
      document.getElementById('baidu_tj') && document.getElementById('baidu_tj').remove();
      var hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?1b0222be6ebebf7e6f77215105fe92f1";
      hm.id = "baidu_tj"
      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(hm, s);
     })();
   },0);
  } else {
    document.getElementById('baidu_tj') && document.getElementById('baidu_tj').remove();
  }
  next() // 确保一定要调用 next()
})
//
router.afterEach(function (to, from) {

})

// 全局路由生命周期
export default router

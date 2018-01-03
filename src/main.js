// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import FastClick from 'fastclick'
import router from '@/router/index'
import './components' // 全局组件
import App from './App'
import './filters'
import './util/flexible'

import store from './store/'

// import { AlertPlugin, ToastPlugin, WechatPlugin } from 'vux'

// Vue.use(AlertPlugin)
// Vue.use(ToastPlugin)
// Vue.use(WechatPlugin)
// Vue.use(ConfirmPlugin, {
//   $layout: 'VIEW_BOX'
// })

// FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')

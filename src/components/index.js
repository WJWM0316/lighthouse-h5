// 注册全局组件
import Vue from 'vue'

import { AlertPlugin, ToastPlugin, WechatPlugin, ConfirmPlugin, LoadingPlugin } from 'vux'

import Image from './imageItem'
import BottomLoading from './bottomLoading'

Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
Vue.use(WechatPlugin)
Vue.use(ConfirmPlugin)
Vue.use(LoadingPlugin)

Vue.use(Image)
Vue.use(BottomLoading)

window.wx = Vue.wechat

// 注册全局组件
import Vue from 'vue'

import { AlertPlugin, ToastPlugin, ConfirmPlugin, LoadingPlugin } from 'vux'
import wx from 'weixin-js-sdk'
import Image from './imageItem'
import BottomLoading from './bottomLoading'
Vue.prototype.$wechat = wx
Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)
Vue.use(LoadingPlugin)
Vue.use(Image)
Vue.use(BottomLoading)

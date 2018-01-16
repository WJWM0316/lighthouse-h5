// import wx from 'http://res.wx.qq.com/open/js/jweixin-1.2.0.js'

const plugin = {
  install (Vue) {
    Vue.prototype.$wechat = wx
    Vue.wechat = wx
  },
  $wechat: wx
}

export default plugin
// export const install = plugin.install

import WechatCodeModal from './WechatCodeModal'

WechatCodeModal.install = function (Vue) {
  Vue.component(WechatCodeModal.options.name, WechatCodeModal)
}

export default WechatCodeModal

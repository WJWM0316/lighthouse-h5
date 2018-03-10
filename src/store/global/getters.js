export default {
  getLoading (state) {
    return state.ajax_loading
  },
  navIsShow: function (state) {
    return state.nav_show
  },
  isShowQrcode: function (state) {
    return state.nav_qr
  },
  viewScrollTop: function (state) {
    return state.viewScrollTop
  },
  musicStripBottomHeight: function (state) {
    return state.musicStripBottomHeight
  },
  musicStripIsShow: function (state) {
    return state.musicStripIsShow
  },
  showPayDialog: function (state) {
    return state.showPayDialog
  },
  showNoviceList: function (state) {
    return state.showNoviceList
  },
  showNoviceDetail: function (state) {
    return state.showNoviceDetail
  },
  showNoviceHome: function (state) {
    return state.showNoviceHomeBanner
  },
  wechatReady: function (state) {
    return state.wechatReady
  }
}

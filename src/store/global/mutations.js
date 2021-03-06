import * as types from './mutations_types'

export default {
  [types.SHOW_LOADING] (state) {
    state.ajax_loading = true
  },
  [types.HIDE_LOADING] (state) {
    state.ajax_loading = false
  },
  [types.SET_LOADED] (state, isLoaded) {
    state.loaded = isLoaded
  },
  [types.SHOW_NAV] (state) {
    state.nav_show = true
  },
  [types.HIDE_NAV] (state) {
    state.nav_show = false
  },
  [types.SHOW_QR] (state, {type}) {
    switch (type) {
      case 2:
        state.qr_show2 = true
        break
      case 3:
        state.qr_show3 = true
        break
      case 4:
        state.qr_show4 = true
        break
      default:
        state.qr_show = true
        break
    }
  },
  [types.HIDE_QR] (state, type) {
    switch (type) {
      case 2:
        state.qr_show2 = false
        break
      case 3:
        state.qr_show3 = false
        break
      case 4:
        state.qr_show4 = false
        break
      default:
        state.qr_show = false
        break
    }
  },
  [types.UPDATE_VIEWSCROLLTOP] (state, scrollTop) {
    state.viewScrollTop = scrollTop
  },
  [types.UPDATE_MUSICSTRIPSHOW] (state, is) {
    state.musicStripIsShow = is
  },
  [types.UPDATE_MUSICSTRIPBOTTOMHEIGHT] (state, height) {
    state.musicStripBottomHeight = height
  },
  [types.UPDATE_PAYDIALOG] (state, show) {
    state.showPayDialog = show
  },
  [types.UPDATE_NOVICE_LIST] (state, show) {
    state.showNoviceList = show
  },
  [types.UPDATE_NOVICE_DETAIL] (state, show) {
    state.showNoviceDetail = show
  },
  [types.UPDATE_NOVICE_HOME] (state, show) {
    state.showNoviceHomeBanner = show
  },
  [types.WECHAT_READY] (state) {
    state.wechatReady = true
  }
}

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

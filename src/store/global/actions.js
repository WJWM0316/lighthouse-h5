import * as types from './mutations_types'

export default {
  show_loading: ({commit, state}) => {
    return new Promise((resolve, reject) => {
      commit(types.SET_LOADED, false)
      setTimeout(() => {
        if (!state.loaded) commit(types.SHOW_LOADING)
      }, 300)
      resolve()
    })
  },

  hide_loading: ({commit}) => {
    return new Promise((resolve, reject) => {
      commit(types.SET_LOADED, true)
      commit(types.HIDE_LOADING)
      resolve()
    })
  },

  show_nav: ({commit}) => {
    return new Promise((resolve, reject) => {
      commit(types.SHOW_NAV)
      resolve()
    })
  },

  hide_nav: ({commit}) => {
    return new Promise((resolve, reject) => {
      commit(types.HIDE_NAV)
      resolve()
    })
  },

  show_qr: ({commit}, {type}) => {
    return new Promise((resolve, reject) => {
      commit(types.SHOW_QR, {type})
      resolve()
    })
  },

  hide_qr: ({commit}) => {
    return new Promise((resolve, reject) => {
      commit(types.HIDE_QR)
      resolve()
    })
  },

  show_music_stript: ({
    commit
  }) => {
    return new Promise((resolve, reject) => {
      commit(types.UPDATE_MUSICSTRIPSHOW, true)
      resolve()
    })
  },

  hide_music_stript: ({
    commit
  }) => {
    return new Promise((resolve, reject) => {
      commit(types.UPDATE_MUSICSTRIPSHOW, false)
      resolve()
    })
  },

  update_viewScrollTop: ({
    commit
  }, scrollTop) => {
    return new Promise((resolve, reject) => {
      commit(types.UPDATE_VIEWSCROLLTOP, scrollTop)
      resolve()
    })
  },

  update_music_stript_bottom_height: ({
    commit
  }, height) => {
    return new Promise((resolve, reject) => {
      commit(types.UPDATE_MUSICSTRIPBOTTOMHEIGHT, height)
      resolve()
    })
  },

  update_pay_dialog: ({
    commit
  }, isShow) => {
    return new Promise((resolve, reject) => {
      commit(types.UPDATE_PAYDIALOG, isShow)
      resolve()
    })
  },

  update_novice_list: ({
    commit
  }, isShow) => {
    return new Promise((resolve, reject) => {
      commit(types.UPDATE_NOVICE_LIST, isShow)
      resolve()
    })
  },

  update_novice_detail: ({
    commit
  }, isShow) => {
    return new Promise((resolve, reject) => {
      commit(types.UPDATE_NOVICE_DETAIL, isShow)
      resolve()
    })
  },

  update_novice_home: ({
    commit
  }, isShow) => {
    return new Promise((resolve, reject) => {
      commit(types.UPDATE_NOVICE_HOME, isShow)
      resolve()
    })
  },

  wechat_ready: ({ commit }) => new Promise((resolve, reject) => {
    commit(types.WECHAT_READY)
    resolve()
  })
}

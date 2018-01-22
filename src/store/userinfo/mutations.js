import * as types from './mutations_types'

import localstorage from '@/util/localstorage/index'

export default {
  [types.UPDATE_USERINFO] (state, userDb) {
    state.userinfo = userDb.userinfo || {}
    localstorage.set('userinfo', state.userinfo)
  },

  [types.UPDATE_USERINFO_FIELD] (state, newField) {
    state.userinfo = {...state.userinfo, ...newField}
    localstorage.set('userinfo', state.userinfo)
  },

  [types.REMOVE_USERINFO] (state) {
    localstorage.remove('userinfo')
    state.userinfo = {}
  },

  [types.UPDATE_FIRSTREADING] (state) {
    localstorage.set('first_reading', 1)
    state.firstReading = 1
  }
}

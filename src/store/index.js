import Vue from 'vue'
import Vuex from 'vuex'
// // plugins
// import plugins from './plugins'
import userInfo from './userinfo/'
import musicController from './musicController/'
import global from './global/'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    global,
    userInfo,
    musicController
  }
  // plugins
})
